import express from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Для больших base64 файлов
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS для развития
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API routes
app.use('/api', apiRouter);

// Статические файлы
app.use('/logo.png', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'logo.png'));
});

// SPA - все остальные запросы отдаем index.html
app.get('*', (req, res) => {
  const html = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ BioLink server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
