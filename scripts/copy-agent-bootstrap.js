const fs = require('fs');
const cp = require('child_process');
const os = require('os');
const content = fs.readFileSync('.copilot-workflows/AGENT_BOOTSTRAP.md','utf8');

if (os.platform() === 'win32') {
  const p = cp.spawn('clip');
  p.stdin.write(content);
  p.stdin.end();
  p.on('exit', () => console.log('Copied AGENT_BOOTSTRAP.md to clipboard (Windows clip)'));
} else if (os.platform() === 'darwin') {
  const p = cp.spawn('pbcopy');
  p.stdin.write(content);
  p.stdin.end();
  p.on('exit', () => console.log('Copied AGENT_BOOTSTRAP.md to clipboard (pbcopy)'));
} else {
  // linux: try xclip then xsel
  let tried = false;
  try {
    const p = cp.spawnSync('xclip', ['-selection', 'clipboard'], { input: content });
    if (p.status === 0) { console.log('Copied AGENT_BOOTSTRAP.md to clipboard (xclip)'); tried = true; }
  } catch (e) {}
  if (!tried) {
    try {
      const p = cp.spawnSync('xsel', ['--clipboard', '--input'], { input: content });
      if (p.status === 0) { console.log('Copied AGENT_BOOTSTRAP.md to clipboard (xsel)'); tried = true; }
    } catch (e) {}
  }
  if (!tried) console.log('Could not copy to clipboard; run `npm run show:agent-bootstrap` to print the content');
}
