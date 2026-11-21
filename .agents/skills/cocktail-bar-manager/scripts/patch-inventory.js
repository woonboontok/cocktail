#!/usr/bin/env node
/**
 * patch-inventory.js — Zero-friction inventory patcher for Boon's Home Bar
 *
 * Usage:
 *   node .agents/skills/cocktail-bar-manager/scripts/patch-inventory.js \
 *     --id "creme-de-mure" inStock=true incoming=false quantity=1 unit=bottle
 *
 * Supported value types:
 *   - true / false   → boolean
 *   - bare numbers   → number
 *   - everything else → string (quotes added automatically)
 *
 * The script also auto-bumps INVENTORY_SYNC_VERSION and INVENTORY_LAST_UPDATED.
 */

const fs = require('fs');
const path = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────

function today() {
  const d = new Date();
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function bumpVersion(current) {
  // Format: YYYYMMDD_N
  const d = new Date();
  const dateStr = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const match = current.match(/^(\d{8})_(\d+)$/);
  if (match && match[1] === dateStr) {
    return `${dateStr}_${parseInt(match[2]) + 1}`;
  }
  return `${dateStr}_1`;
}

function parseArgs(argv) {
  const args = { id: null, fields: {} };
  let i = 0;
  while (i < argv.length) {
    if (argv[i] === '--id') {
      args.id = argv[i + 1];
      i += 2;
    } else if (argv[i].includes('=')) {
      const [key, ...rest] = argv[i].split('=');
      const rawVal = rest.join('=');
      let val;
      if (rawVal === 'true')       val = true;
      else if (rawVal === 'false') val = false;
      else if (!isNaN(rawVal) && rawVal !== '') val = Number(rawVal);
      else val = rawVal;
      args.fields[key] = val;
      i++;
    } else {
      i++;
    }
  }
  return args;
}

function jsValue(v) {
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number')  return String(v);
  return JSON.stringify(v);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const dataPath = path.resolve(__dirname, '../../../../js/data.js');
const args = parseArgs(process.argv.slice(2));

if (!args.id) {
  console.error('Usage: patch-inventory.js --id <item-id> [field=value ...]');
  process.exit(1);
}

let src = fs.readFileSync(dataPath, 'utf8');

// 1. Patch INVENTORY_LAST_UPDATED
src = src.replace(
  /const INVENTORY_LAST_UPDATED = "[^"]*";/,
  `const INVENTORY_LAST_UPDATED = "${today()}";`
);

// 2. Bump INVENTORY_SYNC_VERSION
src = src.replace(
  /const INVENTORY_SYNC_VERSION = "([^"]*)";/,
  (_, cur) => `const INVENTORY_SYNC_VERSION = "${bumpVersion(cur)}";`
);

// 3. Find and patch the override entry
const idPattern = `"${args.id}"`;
const lineRegex = new RegExp(`^([ \\t]*${idPattern.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\s*:\\s*\\{)([^\\n]*)\\}(,?)$`, 'm');
const match = src.match(lineRegex);

if (match) {
  // Parse existing fields (best-effort: handle simple key: value pairs)
  const existing = {};
  const bodyStr = match[2];
  // Extract individual field: value pairs
  const fieldRe = /(\w+)\s*:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|true|false|\d+(?:\.\d+)?)/g;
  let fm;
  while ((fm = fieldRe.exec(bodyStr)) !== null) {
    const key = fm[1];
    const raw = fm[2];
    if (raw === 'true') existing[key] = true;
    else if (raw === 'false') existing[key] = false;
    else if (!isNaN(raw)) existing[key] = Number(raw);
    else existing[key] = raw.slice(1, -1); // strip quotes
  }

  // Merge patches
  const merged = { ...existing, ...args.fields };

  // Rebuild the line preserving field order (existing order first, then new keys)
  const allKeys = [...Object.keys(existing)];
  for (const k of Object.keys(args.fields)) {
    if (!allKeys.includes(k)) allKeys.push(k);
  }

  const body = allKeys.map(k => `${k}: ${jsValue(merged[k])}`).join(', ');
  const newLine = `${match[1]} ${body} }${match[3]}`;
  src = src.replace(lineRegex, newLine);

  console.log(`✓ Patched override for "${args.id}"`);
  for (const [k, v] of Object.entries(args.fields)) {
    console.log(`  ${k}: ${jsValue(v)}`);
  }
} else {
  // Entry not found — append it
  const fieldsStr = Object.entries(args.fields)
    .map(([k, v]) => `${k}: ${jsValue(v)}`)
    .join(', ');
  const newEntry = `  "${args.id}": { ${fieldsStr} }`;

  // Insert before the closing `};` of INVENTORY_UPDATE_OVERRIDES
  src = src.replace(
    /^(};)\s*$/m,
    // Insert after the last existing entry (add trailing comma to previous last line)
    (match2, offset) => {
      return `,\n${newEntry}\n${match2}`;
    }
  );

  // Better: insert just before the closing brace of the OVERRIDES object
  // Re-do with a targeted approach
  src = fs.readFileSync(dataPath, 'utf8'); // re-read since above regex is too greedy
  src = src.replace(
    /const INVENTORY_LAST_UPDATED = "[^"]*";/,
    `const INVENTORY_LAST_UPDATED = "${today()}";`
  );
  src = src.replace(
    /const INVENTORY_SYNC_VERSION = "([^"]*)";/,
    (_, cur) => `const INVENTORY_SYNC_VERSION = "${bumpVersion(cur)}";`
  );

  // Find last entry in INVENTORY_UPDATE_OVERRIDES and append after it
  const overrideEnd = src.indexOf('\n};\n\nconst INGREDIENT_GROUPS');
  if (overrideEnd === -1) {
    console.error('Could not locate INVENTORY_UPDATE_OVERRIDES closing brace.');
    process.exit(1);
  }
  // Find last non-blank line before that
  const before = src.slice(0, overrideEnd);
  // Add trailing comma to last item if needed and append new entry
  const updatedBefore = before.trimEnd().replace(/([^,])\s*$/, '$1,') + `\n  "${args.id}": { ${fieldsStr} }`;
  src = updatedBefore + src.slice(overrideEnd);

  console.log(`✓ Appended new override entry for "${args.id}"`);
}

fs.writeFileSync(dataPath, src, 'utf8');
console.log(`✓ INVENTORY_LAST_UPDATED → ${today()}`);
