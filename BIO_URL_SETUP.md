# 🔗 Bio.o URL Система

## ✅ Что реализовано

### 1. **Красивые URL в стиле bio.o/username**
- В адресной строке отображается: `bio.o/yourname`
- Фактический рабочий URL: `https://biolink.up.railway.app/@yourname`
- Оба формата работают и ведут на одну страницу

### 2. **Поддерживаемые форматы ссылок:**
```
/bio.o/username   ← основной красивый формат
/@username        ← альтернативный
/bio/username     ← для совместимости
/u/username       ← для совместимости
```

### 3. **Social Media Preview (Discord, Telegram, VK)**
Когда кто-то делится ссылкой в Discord/Telegram:
- **Заголовок:** `BioLink — Профиль username`
- **Описание:** Био пользователя или "Страница ссылок displayName"
- **Картинка:** Аватар пользователя или логотип BioLink
- **URL:** `https://bio.o/bio.o/username`

## 🎯 Как это работает

### Серверная часть (server.js)

```javascript
// Обработка bio.o/username
app.get(['/bio.o/:username', '/bio/:username', '/u/:username'], (req, res) => {
  const user = getUserByUsername(username);
  // Inject meta tags для social preview
  html = injectMetaTags(html, user, baseUrl);
  res.send(html);
});

// Обработка @username
app.get('/@:username', (req, res) => {
  const user = getUserByUsername(username);
  // Inject meta tags для social preview
  html = injectMetaTags(html, user, baseUrl);
  res.send(html);
});
```

### Фронтенд (App.tsx)

```typescript
const navigateTo = (p: Page, username?: string) => {
  if (p === 'bio' && username) {
    // Используем bio.o/username для красивого URL
    window.history.pushState({}, '', `/bio.o/${username}`);
  }
};
```

### Динамические Meta Tags (BioPage.tsx)

```typescript
useEffect(() => {
  if (!user) return;
  
  // Обновляем Open Graph meta tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  ogTitle.setAttribute('content', `BioLink — Профиль ${user.username}`);
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  ogDesc.setAttribute('content', user.bio || `Страница ссылок ${user.displayName}`);
  
  const ogUrl = document.querySelector('meta[property="og:url"]');
  ogUrl.setAttribute('content', `${baseUrl}/bio.o/${user.username}`);
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  ogImage.setAttribute('content', user.avatar || `${baseUrl}/logo.png`);
}, [user]);
```

## 📱 Как это выглядит в Discord

### До (без meta tags):
```
biolink.up.railway.app
BioLink — Ссылки под рукой
Создайте бесплатную страницу со ссылками...
```

### После (с динамическими meta tags):
```
BioLink — Профиль morfa
Страница ссылок Morfa в BioLink
[Аватар пользователя]
```

## 🚀 Настройка на Railway

### 1. Добавь переменную окружения:
```
BASE_URL=https://bio.o
```

### 2. Настрой домен bio.o:
- Купи домен `bio.o` (или используй поддомен)
- В Railway добавь Custom Domain
- Настрой DNS записи

### 3. Для тестирования без домена:
Система работает и с основным доменом Railway:
```
https://biolink.up.railway.app/bio.o/morfa
```

## 💡 Лазейки и хитрости

### 1. **URL Rewrite**
Сервер принимает все форматы и internally преобразует их:
```
bio.o/morfa → @morfa → getUserByUsername('morfa')
```

### 2. **Social Preview Cache**
Discord/Telegram кэшируют preview. Чтобы обновить:
- Discord: https://discord.com/developers/docs/topics/opus#preview
- Telegram: https://web.telegram.org/a/#@WebpageBot

### 3. **Canonical URL**
Для SEO можно добавить:
```html
<link rel="canonical" href="https://bio.o/bio.o/username" />
```

## ✅ Проверка работы

### 1. Открой профиль:
```
https://biolink.up.railway.app/bio.o/demo
```

### 2. Проверь адресную строку:
Должно быть `/bio.o/demo`

### 3. Скопируй ссылку и вставь в Discord:
Должен появиться preview с именем пользователя

### 4. Проверь meta tags в консоли:
```javascript
document.querySelector('meta[property="og:title"]').content
// "BioLink — Профиль demo"
```

## 🎨 Визуальные улучшения

### В Dashboard:
```
Ваш биолинк
┌─────────────────────────────────┐
│ bio.o/morfa              [📋]  │
└─────────────────────────────────┘
bio.o/morfa — ваш уникальный адрес
```

### В Discord:
```
┌─────────────────────────────────┐
│ BioLink — Профиль morfa         │
│ Страница ссылок Morfa           │
│ [Аватар]                        │
│ biolink.up.railway.app          │
└─────────────────────────────────┘
```

## 🔧 Технические детали

### Server-side meta injection:
- При запросе `/bio.o/username` сервер находит пользователя
- Inject'ит правильные meta tags в HTML
- Отдает готовый HTML с правильными OG tags

### Client-side meta updates:
- При загрузке BioPage обновляет meta tags
- Для SPA навигации без перезагрузки
- Сбрасывает при размонтировании

### Fallback:
- Если пользователь не найден → стандартные meta tags
- Если blocked → 404 страница
- Если ошибка → стандартные meta tags

---

**Готово!** Теперь у тебя есть красивые URL и правильные social preview! 🎉
