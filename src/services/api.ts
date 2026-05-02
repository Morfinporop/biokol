const API_URL = '/api';

async function apiRequest(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  user?: T;
  users?: T[];
  isAdmin?: boolean;
  requireAdminPasswordSetup?: boolean;
  userId?: string;
}

// Получить всех пользователей
export async function fetchAllUsers() {
  try {
    const res = await apiRequest(`${API_URL}/users`);
    const data: ApiResponse = await res.json();
    return data.success ? data.users || [] : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Получить пользователя по username
export async function fetchUserByUsername(username: string) {
  try {
    const res = await apiRequest(`${API_URL}/users/${username}`);
    const data: ApiResponse = await res.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Регистрация
export async function registerUser(email: string, username: string, password: string) {
  try {
    const res = await apiRequest(`${API_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}

// Вход
export async function loginUser(email: string, password: string) {
  try {
    const res = await apiRequest(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}

// Обновить профиль
export async function updateUserProfile(userId: string, updates: any) {
  try {
    const res = await apiRequest(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    const data: ApiResponse = await res.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

// Удалить пользователя
export async function deleteUserById(userId: string) {
  try {
    const res = await apiRequest(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    const data: ApiResponse = await res.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Заблокировать пользователя
export async function blockUserById(userId: string) {
  try {
    const res = await apiRequest(`${API_URL}/users/${userId}/block`, {
      method: 'POST',
    });
    const data: ApiResponse = await res.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error('Error blocking user:', error);
    return null;
  }
}

// Разблокировать пользователя
export async function unblockUserById(userId: string) {
  try {
    const res = await apiRequest(`${API_URL}/users/${userId}/unblock`, {
      method: 'POST',
    });
    const data: ApiResponse = await res.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error('Error unblocking user:', error);
    return null;
  }
}

export async function setUserVip(userId: string, vip: boolean) {
  try {
    const res = await apiRequest(`${API_URL}/users/${userId}/vip`, {
      method: 'POST',
      body: JSON.stringify({ vip }),
    });
    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error setting vip:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}

export async function setUserRole(userId: string, role: 'user' | 'admin') {
  try {
    const res = await apiRequest(`${API_URL}/users/${userId}/role`, {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error setting role:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}

export async function setAdminPassword(userId: string, adminPassword: string) {
  try {
    const res = await apiRequest(`${API_URL}/users/${userId}/set-admin-password`, {
      method: 'POST',
      body: JSON.stringify({ adminPassword }),
    });
    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error setting admin password:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}

// ===== MESSAGING API =====

export async function getChatList(userId: string) {
  try {
    const res = await apiRequest(`${API_URL}/chats/${userId}`);
    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error getting chat list:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}

export async function getMessages(user1Id: string, user2Id: string) {
  try {
    const res = await apiRequest(`${API_URL}/messages/${user1Id}/${user2Id}`);
    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error getting messages:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}

export async function sendMessage(data: { from: string; to: string; text: string; type?: string }) {
  try {
    const res = await apiRequest(`${API_URL}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result: ApiResponse = await res.json();
    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}

export async function searchUsers(currentUserId: string) {
  try {
    const res = await apiRequest(`${API_URL}/users/search/${currentUserId}`);
    const data: ApiResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error searching users:', error);
    return { success: false, message: 'Ошибка сети' };
  }
}
