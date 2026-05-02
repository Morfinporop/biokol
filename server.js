import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './server/api.js';
import { getUserByUsername } from './server/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
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
app.get('/logo.png', (req, res) => {
  try {
    res.sendFile(join(__dirname, 'public', 'logo.png'));
  } catch (error) {
    res.status(404).send('Logo not found');
  }
});

// Helper to inject dynamic meta tags for social previews
function injectMetaTags(html, user, baseUrl) {
  if (!user) return html;
  
  const title = `BioLink — Профиль ${user.username}`;
  const description = user.bio || `Страница ссылок ${user.displayName} в BioLink`;
  const url = `${baseUrl}/@${user.username}`;
  const image = user.avatar || `${baseUrl}/logo.png`;
  
  const metaTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <title>${title}</title>
  `;
  
  return html.replace('<script id="dynamic-meta"></script>', `<script id="dynamic-meta">${metaTags}</script>`);
}

// Handle bio.o/username routes - redirect to @username internally
app.get(['/bio.o/:username', '/bio/:username', '/u/:username'], (req, res) => {
  const { username } = req.params;
  const user = getUserByUsername(username);
  
  try {
    let html = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
    
    // Inject meta tags for social preview if user exists
    if (user && !user.blocked) {
      const baseUrl = process.env.BASE_URL || 'https://bio.o';
      html = injectMetaTags(html, user, baseUrl);
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Handle @username routes with social preview
app.get('/@:username', (req, res) => {
  const { username } = req.params;
  const user = getUserByUsername(username);
  
  try {
    let html = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
    
    if (user && !user.blocked) {
      const baseUrl = process.env.BASE_URL || 'https://bio.o';
      html = injectMetaTags(html, user, baseUrl);
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// SPA - все остальные запросы
app.use((req, res) => {
  try {
    const html = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ BioLink server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔗 bio.o routes enabled`);
});
