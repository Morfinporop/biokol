import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;

const html = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');

const server = createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`BioLink server running on port ${PORT}`);
});
