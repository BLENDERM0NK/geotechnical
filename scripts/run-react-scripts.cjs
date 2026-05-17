/**
 * Runs react-scripts with the same Node binary that launched this file.
 * Avoids broken npm `.bin` shims that sometimes embed stale paths.
 *
 * Parent should clear NODE_OPTIONS before invoking Node (see scripts/cra-start.cmd
 * and scripts/cra-start.sh); this file still strips NODE_OPTIONS for child spawns.
 */
console.log('[run-react-scripts] argv:', process.argv);
console.log('[run-react-scripts] execPath:', process.execPath);
const path = require('path');

const cmd = process.argv[2];
const rest = process.argv.slice(3);

if (!cmd || !['start', 'build', 'test', 'eject'].includes(cmd)) {
  console.error('Usage: node scripts/run-react-scripts.cjs <start|build|test|eject> [args...]');
  process.exit(1);
}

// Sanitize the current process environment early.
delete process.env.NODE_OPTIONS;
delete process.env.NODE;
delete process.env.NODE_PATH;
delete process.env.NODE_EXTRA_CA_CERTS;

// Prefer the standard Windows Node install on PATH when downstream tooling
// (or transitive deps) shell out to `node` by name.
if (process.platform === 'win32') {
  const pf = process.env.ProgramFiles || 'C:\\Program Files';
  const pfx86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const prepend = [];
  prepend.push(`${pf}\\nodejs`);
  prepend.push(`${pfx86}\\nodejs`);
  process.env.PATH = `${prepend.join(';')};${process.env.PATH || ''}`;
}

// IMPORTANT: Require CRA scripts in-process to avoid any broken child `node` shims.
// This matches what react-scripts/bin/react-scripts.js would run, but without spawning.
const script = path.join(__dirname, '..', 'node_modules', 'react-scripts', 'scripts', cmd);

process.chdir(path.join(__dirname, '..'));
process.on('unhandledRejection', (err) => {
  throw err;
});

// Make downstream scripts see the expected argv shape.
process.argv = [process.execPath, script, ...rest];
require(script);
