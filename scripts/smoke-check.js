#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SEARCH_INDEX_PATH = path.join(ROOT, 'search-index.js');
const CHATBOT_INDEX_PATH = path.join(ROOT, 'chatbot-index.json');
const HTML_FILES = fs.readdirSync(ROOT).filter((name) => name.endsWith('.html'));

const errors = [];

function addError(message) {
  errors.push(message);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compileFile(label, source) {
  try {
    new vm.Script(source, { filename: label });
  } catch (err) {
    addError(`${label}: ${err.message}`);
  }
}

function checkSearchIndexSyntax() {
  const source = fs.readFileSync(SEARCH_INDEX_PATH, 'utf8');
  compileFile('search-index.js', source);
  return source;
}

function checkInlineScripts() {
  for (const file of HTML_FILES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const matches = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
    matches.forEach((match, idx) => {
      // ES module scripts legitimately use import/export and can't be
      // validated as classic scripts via vm.Script — skip them.
      if (/type\s*=\s*["']module["']/i.test(match[0])) return;
      compileFile(`${file}#inline-${idx}`, match[1]);
    });
  }
}

function evaluateSearchIndex(searchIndexSource) {
  const context = {
    window: {
      localStorage: { getItem: () => null },
    },
    document: {
      getElementById: () => null,
      querySelector: () => null,
      createElement: () => ({}),
      addEventListener: () => {},
      head: { appendChild: () => {} },
    },
  };
  vm.createContext(context);
  try {
    vm.runInContext(`${searchIndexSource}\nthis.__idx = SEARCH_INDEX;`, context);
  } catch (err) {
    addError(`search-index.js evaluation failed: ${err.message}`);
    return [];
  }
  if (!Array.isArray(context.__idx)) {
    addError('search-index.js did not expose SEARCH_INDEX as an array.');
    return [];
  }
  return context.__idx;
}

function checkSearchIndexLinks(index) {
  for (const item of index) {
    const url = String((item && item.u) || '').trim();
    const title = String((item && item.t) || '(untitled)');
    if (!url) {
      addError(`Missing URL for search item: ${title}`);
      continue;
    }

    // External links (SharePoint, Microsoft Forms, Office viewer, mailto, …)
    // can't be resolved against the local filesystem — skip them.
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) continue;

    const [file, hash] = url.split('#');
    const filePath = path.join(ROOT, decodeURIComponent(file));
    if (!fs.existsSync(filePath)) {
      addError(`Missing file for search item "${title}": ${url}`);
      continue;
    }

    if (!hash) continue;
    const html = fs.readFileSync(filePath, 'utf8');
    const escapedHash = escapeRegExp(hash);
    const idRe = new RegExp(`id=["']${escapedHash}["']`);
    const nameRe = new RegExp(`name=["']${escapedHash}["']`);
    if (!idRe.test(html) && !nameRe.test(html)) {
      addError(`Missing hash target for search item "${title}": ${url}`);
    }
  }
}

function checkChatbotIndex() {
  if (!fs.existsSync(CHATBOT_INDEX_PATH)) {
    addError('chatbot-index.json missing — run `node scripts/build-chatbot-index.js`.');
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(CHATBOT_INDEX_PATH, 'utf8'));
  } catch (err) {
    addError(`chatbot-index.json: ${err.message}`);
    return null;
  }
  if (!parsed || !Array.isArray(parsed.chunks)) {
    addError('chatbot-index.json: missing chunks array');
    return null;
  }
  if (parsed.chunks.length === 0) {
    addError('chatbot-index.json: chunks array is empty');
  }
  return parsed;
}

const PHONE_DIRECTORY_FILE = 'ed-phone-directory.html';
const SUBTITLE_SEP = '  ·  ';
// Number formatting lives on the directory page; re-run it here rather than
// re-implementing it, so the two can never disagree about a row's display form.
const DIRECTORY_FUNCTIONS = [
  'fullNumberPrefixForHospital',
  'extensionToFullNumber',
  'toTelUri',
  'extractDialableNumbers',
  'buildNumberPresentation',
  'entryTypeFromSection',
];

function balancedEnd(source, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function sliceBlock(html, startIndex) {
  if (startIndex < 0) return null;
  const open = html.indexOf('{', startIndex);
  if (open < 0) return null;
  const end = balancedEnd(html, open);
  if (end < 0) return null;
  return html.slice(startIndex, end + 1);
}

// Flatten data.<hospital>.<SECTION>[] into the rows the page would render,
// each carrying the display string buildNumberPresentation() gives it.
function loadPhoneDirectoryRows(html) {
  const dataLiteral = sliceBlock(html, html.indexOf('const data = {'));
  if (!dataLiteral) {
    addError(`${PHONE_DIRECTORY_FILE}: could not extract the \`const data = {\` literal.`);
    return null;
  }
  const functionSources = [];
  for (const name of DIRECTORY_FUNCTIONS) {
    const source = sliceBlock(html, html.indexOf(`function ${name}(`));
    if (!source) {
      addError(`${PHONE_DIRECTORY_FILE}: could not extract function ${name}().`);
      return null;
    }
    functionSources.push(source);
  }

  const context = {};
  vm.createContext(context);
  try {
    vm.runInContext(
      `${dataLiteral};\n${functionSources.join('\n')}\n`
      + 'this.__data = data;\n'
      + 'this.__present = buildNumberPresentation;\n'
      + 'this.__typeOf = entryTypeFromSection;',
      context,
      { filename: `${PHONE_DIRECTORY_FILE}#phone-directory-data` }
    );
  } catch (err) {
    addError(`${PHONE_DIRECTORY_FILE}: phone-directory data failed to evaluate: ${err.message}`);
    return null;
  }

  const rows = [];
  for (const hospital of ['omc', 'fmc']) {
    const sections = context.__data[hospital] || {};
    for (const [section, entries] of Object.entries(sections)) {
      if (!Array.isArray(entries)) continue;
      entries.forEach((item) => {
        const meta = context.__present(item.number || '', item.type, hospital, section);
        rows.push({
          hospital,
          section,
          name: String(item.name || ''),
          number: String(item.number || ''),
          note: String(item.note || ''),
          display: meta.display || String(item.number || ''),
          type: context.__typeOf(section),
        });
      });
    }
  }
  if (!rows.length) {
    addError(`${PHONE_DIRECTORY_FILE}: phone-directory data produced no rows.`);
    return null;
  }
  return rows;
}

function normalizeDirectoryText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// "FMC — Pod A" -> the fmc LOCATIONS row named "Pod A". The normalized retry is
// needed because a few curated titles punctuate the row name differently
// ("FMC — Radiology Evening Supervisor" vs the row "Radiology — Evening
// Supervisor"). Same-name rows are told apart by the subtitle's leading number,
// without which "FMC — Neurosurgery" (Virtualist, 9p–3a) would resolve onto the
// pager row instead.
function resolveDirectoryRow(item, rows) {
  const match = /^(FMC|OMC)\s+—\s+(.*)$/.exec(String(item.t || ''));
  if (!match) return { skip: true };
  const hospital = match[1].toLowerCase();
  const name = match[2];

  let candidates = rows.filter((row) => row.hospital === hospital && row.name === name);
  if (!candidates.length) {
    candidates = rows.filter((row) => row.hospital === hospital
      && normalizeDirectoryText(row.name) === normalizeDirectoryText(name));
  }
  if (!candidates.length) return { hospital, missing: true };
  if (candidates.length === 1) return { hospital, row: candidates[0] };

  const head = String(item.s || '').split(SUBTITLE_SEP)[0];
  const exact = candidates.find((row) => row.number === head || row.display === head);
  if (!exact) return { hospital, ambiguous: candidates.length };
  return { hospital, row: exact };
}

// Guards the curated phone/staff entries against the drift that let a row's
// notes be pasted onto a neighbouring row: the title named one row while the
// subtitle quoted another's beeper number or hours, and nothing caught it
// because only `t:` was ever compared against the directory.
function checkPhoneDirectorySubtitles(index) {
  const htmlPath = path.join(ROOT, PHONE_DIRECTORY_FILE);
  if (!fs.existsSync(htmlPath)) {
    addError(`${PHONE_DIRECTORY_FILE} is missing — cannot verify curated phone subtitles.`);
    return 0;
  }
  const rows = loadPhoneDirectoryRows(fs.readFileSync(htmlPath, 'utf8'));
  if (!rows) return 0;

  let checked = 0;
  for (const item of index) {
    if (!item || typeof item !== 'object') continue;
    if (String(item.u || '').split('#')[0] !== PHONE_DIRECTORY_FILE) continue;
    if (item.type !== 'phone' && item.type !== 'staff') continue;

    const label = `search-index.js "${item.t}"`;
    const resolved = resolveDirectoryRow(item, rows);
    // Entries without an "FMC — "/"OMC — " prefix are standalone outside
    // numbers (CPS, APS, the member line) with no directory row to check.
    if (resolved.skip) continue;
    if (resolved.missing) {
      addError(`${label}: no ${resolved.hospital.toUpperCase()} directory row carries this name — the title has drifted from ${PHONE_DIRECTORY_FILE}.`);
      continue;
    }
    if (resolved.ambiguous) {
      addError(`${label}: ${resolved.ambiguous} ${resolved.hospital.toUpperCase()} rows share this name and none has number "${String(item.s || '').split(SUBTITLE_SEP)[0]}", so the subtitle cannot be verified.`);
      continue;
    }

    const row = resolved.row;
    const segments = String(item.s || '').split(SUBTITLE_SEP);
    checked += 1;

    if (segments.length < 3) {
      addError(`${label}: subtitle "${item.s}" is missing the trailing "<section>${SUBTITLE_SEP}<hospital>" parts.`);
      continue;
    }
    if (segments[0] !== row.number && segments[0] !== row.display) {
      addError(`${label}: subtitle opens with "${segments[0]}" but the row's number is "${row.number}".`);
    }
    const tail = segments.slice(-2);
    if (tail[0] !== row.section.toLowerCase() || tail[1] !== row.hospital) {
      addError(`${label}: subtitle ends "${tail.join(SUBTITLE_SEP)}" but the row sits in "${row.section.toLowerCase()}${SUBTITLE_SEP}${row.hospital}".`);
    }

    // A middle segment that this row does not account for, but that is verbatim
    // another row's note, was pasted from that row. Segments no row claims are
    // left alone: those are the hand-curated synonyms and cross-references the
    // entries exist for.
    const ownText = `${row.number} ${row.note} ${row.display}`.toLowerCase();
    for (const segment of segments.slice(1, -2)) {
      if (ownText.includes(segment.toLowerCase())) continue;
      const owner = rows.find((other) => other.hospital === row.hospital
        && other !== row
        && other.note
        && normalizeDirectoryText(other.note) === normalizeDirectoryText(segment));
      if (owner) {
        addError(`${label}: subtitle segment "${segment}" is the note on the ${owner.hospital.toUpperCase()} ${owner.section} row "${owner.name}", not on "${row.name}".`);
      }
    }
  }
  return checked;
}

function run() {
  const source = checkSearchIndexSyntax();
  checkInlineScripts();
  const index = evaluateSearchIndex(source);
  checkSearchIndexLinks(index);
  const phoneSubtitles = checkPhoneDirectorySubtitles(index);
  const chatbot = checkChatbotIndex();
  const chatbotJsPath = path.join(ROOT, 'chatbot.js');
  if (fs.existsSync(chatbotJsPath)) {
    compileFile('chatbot.js', fs.readFileSync(chatbotJsPath, 'utf8'));
  }

  if (errors.length) {
    console.error('Smoke check failed.');
    errors.forEach((msg) => console.error(`- ${msg}`));
    process.exit(1);
  }

  console.log('Smoke check passed.');
  console.log(`- HTML files checked: ${HTML_FILES.length}`);
  console.log('- search-index.js syntax checked');
  console.log(`- SEARCH_INDEX entries checked: ${index.length}`);
  console.log(`- curated phone-directory subtitles verified: ${phoneSubtitles}`);
  if (chatbot) console.log(`- chatbot-index.json chunks: ${chatbot.chunks.length}`);
}

run();
