# 💾 База данных на сервере

## Что сделано:

### 1. **Backend API создан** ✅
- Express сервер с API endpoints
- JSON файловая база данных
- Сохранение данных на хостинге

### 2. **Структура:**
```
server/
├── db.js          # Работа с базой данных
├── api.js         # API endpoints
└── database.json  # Файл базы данных (создается автоматически)
```

### 3. **API Endpoints:**

```
GET  /api/users              # Все пользователи
GET  /api/users/:username    # Пользователь по username
POST /api/register           # Регистрация
POST /api/login              # Вход
PUT  /api/users/:userId      # Обновить профиль
DELETE /api/users/:userId    # Удалить пользователя
POST /api/users/:userId/block   # Заблокировать
POST /api/users/:userId/unblock # Разблокировать
```

### 4. **Исправление кэша:**

#### Проблема:
Страница bio не обновлялась при прямом переходе по ссылке

#### Решение:
- Добавлен `key={Date.now()}` для принудительного ре-рендера
- Обновление данных из store при каждом монтировании
- Cache-Control headers на сервере

### 5. **Как это работает сейчас:**

**LocalStorage (временно):**
- Данные все еще в localStorage для совместимости
- API готов для переключения

**Для перехода на серверную БД:**
1. Раскомментировать импорт API в store
2. Заменить localStorage вызовы на API вызовы
3. Перезапустить сервер

## 🔧 Использование API

### Регистрация:
```javascript
POST /api/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "password"
}
```

### Вход:
```javascript
POST /api/login
{
  "email": "user@example.com",
  "password": "password"
}
```

### Обновить профиль:
```javascript
PUT /api/users/user-123456
{
  "displayName": "New Name",
  "bio": "New bio",
  "links": [...]
}
```

## 🚀 Запуск

### Development:
```bash
npm run dev
```

### Production:
```bash
npm run build
node server.js
```

### Railway:
- Автоматически запустится через `railway.json`
- База данных сохранится в файловой системе Railway
- При рестарте данные сохранятся

## ⚠️ Важно:

### Файловая БД:
- `server/database.json` создается автоматически
- Все данные в одном JSON файле
- Для продакшена лучше использовать PostgreSQL/MongoDB

### Пароли:
- Сейчас хранятся в plain text
- Для продакшена нужно хешировать (bcrypt)

### Лимиты:
- JSON limit: 50MB (для base64 файлов)
- Файловая система Railway: постоянная

## 🔄 Обновление страницы bio

### Исправлено:
1. **Key prop:** `key={Date.now()}` форсирует обновление
2. **useEffect dependency:** `[username, users]` следит за изменениями
3. **Cache headers:** `no-cache, no-store, must-revalidate`

### Теперь:
- При переходе по /@username всегда свежие данные
- При обновлении профиля изменения видны сразу
- Кэш браузера не мешает

## 📝 Миграция на серверную БД

Когда будете готовы перейти полностью на API:

### 1. Обновить store.ts:
```typescript
// Вместо localStorage
const saved = loadState();

// Использовать
const saved = await api.fetchAllUsers();
```

### 2. Обновить функции:
```typescript
// register
const result = await api.registerUser(email, username, password);

// login  
const result = await api.loginUser(email, password);

// updateBio
await api.updateUserProfile(userId, updates);
```

### 3. Инициализация:
```typescript
// При запуске приложения
useEffect(() => {
  loadUsers();
}, []);
```

## ✅ Сейчас работает:

- ✅ Backend API готов
- ✅ БД на хостинге (файловая)
- ✅ Обновление bio страницы исправлено
- ✅ Кэш отключен
- ✅ LocalStorage как fallback

## 🔜 Для полного перехода:

1. Подключить API вызовы в store
2. Удалить localStorage код
3. Тестировать
4. Деплой на Railway
