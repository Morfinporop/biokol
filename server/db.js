import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'database.json');

// Инициализация базы данных
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
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
