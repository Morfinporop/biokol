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
    const isOwner = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newUser = {
      id: `user-${Date.now()}`,
      username: username.toLowerCase(),
      email,
      displayName: username,
      bio: 'Hey there! I am using BioLink.',
      avatar: '',
      verified: isOwner,
      blocked: false,
      createdAt: new Date().toISOString(),
      links: [],
      theme: 'dark',
      accentColor: '#6366f1',
      backgroundStyle: 'gradient-dark',
      views: 0,
      plan: isOwner ? 'elite' : 'free',
      role: isOwner ? 'admin' : 'user',
      adminPassword: isOwner ? '2255' : '',
      mustSetAdminPassword: false,
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

    // Админ должен сначала создать админ пароль
    if (user.role === 'admin' && user.mustSetAdminPassword) {
      return res.json({
        success: false,
        message: 'Для доступа к админ-правам создайте пароль админа',
        requireAdminPasswordSetup: true,
        userId: user.id,
      });
    }
    
    const returnUser = { ...user };
    delete returnUser.password;
    res.json({ success: true, message: 'Вход выполнен!', user: returnUser, isAdmin: user.role === 'admin' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Создать/обновить пароль админа
router.post('/users/:userId/set-admin-password', (req, res) => {
  try {
    const { userId } = req.params;
    const { adminPassword } = req.body;
    if (!adminPassword || String(adminPassword).length < 4) {
      return res.json({ success: false, message: 'Пароль админа минимум 4 символа' });
    }
    const updatedUser = updateUser(userId, { adminPassword, mustSetAdminPassword: false, role: 'admin' });
    if (!updatedUser) return res.status(404).json({ success: false, error: 'User not found' });
    const user = { ...updatedUser };
    delete user.password;
    delete user.adminPassword;
    return res.json({ success: true, message: 'Админ пароль установлен', user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Выдать/снять VIP
router.post('/users/:userId/vip', (req, res) => {
  try {
    const { userId } = req.params;
    const { vip } = req.body;
    const updatedUser = updateUser(userId, { plan: vip ? 'vip' : 'free' });
    if (!updatedUser) return res.status(404).json({ success: false, error: 'User not found' });
    const user = { ...updatedUser };
    delete user.password;
    delete user.adminPassword;
    return res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Выдать/снять роль админа
router.post('/users/:userId/role', (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const normalizedRole = role === 'admin' ? 'admin' : 'user';
    const roleUpdates = {
      role: normalizedRole,
      mustSetAdminPassword: normalizedRole === 'admin',
      adminPassword: normalizedRole === 'admin' ? '' : '',
      ...(normalizedRole === 'admin' ? { plan: 'elite' } : {}),
    };
    const updatedUser = updateUser(userId, roleUpdates);
    if (!updatedUser) return res.status(404).json({ success: false, error: 'User not found' });
    const user = { ...updatedUser };
    delete user.password;
    delete user.adminPassword;
    return res.json({ success: true, user });
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
