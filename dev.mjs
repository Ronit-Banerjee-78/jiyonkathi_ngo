import { spawn } from 'node:child_process';

// Run Express server.js (handles API + Vite middleware on port 3000)
const child = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
