import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'database.json');

// Инициализация базы данных
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    const demoUser = {
      id: 'demo-user',
      username: 'demo',
      email: 'demo@biolink.app',
      displayName: 'Demo User',
      bio: 'Это демо профиль! Посмотрите как работает BioLink. Создайте свой бесплатно!',
      avatar: '',
      verified: true,
      blocked: false,
      createdAt: new Date().toISOString(),
      links: [
        { id: 'd1', platform: 'github', url: 'https://github.com', label: 'GitHub', icon: 'github', enabled: true, order: 0 },
        { id: 'd2', platform: 'twitter', url: 'https://twitter.com', label: 'Twitter / X', icon: 'twitter', enabled: true, order: 1 },
        { id: 'd3', platform: 'instagram', url: 'https://instagram.com', label: 'Instagram', icon: 'instagram', enabled: true, order: 2 },
        { id: 'd4', platform: 'youtube', url: 'https://youtube.com', label: 'YouTube', icon: 'youtube', enabled: true, order: 3 },
        { id: 'd5', platform: 'telegram', url: 'https://t.me', label: 'Telegram', icon: 'telegram', enabled: true, order: 4 },
        { id: 'd6', platform: 'discord', url: 'https://discord.gg', label: 'Discord', icon: 'discord', enabled: true, order: 5 },
      ],
      theme: 'dark',
      accentColor: '#8b5cf6',
      backgroundStyle: 'gradient-dark',
      views: 0,
      plan: 'free',
      profileBg: '',
      musicUrl: '',
      password: 'demo123'
    };
    
    const initialData = {
      users: [demoUser],
      lastUpdate: new Date().toISOString()
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

// Чтение базы данных
export function readDB() {
  try {
    initDB();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], lastUpdate: new Date().toISOString() };
  }
}

// Запись в базу данных
export function writeDB(data) {
  try {
    data.lastUpdate = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// Получить всех пользователей
export function getAllUsers() {
  const db = readDB();
  return db.users || [];
}

// Получить пользователя по ID
export function getUserById(id) {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

// Получить пользователя по username
export function getUserByUsername(username) {
  const users = getAllUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

// Получить пользователя по email
export function getUserByEmail(email) {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Создать пользователя
export function createUser(user) {
  const db = readDB();
  db.users.push(user);
  return writeDB(db);
}

// Обновить пользователя
export function updateUser(userId, updates) {
  const db = readDB();
  const index = db.users.findIndex(u => u.id === userId);
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...updates };
    writeDB(db);
    return db.users[index];
  }
  return null;
}

// Удалить пользователя
export function deleteUser(userId) {
  const db = readDB();
  db.users = db.users.filter(u => u.id !== userId);
  return writeDB(db);
}

// Инициализация при импорте
initDB();
