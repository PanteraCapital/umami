// Normalizes DATABASE_URL for Heroku Postgres, then starts Umami.
//
// Heroku Postgres requires SSL but uses certs not in Node's default
// CA bundle, so sslmode=require fails verification. sslmode=no-verify
// keeps the connection encrypted but skips cert chain validation.

const { spawn } = require('child_process');

const url = process.env.DATABASE_URL;
if (url && !url.includes('sslmode=')) {
  const sep = url.includes('?') ? '&' : '?';
  process.env.DATABASE_URL = `${url}${sep}sslmode=no-verify`;
  console.log('✓ Appended sslmode=no-verify to DATABASE_URL');
}

// Hand off to Umami's normal start command
const child = spawn('pnpm', ['start'], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', code => process.exit(code ?? 0));
child.on('error', err => {
  console.error('Failed to start Umami:', err);
  process.exit(1);
});
