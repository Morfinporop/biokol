import { create } from 'zustand';
import * as api from '../services/api';

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
  plan: 'free' | 'pro' | 'vip' | 'elite';
  role?: 'user' | 'admin';
  mustSetAdminPassword?: boolean;
  profileBg: string;
  musicUrl: string;
}

interface AppState {
  currentUser: BioUser | null;
  users: BioUser[];
  usersLoaded: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  currentPage: string;
  viewingBio: string | null;
  
  loadUsers: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; isAdmin?: boolean; requireAdminPasswordSetup?: boolean; userId?: string }>;
  register: (email: string, username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateBio: (data: Partial<BioUser>) => Promise<void>;
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
  usersLoaded: false,
  isLoggedIn: saved?.isLoggedIn || false,
  isAdmin: saved?.isAdmin || false,
  currentPage: 'home',
  viewingBio: null,
  
  loadUsers: async () => {
    const users = await api.fetchAllUsers();
    set((s) => {
      const syncedCurrentUser = s.currentUser
        ? users.find((u) => u.id === s.currentUser?.id) || s.currentUser
        : null;
      const ns = { ...s, users: users.length ? users : s.users, currentUser: syncedCurrentUser, usersLoaded: true };
      saveState(ns);
      return ns;
    });
  },

  login: async (email, password) => {
    const result = await api.loginUser(email, password);
    if (result.success && result.user) {
      await get().loadUsers();
      set(s => {
        const ns = { ...s, currentUser: result.user, isLoggedIn: true, isAdmin: result.isAdmin || false };
        saveState(ns);
        return ns;
      });
    }
    return {
      success: result.success,
      message: result.message || '',
      isAdmin: result.isAdmin,
      requireAdminPasswordSetup: result.requireAdminPasswordSetup,
      userId: result.userId,
    };
  },

  register: async (email, username, password) => {
    const result = await api.registerUser(email, username, password);
    if (result.success && result.user) {
      await get().loadUsers();
      set(s => {
        const ns = { ...s, currentUser: result.user, isLoggedIn: true, isAdmin: false };
        saveState(ns);
        return ns;
      });
    }
    return { success: result.success, message: result.message || '' };
  },

  logout: () => {
    set(s => {
      const ns = { ...s, currentUser: null, isLoggedIn: false, isAdmin: false, currentPage: 'home' };
      saveState(ns);
      return ns;
    });
  },

  updateBio: async (data) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;
    
    const updatedUser = await api.updateUserProfile(currentUser.id, data);
    if (updatedUser) {
      await get().loadUsers();
      set(s => {
        const ns = { ...s, currentUser: updatedUser, users: s.users.map(u => u.id === updatedUser.id ? updatedUser : u) };
        saveState(ns);
        return ns;
      });
    }
  },

  addLink: (link) => {
    const state = get();
    if (!state.currentUser) return;
    const newLink: SocialLink = {
      ...link,
      id: `link-${Date.now()}`,
      order: state.currentUser.links.length,
    };
    const updated = { ...state.currentUser, links: [...state.currentUser.links, newLink] };
    const users = state.users.map((u) => (u.id === updated.id ? updated : u));
    const ns = { ...state, currentUser: updated, users };
    set(ns);
    saveState(ns);
    api.updateUserProfile(updated.id, { links: updated.links }).then((fresh) => {
      if (!fresh) return;
      set((s) => {
        const nextUsers = s.users.map((u) => (u.id === fresh.id ? fresh : u));
        const next = { ...s, currentUser: fresh, users: nextUsers };
        saveState(next);
        return next;
      });
    });
  },

  updateLink: (id, data) => {
    const state = get();
    if (!state.currentUser) return;
    const links = state.currentUser.links.map((l) => (l.id === id ? { ...l, ...data } : l));
    const updated = { ...state.currentUser, links };
    const users = state.users.map((u) => (u.id === updated.id ? updated : u));
    const ns = { ...state, currentUser: updated, users };
    set(ns);
    saveState(ns);
    api.updateUserProfile(updated.id, { links: updated.links });
  },

  removeLink: (id) => {
    const state = get();
    if (!state.currentUser) return;
    const links = state.currentUser.links.filter((l) => l.id !== id);
    const updated = { ...state.currentUser, links };
    const users = state.users.map((u) => (u.id === updated.id ? updated : u));
    const ns = { ...state, currentUser: updated, users };
    set(ns);
    saveState(ns);
    api.updateUserProfile(updated.id, { links: updated.links });
  },

  reorderLinks: (links) => {
    const state = get();
    if (!state.currentUser) return;
    const updated = { ...state.currentUser, links };
    const users = state.users.map((u) => (u.id === updated.id ? updated : u));
    const ns = { ...state, currentUser: updated, users };
    set(ns);
    saveState(ns);
    api.updateUserProfile(updated.id, { links: updated.links });
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setViewingBio: (username) => set({ viewingBio: username }),

  blockUser: (userId) => {
    set((s) => {
      const users = s.users.map((u) => (u.id === userId ? { ...u, blocked: true } : u));
      const ns = { ...s, users };
      saveState(ns);
      return ns;
    });
    api.blockUserById(userId);
  },

  unblockUser: (userId) => {
    set((s) => {
      const users = s.users.map((u) => (u.id === userId ? { ...u, blocked: false } : u));
      const ns = { ...s, users };
      saveState(ns);
      return ns;
    });
    api.unblockUserById(userId);
  },

  deleteUser: (userId) => {
    set((s) => {
      const users = s.users.filter((u) => u.id !== userId);
      const ns = { ...s, users };
      saveState(ns);
      return ns;
    });
    api.deleteUserById(userId);
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
