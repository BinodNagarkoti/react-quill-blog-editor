#!/usr/bin/env node
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..');
const skillSource = join(packageRoot, '.claude', 'skills', 'react-quill-blog-editor', 'SKILL.md');

const force = process.argv.includes('--force');
const printOnly = process.argv.includes('--print');

function fail(message) {
  console.error(`react-quill-blog-editor: ${message}`);
  process.exit(1);
}

if (!existsSync(skillSource)) {
  fail('could not find the bundled SKILL.md - this looks like a corrupted install.');
}

if (printOnly) {
  process.stdout.write(readFileSync(skillSource, 'utf8'));
  process.exit(0);
}

const targetDir = join(process.cwd(), '.claude', 'skills', 'react-quill-blog-editor');
const targetFile = join(targetDir, 'SKILL.md');

if (existsSync(targetFile) && !force) {
  console.log(`Already exists: ${targetFile}`);
  console.log('Re-run with --force to overwrite it.');
  process.exit(0);
}

mkdirSync(targetDir, { recursive: true });
copyFileSync(skillSource, targetFile);
console.log(`Installed the react-quill-blog-editor agent skill to:\n  ${targetFile}`);
console.log('\nAny AI coding agent reading this project (Claude Code, etc.) can now use it.');
