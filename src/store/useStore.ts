import { create } from 'zustand';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface BioUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatar: string;
  verified: boolean;
  blocked: boolean;
  createdAt: string;
  links: SocialLink[];
  theme: 'dark' | 'light' | 'glass';
  accentColor: string;
  backgroundStyle: string;
  views: number;
  plan: 'free' | 'pro';
  profileBg: string;
  musicUrl: string;
}

interface AppState {
  currentUser: BioUser | null;
  users: BioUser[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  currentPage: string;
  viewingBio: string | null;

  login: (email: string, password: string) => { success: boolean; message: string };
  register: (email: string, username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateBio: (data: Partial<BioUser>) => void;
  addLink: (link: Omit<SocialLink, 'id' | 'order'>) => void;
  updateLink: (id: string, data: Partial<SocialLink>) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: SocialLink[]) => void;
  setCurrentPage: (page: string) => void;
  setViewingBio: (username: string | null) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  incrementViews: (username: string) => void;
}

const ADMIN_EMAIL = 'energoferon41@gmail.com';
const ADMIN_PASSWORD = '2255';

// Demo user for preview
const demoUser: BioUser = {
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
};

const initialUsers: BioUser[] = [demoUser];

const loadState = () => {
  try {
    const saved = localStorage.getItem('biolink_state');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const saveState = (state: Partial<AppState>) => {
  try {
    localStorage.setItem('biolink_state', JSON.stringify({
      currentUser: state.currentUser,
      users: state.users,
      isLoggedIn: state.isLoggedIn,
      isAdmin: state.isAdmin,
    }));
  } catch {}
};

const saved = loadState();

export const useStore = create<AppState>((set, get) => ({
  currentUser: saved?.currentUser || null,
  users: saved?.users || initialUsers,
  isLoggedIn: saved?.isLoggedIn || false,
  isAdmin: saved?.isAdmin || false,
  currentPage: 'home',
  viewingBio: null,

  login: (email, password) => {
    // Проверка админского пароля для админ панели
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = get().users.find(u => u.email === ADMIN_EMAIL);
      if (!adminUser) return { success: false, message: 'Пользователь не найден' };
      set(s => {
        const ns = { ...s, currentUser: adminUser, isLoggedIn: true, isAdmin: true };
        saveState(ns);
        return ns;
      });
      return { success: true, message: 'Добро пожаловать, Admin!' };
    }
    // Для обычного входа с админским емейлом
    if (email === ADMIN_EMAIL) {
      const adminUser = get().users.find(u => u.email === ADMIN_EMAIL);
      if (!adminUser) return { success: false, message: 'Пользователь не найден' };
      const storedPass = localStorage.getItem(`pass_${adminUser.id}`);
      if (!storedPass || storedPass !== password) return { success: false, message: 'Неверный пароль' };
      set(s => {
        const ns = { ...s, currentUser: adminUser, isLoggedIn: true, isAdmin: false };
        saveState(ns);
        return ns;
      });
      return { success: true, message: 'Вход выполнен!' };
    }
    const user = get().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, message: 'Пользователь не найден' };
    if (user.blocked) return { success: false, message: 'Аккаунт заблокирован' };
    const storedPass = localStorage.getItem(`pass_${user.id}`);
    if (storedPass !== password) return { success: false, message: 'Неверный пароль' };
    set(s => {
      const ns = { ...s, currentUser: user, isLoggedIn: true, isAdmin: false };
      saveState(ns);
      return ns;
    });
    return { success: true, message: 'Вход выполнен!' };
  },

  register: (email, username, password) => {
    const state = get();
    // Для админского email разрешаем регистрацию если еще нет аккаунта
    const existingUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser && email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return { success: false, message: 'Email уже используется' };
    }
    // Если это админский email и уже есть аккаунт, не даем зарегистрировать повторно
    if (existingUser && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, message: 'Email уже используется' };
    }
    const usernameExists = state.users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) return { success: false, message: 'Имя пользователя занято' };
    if (username.length < 3) return { success: false, message: 'Имя пользователя минимум 3 символа' };
    if (password.length < 6) return { success: false, message: 'Пароль минимум 6 символов' };
    const newUser: BioUser = {
      id: `user-${Date.now()}`,
      username: username.toLowerCase(),
      email,
      displayName: username,
      bio: 'Hey there! I am using BioLink.',
      avatar: '',
      verified: false,
      blocked: false,
      createdAt: new Date().toISOString(),
      links: [],
      theme: 'dark',
      accentColor: '#6366f1',
      backgroundStyle: 'gradient-dark',
      views: 0,
      plan: 'free',
      profileBg: '',
      musicUrl: '',
    };
    localStorage.setItem(`pass_${newUser.id}`, password);
    set(s => {
      const ns = {
        ...s,
        users: [...s.users, newUser],
        currentUser: newUser,
        isLoggedIn: true,
        isAdmin: false,
      };
      saveState(ns);
      return ns;
    });
    return { success: true, message: 'Аккаунт создан!' };
  },

  logout: () => {
    set(s => {
      const ns = { ...s, currentUser: null, isLoggedIn: false, isAdmin: false, currentPage: 'home' };
      saveState(ns);
      return ns;
    });
  },

  updateBio: (data) => {
    set(s => {
      const updated = { ...s.currentUser!, ...data };
      const users = s.users.map(u => u.id === updated.id ? updated : u);
      const ns = { ...s, currentUser: updated, users };
      saveState(ns);
      return ns;
    });
  },

  addLink: (link) => {
    set(s => {
      const newLink: SocialLink = {
        ...link,
        id: `link-${Date.now()}`,
        order: s.currentUser!.links.length,
      };
      const updated = { ...s.currentUser!, links: [...s.currentUser!.links, newLink] };
      const users = s.users.map(u => u.id === updated.id ? updated : u);
      const ns = { ...s, currentUser: updated, users };
      saveState(ns);
      return ns;
    });
  },

  updateLink: (id, data) => {
    set(s => {
      const links = s.currentUser!.links.map(l => l.id === id ? { ...l, ...data } : l);
      const updated = { ...s.currentUser!, links };
      const users = s.users.map(u => u.id === updated.id ? updated : u);
      const ns = { ...s, currentUser: updated, users };
      saveState(ns);
      return ns;
    });
  },

  removeLink: (id) => {
    set(s => {
      const links = s.currentUser!.links.filter(l => l.id !== id);
      const updated = { ...s.currentUser!, links };
      const users = s.users.map(u => u.id === updated.id ? updated : u);
      const ns = { ...s, currentUser: updated, users };
      saveState(ns);
      return ns;
    });
  },

  reorderLinks: (links) => {
    set(s => {
      const updated = { ...s.currentUser!, links };
      const users = s.users.map(u => u.id === updated.id ? updated : u);
      const ns = { ...s, currentUser: updated, users };
      saveState(ns);
      return ns;
    });
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setViewingBio: (username) => set({ viewingBio: username }),

  blockUser: (userId) => {
    set(s => {
      const users = s.users.map(u => u.id === userId ? { ...u, blocked: true } : u);
      const ns = { ...s, users };
      saveState(ns);
      return ns;
    });
  },

  unblockUser: (userId) => {
    set(s => {
      const users = s.users.map(u => u.id === userId ? { ...u, blocked: false } : u);
      const ns = { ...s, users };
      saveState(ns);
      return ns;
    });
  },

  deleteUser: (userId) => {
    set(s => {
      const users = s.users.filter(u => u.id !== userId);
      const ns = { ...s, users };
      saveState(ns);
      return ns;
    });
  },

  incrementViews: (username) => {
    set(s => {
      const users = s.users.map(u => u.username === username ? { ...u, views: u.views + 1 } : u);
      const ns = { ...s, users };
      saveState(ns);
      return ns;
    });
  },
}));
