#!/usr/bin/env node
import { execSync } from 'node:child_process';
import readline from 'node:readline';

const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
const out = (cmd) => execSync(cmd, { encoding: 'utf8', cwd: process.cwd() }).trim();

// ── Commit mesajı ──────────────────────────────────────────────────────────────
let message = process.argv.slice(2).join(' ');

if (!message) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  message = await new Promise((resolve) => {
    rl.question('Commit mesajı: ', (ans) => { rl.close(); resolve(ans.trim()); });
  });
}

if (!message) {
  console.error('Hata: commit mesajı gerekli.');
  process.exit(1);
}

// ── Status ─────────────────────────────────────────────────────────────────────
const status = out('git status --short');
if (!status) {
  console.log('Değişiklik yok, push atlanıyor.');
  process.exit(0);
}

console.log('\nDeğişiklikler:');
console.log(status);
console.log();

// ── Stage → Commit → Push ──────────────────────────────────────────────────────
const branch = out('git rev-parse --abbrev-ref HEAD');

run('git add -A');
run(`git commit -m "${message.replace(/"/g, '\\"')}"`);
run(`git push origin ${branch}`);

console.log(`\n✓ "${message}" → origin/${branch}`);
