const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', '.copilot-workflows');
const manifestPath = path.join(base, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('Manifest not found at', manifestPath);
  process.exit(2);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let ok = true;

manifest.pairs.forEach(({ command, rule }) => {
  const cmd = path.join(base, 'commands', command);
  const rl = path.join(base, 'rules', rule);

  if (!fs.existsSync(cmd)) {
    console.error('MISSING command:', command);
    ok = false;
  }
  if (!fs.existsSync(rl)) {
    console.error('MISSING rule:', rule);
    ok = false;
  }

  const bcmd = path.basename(command, path.extname(command));
  const brule = path.basename(rule, path.extname(rule));

  // Allow coding-standards / testing to be shared rules; warn for others
  const sharedRule = ['coding-standards', 'testing'];
  if (bcmd !== brule && !sharedRule.includes(brule)) {
    console.warn('SIMILARITY WARNING:', command, '↔', rule);
  }
});

if (!ok) process.exit(2);
console.log('Manifest OK');
