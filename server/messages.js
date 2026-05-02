import { readDB, writeDB, getUserByUsername, getUserByEmail } from './db.js';

// Получить все сообщения между двумя пользователями
export function getMessages(user1Id, user2Id) {
  const db = readDB();
  const messages = db.messages || [];
  
  return messages.filter(m => 
    (m.from === user1Id && m.to === user2Id) ||
    (m.from === user2Id && m.to === user1Id)
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Отправить сообщение
export function sendMessage(from, to, text, type = 'text') {
  const db = readDB();
  if (!db.messages) db.messages = [];
  
  const message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    from,
    to,
    text,
    type,
    timestamp: new Date().toISOString(),
    read: false,
  };
  
  db.messages.push(message);
  writeDB(db);
  return message;
}

// Пометить сообщения как прочитанные
export function markMessagesRead(user1Id, user2Id) {
  const db = readDB();
  if (!db.messages) db.messages = [];
  
  let updated = false;
  db.messages.forEach(m => {
    if (m.from === user2Id && m.to === user1Id && !m.read) {
      m.read = true;
      updated = true;
    }
  });
  
  if (updated) writeDB(db);
  return updated;
}

// Получить последние сообщения для каждого чата
export function getChatList(userId) {
  const db = readDB();
  const messages = db.messages || [];
  const users = db.users || [];
  
  // Найти все уникальные ID пользователей с которыми были сообщения
  const chatIds = new Set();
  messages.forEach(m => {
    if (m.from === userId) chatIds.add(m.to);
    if (m.to === userId) chatIds.add(m.from);
  });
  
  // Для каждого чата найти последнее сообщение
  const chats = [];
  chatIds.forEach(chatUserId => {
    const user = users.find(u => u.id === chatUserId);
    if (!user) return;
    
    const chatMessages = messages.filter(m => 
      (m.from === userId && m.to === chatUserId) ||
      (m.from === chatUserId && m.to === userId)
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const lastMessage = chatMessages[0];
    const unreadCount = chatMessages.filter(m => m.to === userId && !m.read).length;
    
    chats.push({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      lastMessage: lastMessage ? {
        text: lastMessage.text,
        timestamp: lastMessage.timestamp,
        fromMe: lastMessage.from === userId,
      } : null,
      unreadCount,
      online: false, // Можно добавить tracking онлайн статуса
    });
  });
  
  return chats.sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
  });
}

// Получить всех пользователей для поиска
export function getAllUsersExcept(currentUserId) {
  const db = readDB();
  const users = db.users || [];
  return users.filter(u => u.id !== currentUserId && !u.blocked);
}
