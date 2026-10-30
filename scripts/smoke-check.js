#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SEARCH_INDEX_PATH = path.join(ROOT, 'search-index.js');
const CHATBOT_INDEX_PATH = path.join(ROOT, 'chatbot-index.json');
const PHONE_DIRECTORY_PATH = path.join(ROOT, 'ed-phone-directory.html');
const HTML_FILES = fs.readdirSync(ROOT).filter((name) => name.endsWith('.html'));

const errors = [];
let searchIndexHelpers = null;

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
    vm.runInContext(
      `${searchIndexSource}\n` +
      'this.__idx = SEARCH_INDEX;\n' +
      'this.__phoneQuery = kpPhoneQueryForTitle;\n' +
      'this.__extToFull = kpExtensionToFullNumber;',
      context
    );
  } catch (err) {
    addError(`search-index.js evaluation failed: ${err.message}`);
    return [];
  }
  if (!Array.isArray(context.__idx)) {
    addError('search-index.js did not expose SEARCH_INDEX as an array.');
    return [];
  }
  searchIndexHelpers = {
    phoneQuery: context.__phoneQuery,
    extToFull: context.__extToFull,
  };
  return context.__idx;
}

// ── PHONE DIRECTORY DEEP LINKS ─────────────────────────────────────────────
// Phone rows link to ed-phone-directory.html?q=<row name>, which the page
// feeds into its own filter. That only works while the index titles still
// match the directory's row names, and they had silently drifted on eight
// rows. This is the ?q= analogue of checkSearchIndexLinks' hash check: parse
// the directory's own data and helpers and prove every deep link resolves.

// Brace-count from the first `{` at or after `from`, returning the balanced
// block. The regexes in these functions use {3}/{4}/{5}, which are balanced,
// so a naive counter is sufficient here.
function sliceBalanced(source, from) {
  const open = source.indexOf('{', from);
  if (open < 0) return '';
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (!depth) return source.slice(open, i + 1);
    }
  }
  return '';
}

function sliceFunction(source, name) {
  const start = source.indexOf(`\nfunction ${name}(`);
  if (start < 0) return '';
  const body = sliceBalanced(source, start);
  if (!body) return '';
  return source.slice(start + 1, source.indexOf(body, start) + body.length);
}

// Reuses the directory's own number logic, so this check cannot drift from
// what the page actually renders.
const PHONE_DIRECTORY_FNS = [
  'toTelUri',
  'extractDialableNumbers',
  'fullNumberPrefixForHospital',
  'extensionToFullNumber',
  'buildNumberPresentation',
];

function loadPhoneDirectory() {
  const html = fs.readFileSync(PHONE_DIRECTORY_PATH, 'utf8');
  const dataStart = html.indexOf('const data = {');
  if (dataStart < 0) {
    addError('ed-phone-directory.html: could not find the `const data = {` literal.');
    return null;
  }
  const dataBlock = sliceBalanced(html, dataStart);
  if (!dataBlock) {
    addError('ed-phone-directory.html: the `data` literal is unbalanced.');
    return null;
  }

  const parts = [`const data = ${dataBlock};`];
  for (const name of PHONE_DIRECTORY_FNS) {
    const fn = sliceFunction(html, name);
    if (!fn) {
      addError(`ed-phone-directory.html: could not extract ${name}().`);
      return null;
    }
    parts.push(fn);
  }

  const context = {};
  vm.createContext(context);
  try {
    vm.runInContext(
      `${parts.join('\n')}\nthis.__data = data;\nthis.__present = buildNumberPresentation;\nthis.__extToFull = extensionToFullNumber;`,
      context
    );
  } catch (err) {
    addError(`ed-phone-directory.html: evaluating its data/helpers failed: ${err.message}`);
    return null;
  }
  return { data: context.__data, present: context.__present, extToFull: context.__extToFull };
}

function checkPhoneDirectoryTargets(index) {
  const helpers = searchIndexHelpers;
  if (!helpers || typeof helpers.phoneQuery !== 'function') {
    addError('search-index.js did not expose kpPhoneQueryForTitle.');
    return null;
  }
  const dir = loadPhoneDirectory();
  if (!dir) return null;

  // Every row's haystack, built exactly as buildEntry() does.
  const haystacks = [];
  let rows = 0;
  for (const hospital of ['omc', 'fmc']) {
    const sections = dir.data[hospital] || {};
    for (const section of Object.keys(sections)) {
      for (const item of sections[section]) {
        const numberText = String(item.number || '');
        const meta = dir.present(numberText, item.type, hospital, section);
        const numberSearchText = meta.search || numberText;
        const haystack = `${item.name || ''} ${numberSearchText} ${String(item.note || '').toLowerCase()} ${section.toLowerCase()}`.toLowerCase();
        haystacks.push(haystack);
        rows++;
      }
    }
  }

  // The two copies of the extension → full-number rule must agree.
  const seenExt = new Set();
  for (const hospital of ['omc', 'fmc']) {
    const sections = dir.data[hospital] || {};
    for (const section of Object.keys(sections)) {
      for (const item of sections[section]) {
        for (const ext of String(item.number || '').match(/\b\d{5}\b/g) || []) {
          const key = `${hospital}|${ext}`;
          if (seenExt.has(key)) continue;
          seenExt.add(key);
          const mine = helpers.extToFull(ext, hospital);
          const theirs = dir.extToFull(ext, hospital) || '';
          if (mine !== theirs) {
            addError(`extension rule mismatch for ${hospital} ${ext}: search-index.js says "${mine}", ed-phone-directory.html says "${theirs}"`);
          }
        }
      }
    }
  }

  let checked = 0;
  for (const item of index) {
    const url = String((item && item.u) || '').trim();
    if (url.split('#')[0] !== 'ed-phone-directory.html') continue;
    checked++;
    const q = (item.q ? String(item.q) : helpers.phoneQuery(item.t)).trim().toLowerCase();
    if (!q) {
      addError(`Empty directory deep-link query for search item "${item.t}"`);
      continue;
    }
    if (!haystacks.some((hay) => hay.includes(q))) {
      addError(`No directory row matches the deep link for "${item.t}" (?q=${q}) — the title has drifted from the row name, so the link would filter to nothing.`);
    }
  }
  return { checked, rows };
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

function run() {
  const source = checkSearchIndexSyntax();
  checkInlineScripts();
  const index = evaluateSearchIndex(source);
  checkSearchIndexLinks(index);
  const phone = checkPhoneDirectoryTargets(index);
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
  if (phone && phone.checked) {
    console.log(`- phone-directory deep links checked: ${phone.checked} against ${phone.rows} rows`);
  }
  if (chatbot) console.log(`- chatbot-index.json chunks: ${chatbot.chunks.length}`);
}

run();
