import express from 'express';
import { 
  getAllUsers, 
  getUserByUsername, 
  getUserByEmail, 
  createUser, 
  updateUser, 
  deleteUser,
  getUserById
} from './db.js';

const router = express.Router();

// Получить всех пользователей
router.get('/users', (req, res) => {
  try {
    const users = getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить пользователя по username
router.get('/users/:username', (req, res) => {
  try {
    const user = getUserByUsername(req.params.username);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Регистрация
router.post('/register', (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Проверки
    if (getUserByEmail(email)) {
      return res.json({ success: false, message: 'Email уже используется' });
    }
    if (getUserByUsername(username)) {
      return res.json({ success: false, message: 'Имя пользователя занято' });
    }
    
    const ADMIN_EMAIL = 'energoferon41@gmail.com';
    const newUser = {
      id: `user-${Date.now()}`,
      username: username.toLowerCase(),
      email,
      displayName: username,
      bio: 'Hey there! I am using BioLink.',
      avatar: '',
      verified: email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
      blocked: false,
      createdAt: new Date().toISOString(),
      links: [],
      theme: 'dark',
      accentColor: '#6366f1',
      backgroundStyle: 'gradient-dark',
      views: 0,
      plan: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'elite' : 'free',
      profileBg: '',
      musicUrl: '',
      password: password // В продакшене нужно хешировать!
    };
    
    createUser(newUser);
    delete newUser.password; // Не отправляем пароль обратно
    
    res.json({ success: true, message: 'Аккаунт создан!', user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Вход
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const ADMIN_PASSWORD = '2255';
    const ADMIN_EMAIL = 'energoferon41@gmail.com';
    
    // Админский вход
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = getUserByEmail(ADMIN_EMAIL);
      if (adminUser) {
        const user = { ...adminUser };
        delete user.password;
        return res.json({ success: true, message: 'Добро пожаловать, Admin!', user, isAdmin: true });
      }
    }
    
    // Обычный вход
    const user = getUserByEmail(email);
    if (!user) {
      return res.json({ success: false, message: 'Пользователь не найден' });
    }
    if (user.blocked) {
      return res.json({ success: false, message: 'Аккаунт заблокирован' });
    }
    if (user.password !== password) {
      return res.json({ success: false, message: 'Неверный пароль' });
    }
    
    const returnUser = { ...user };
    delete returnUser.password;
    res.json({ success: true, message: 'Вход выполнен!', user: returnUser, isAdmin: false });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Обновить профиль
router.put('/users/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    delete updates.password; // Не обновляем пароль через этот endpoint
    
    const updatedUser = updateUser(userId, updates);
    if (updatedUser) {
      delete updatedUser.password;
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Удалить пользователя
router.delete('/users/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const success = deleteUser(userId);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Заблокировать пользователя
router.post('/users/:userId/block', (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = updateUser(userId, { blocked: true });
    if (updatedUser) {
      delete updatedUser.password;
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Разблокировать пользователя
router.post('/users/:userId/unblock', (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = updateUser(userId, { blocked: false });
    if (updatedUser) {
      delete updatedUser.password;
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
