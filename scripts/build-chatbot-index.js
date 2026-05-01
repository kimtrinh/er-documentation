#!/usr/bin/env node
// Builds chatbot-index.json — section-aware text chunks from every site
// HTML page plus the structured service-agreements index. Pure-Node, no deps.
// Run: node scripts/build-chatbot-index.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'chatbot-index.json');
const SKIP = new Set(['home.html.bak', 'mockup-redesign.html']);
const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4']);
const SECTION_CLASSES = new Set([
  'sec-head', 'section-label', 'drug-name', 'card-title',
  'tile-title', 'announcement-title', 'panel-title'
]);
const STRIP_BLOCK_TAGS = ['script', 'style', 'svg', 'noscript', 'nav', 'header', 'footer'];
const MAX_CHUNK_CHARS = 700;
const MIN_CHUNK_CHARS = 40;

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '”')
    .replace(/&ldquo;/g, '“')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function stripBlocks(html) {
  let out = html.replace(/<!--[\s\S]*?-->/g, '');
  for (const tag of STRIP_BLOCK_TAGS) {
    const re = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, 'gi');
    out = out.replace(re, ' ');
  }
  return out;
}

function getAttr(tagSrc, name) {
  const m = tagSrc.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[2] !== undefined ? m[2] : m[3]) : null;
}

function classList(tagSrc) {
  const cls = getAttr(tagSrc, 'class');
  return cls ? cls.split(/\s+/).filter(Boolean) : [];
}

function tokenize(html) {
  // Yields { kind: 'open'|'close'|'text', tag?, src?, text?, start?, end? }
  const tokens = [];
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      const text = html.slice(i);
      if (text.trim()) tokens.push({ kind: 'text', text, start: i, end: html.length });
      break;
    }
    if (lt > i) {
      const text = html.slice(i, lt);
      if (text.trim()) tokens.push({ kind: 'text', text, start: i, end: lt });
    }
    const gt = html.indexOf('>', lt + 1);
    if (gt === -1) break;
    const raw = html.slice(lt, gt + 1);
    if (raw.startsWith('<!')) { i = gt + 1; continue; }
    const isClose = raw.startsWith('</');
    const tagMatch = raw.match(/^<\/?\s*([a-zA-Z0-9]+)/);
    if (!tagMatch) { i = gt + 1; continue; }
    const tag = tagMatch[1].toLowerCase();
    tokens.push({ kind: isClose ? 'close' : 'open', tag, src: raw, start: lt, end: gt + 1 });
    i = gt + 1;
  }
  return tokens;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[—–−]/g, '-')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
}

const ANNOTATE_BLOCK_TAGS = new Set(['script', 'style', 'svg', 'noscript', 'nav', 'header', 'footer']);

// Walks original HTML, generates slug ids for boundary elements that lack one,
// and rewrites the file in-place. Idempotent — re-runs are no-ops once ids exist.
function annotateHtml(filePath, html) {
  const tokens = tokenize(html);
  const used = new Set();
  for (const m of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)) used.add(m[1]);

  let blockedDepth = 0;
  const subs = [];

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];
    if (t.kind === 'open' && ANNOTATE_BLOCK_TAGS.has(t.tag)) blockedDepth++;
    if (t.kind === 'close' && ANNOTATE_BLOCK_TAGS.has(t.tag)) blockedDepth = Math.max(0, blockedDepth - 1);
    if (blockedDepth > 0) continue;
    if (!isBoundary(t)) continue;
    if (getAttr(t.src, 'id')) continue;

    // Capture inner text up to matching close tag.
    let depth = 1;
    const inner = [];
    for (let j = idx + 1; j < tokens.length; j++) {
      const u = tokens[j];
      if (u.kind === 'open' && u.tag === t.tag) depth++;
      else if (u.kind === 'close' && u.tag === t.tag) {
        depth--;
        if (depth === 0) break;
      } else if (u.kind === 'text') inner.push(u.text);
    }
    const heading = decodeEntities(inner.join(' ')).replace(/\s+/g, ' ').trim();
    const baseSlug = slugify(heading);
    if (!baseSlug) continue;
    let candidate = baseSlug;
    let n = 2;
    while (used.has(candidate)) candidate = `${baseSlug}-${n++}`;
    used.add(candidate);

    // Inject id="..." right after the tag name in the open tag.
    const newSrc = t.src.replace(/^<([a-zA-Z0-9]+)/, `<$1 id="${candidate}"`);
    subs.push({ start: t.start, end: t.end, newSrc });
  }

  if (!subs.length) return html;
  let out = html;
  for (let k = subs.length - 1; k >= 0; k--) {
    const s = subs[k];
    out = out.slice(0, s.start) + s.newSrc + out.slice(s.end);
  }
  fs.writeFileSync(filePath, out);
  return out;
}

function isBoundary(token) {
  if (token.kind !== 'open') return false;
  if (HEADING_TAGS.has(token.tag)) return true;
  const classes = classList(token.src);
  return classes.some((c) => SECTION_CLASSES.has(c));
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : '';
}

function flushBuffer(buffer, current, chunks, page, pageTitle) {
  const text = buffer.join(' ').replace(/\s+/g, ' ').trim();
  if (text.length < MIN_CHUNK_CHARS) return;
  // Split on sentence boundaries when too long.
  if (text.length <= MAX_CHUNK_CHARS) {
    chunks.push(makeChunk(page, pageTitle, current, text));
    return;
  }
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [text];
  let cur = '';
  for (const s of sentences) {
    if ((cur + s).length > MAX_CHUNK_CHARS && cur) {
      chunks.push(makeChunk(page, pageTitle, current, cur.trim()));
      cur = s;
    } else {
      cur += s;
    }
  }
  if (cur.trim().length >= MIN_CHUNK_CHARS) {
    chunks.push(makeChunk(page, pageTitle, current, cur.trim()));
  }
}

function makeChunk(page, pageTitle, current, text) {
  const url = current.anchor ? `${page}#${current.anchor}` : page;
  return {
    page,
    pageTitle,
    section: current.heading || pageTitle,
    anchor: current.anchor || null,
    url,
    text
  };
}

function chunkPage(page, html) {
  const cleaned = stripBlocks(html);
  const pageTitle = extractTitle(html) || page;
  const tokens = tokenize(cleaned);

  const chunks = [];
  let buffer = [];
  let current = { heading: pageTitle, anchor: null };
  // Track inline heading-text capture
  let captureInto = null; // when inside a heading tag, route text into this
  let captureBuf = [];
  let captureDepth = 0;

  for (const tok of tokens) {
    if (tok.kind === 'open' && isBoundary(tok)) {
      // flush previous section
      flushBuffer(buffer, current, chunks, page, pageTitle);
      buffer = [];
      const id = getAttr(tok.src, 'id');
      captureInto = { tag: tok.tag, anchor: id };
      captureBuf = [];
      captureDepth = 1;
      continue;
    }
    if (captureInto) {
      if (tok.kind === 'open' && tok.tag === captureInto.tag) captureDepth++;
      if (tok.kind === 'close' && tok.tag === captureInto.tag) {
        captureDepth--;
        if (captureDepth <= 0) {
          const heading = decodeEntities(captureBuf.join(' ')).replace(/\s+/g, ' ').trim();
          current = {
            heading: heading || current.heading,
            anchor: captureInto.anchor || null
          };
          captureInto = null;
          captureBuf = [];
        }
        continue;
      }
      if (tok.kind === 'text') captureBuf.push(tok.text);
      continue;
    }
    if (tok.kind === 'text') {
      buffer.push(decodeEntities(tok.text));
    }
  }
  flushBuffer(buffer, current, chunks, page, pageTitle);
  return chunks;
}

function chunksFromServiceAgreements() {
  const p = path.join(ROOT, 'data', 'service_agreements_index.json');
  if (!fs.existsSync(p)) return [];
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const out = [];
  const pageHtml = fs.existsSync(path.join(ROOT, 'service-agreements.html'))
    ? fs.readFileSync(path.join(ROOT, 'service-agreements.html'), 'utf8')
    : '';
  for (const a of data.agreements || []) {
    const idAnchor = a.id && new RegExp(`id=["']${a.id}["']`).test(pageHtml) ? a.id : null;
    const url = idAnchor ? `service-agreements.html#${idAnchor}` : 'service-agreements.html';
    const parts = [];
    if (a.summary_bullets) parts.push(...a.summary_bullets);
    if (a.ed_actions) parts.push(...a.ed_actions);
    if (a.consults_and_escalation) parts.push(...a.consults_and_escalation);
    if (a.disposition_or_ownership) parts.push(...a.disposition_or_ownership);
    if (a.timing_targets) parts.push(...a.timing_targets);
    const tags = (a.tags || []).join(' ');
    const depts = (a.departments || []).join(' ');
    const text = `${tags} ${depts} ${parts.join(' ')}`.replace(/\s+/g, ' ').trim();
    if (text.length < MIN_CHUNK_CHARS) continue;
    if (text.length <= MAX_CHUNK_CHARS) {
      out.push({
        page: 'service-agreements.html',
        pageTitle: 'Service Agreements',
        section: a.title || a.id,
        anchor: idAnchor,
        url,
        text
      });
    } else {
      // simple sentence split
      const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [text];
      let cur = '';
      for (const s of sentences) {
        if ((cur + s).length > MAX_CHUNK_CHARS && cur) {
          out.push({
            page: 'service-agreements.html',
            pageTitle: 'Service Agreements',
            section: a.title || a.id,
            anchor: idAnchor,
            url,
            text: cur.trim()
          });
          cur = s;
        } else {
          cur += s;
        }
      }
      if (cur.trim().length >= MIN_CHUNK_CHARS) {
        out.push({
          page: 'service-agreements.html',
          pageTitle: 'Service Agreements',
          section: a.title || a.id,
          anchor: idAnchor,
          url,
          text: cur.trim()
        });
      }
    }
  }
  return out;
}

function chunksFromSearchIndex(pageIdsByFile) {
  const p = path.join(ROOT, 'search-index.js');
  if (!fs.existsSync(p)) return [];
  const source = fs.readFileSync(p, 'utf8');
  const ctx = { window: { localStorage: { getItem: () => null } }, document: {
    getElementById: () => null, querySelector: () => null,
    createElement: () => ({}), addEventListener: () => {}, head: { appendChild: () => {} }
  } };
  vm.createContext(ctx);
  try {
    vm.runInContext(`${source}\nthis.__idx = SEARCH_INDEX;`, ctx);
  } catch (err) {
    console.warn('search-index.js eval failed:', err.message);
    return [];
  }
  const entries = Array.isArray(ctx.__idx) ? ctx.__idx : [];
  const out = [];
  for (const e of entries) {
    const title = String(e.t || '').trim();
    const sub = String(e.s || '').replace(/\s+/g, ' ').trim();
    const group = String(e.g || '').trim();
    const url = String(e.u || '').trim();
    if (!title || !url) continue;
    const text = [title, sub, group, e.type].filter(Boolean).join(' · ');
    if (text.length < MIN_CHUNK_CHARS && text.length < 20) continue;
    let [page, anchor] = url.split('#');
    // If no anchor in the curated URL, try to find one whose slug matches the
    // entry title on that page — promotes curated hits to deep links.
    if (!anchor && pageIdsByFile && pageIdsByFile[page]) {
      const titleSlug = slugify(title);
      if (titleSlug) {
        const ids = pageIdsByFile[page];
        if (ids.has(titleSlug)) {
          anchor = titleSlug;
        } else {
          // Fuzzy: id starts with the title slug ("norepinephrine-levophed").
          for (const id of ids) {
            if (id.startsWith(titleSlug + '-') || id === titleSlug) { anchor = id; break; }
          }
        }
      }
    }
    const finalUrl = anchor ? `${page}#${anchor}` : page;
    out.push({
      page,
      pageTitle: group || page,
      section: title,
      anchor: anchor || null,
      url: finalUrl,
      text,
      curated: true
    });
  }
  return out;
}

function build() {
  const files = fs.readdirSync(ROOT)
    .filter((f) => f.endsWith('.html') && !SKIP.has(f))
    .sort();
  const chunks = [];
  const pageIdsByFile = {};
  let annotatedFiles = 0;
  for (const file of files) {
    const filePath = path.join(ROOT, file);
    const original = fs.readFileSync(filePath, 'utf8');
    const annotated = annotateHtml(filePath, original);
    if (annotated !== original) annotatedFiles++;
    pageIdsByFile[file] = new Set(
      [...annotated.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1])
    );
    const pageChunks = chunkPage(file, annotated);
    chunks.push(...pageChunks);
  }
  chunks.push(...chunksFromServiceAgreements());
  chunks.push(...chunksFromSearchIndex(pageIdsByFile));

  // Dedupe near-identical chunks (same url + same first 80 chars).
  const seen = new Set();
  const deduped = [];
  for (const c of chunks) {
    const key = `${c.url}::${c.text.slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(c);
  }

  const output = {
    version: 1,
    builtAt: new Date().toISOString(),
    pageCount: files.length,
    chunkCount: deduped.length,
    chunks: deduped
  };
  fs.writeFileSync(OUT, JSON.stringify(output));
  const bytes = fs.statSync(OUT).size;
  console.log(`Wrote ${OUT}`);
  console.log(`  pages: ${files.length}`);
  console.log(`  pages annotated with ids: ${annotatedFiles}`);
  console.log(`  chunks: ${deduped.length}`);
  console.log(`  size: ${(bytes / 1024).toFixed(1)} KB`);
}

build();
