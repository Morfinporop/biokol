const API_URL = '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  user?: T;
  users?: T[];
}

// Получить всех пользователей
export async function fetchAllUsers() {
  try {
    const res = await fetch(`${API_URL}/users`);
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
    const res = await fetch(`${API_URL}/users/${username}`);
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
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_URL}/users/${userId}`, {
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
    const res = await fetch(`${API_URL}/users/${userId}/block`, {
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
    const res = await fetch(`${API_URL}/users/${userId}/unblock`, {
      method: 'POST',
    });
    const data: ApiResponse = await res.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error('Error unblocking user:', error);
    return null;
  }
}
