#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SEARCH_INDEX_PATH = path.join(ROOT, 'search-index.js');
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
  const files = new Set(fs.readdirSync(ROOT));
  for (const item of index) {
    const url = String((item && item.u) || '').trim();
    const title = String((item && item.t) || '(untitled)');
    if (!url) {
      addError(`Missing URL for search item: ${title}`);
      continue;
    }

    const [file, hash] = url.split('#');
    if (!files.has(file)) {
      addError(`Missing file for search item "${title}": ${url}`);
      continue;
    }

    if (!hash) continue;
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const escapedHash = escapeRegExp(hash);
    const idRe = new RegExp(`id=["']${escapedHash}["']`);
    const nameRe = new RegExp(`name=["']${escapedHash}["']`);
    if (!idRe.test(html) && !nameRe.test(html)) {
      addError(`Missing hash target for search item "${title}": ${url}`);
    }
  }
}

function run() {
  const source = checkSearchIndexSyntax();
  checkInlineScripts();
  const index = evaluateSearchIndex(source);
  checkSearchIndexLinks(index);

  if (errors.length) {
    console.error('Smoke check failed.');
    errors.forEach((msg) => console.error(`- ${msg}`));
    process.exit(1);
  }

  console.log('Smoke check passed.');
  console.log(`- HTML files checked: ${HTML_FILES.length}`);
  console.log('- search-index.js syntax checked');
  console.log(`- SEARCH_INDEX entries checked: ${index.length}`);
}

run();
