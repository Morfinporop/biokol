import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import * as api from '../services/api';
import FloatingIcons from '../components/FloatingIcons';

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  type: string;
  timestamp: string;
  read: boolean;
}

interface Chat {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  lastMessage: {
    text: string;
    timestamp: string;
    fromMe: boolean;
  } | null;
  unreadCount: number;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

export default function MessengerPage() {
  const { currentUser, logout } = useStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Загрузка чатов
  useEffect(() => {
    if (!currentUser) return;
    
    const loadChats = async () => {
      const data: any = await api.getChatList(currentUser.id);
      if (data.success) {
        setChats((data as any).chats || []);
      }
    };
    
    loadChats();
    const interval = setInterval(loadChats, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Загрузка сообщений при выборе чата
  useEffect(() => {
    if (!currentUser || !selectedChat) return;
    
    const loadMessages = async () => {
      const data: any = await api.getMessages(currentUser.id, selectedChat.userId);
      if (data.success) {
        setMessages((data as any).messages || []);
      }
    };
    
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedChat, currentUser]);

  // Поиск пользователей
  useEffect(() => {
    if (!currentUser || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const searchUsers = async () => {
      const data = await api.searchUsers(currentUser.id);
      if (data.success) {
        const filtered = (data.users || []).filter((u: User) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 10));
      }
    };
    
    const timeout = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, currentUser]);

  const sendMessage = async () => {
    if (!messageText.trim() || !currentUser || !selectedChat) return;
    
    const result: any = await api.sendMessage({
      from: currentUser.id,
      to: selectedChat.userId,
      text: messageText.trim(),
      type: 'text',
    });
    
    if (result.success && result.message) {
      setMessages(prev => [...prev, result.message as Message]);
      setMessageText('');
      
      // Обновить чат в списке
      setChats(prev => {
        const otherChats = prev.filter(c => c.userId !== selectedChat.userId);
        const updatedChat = {
          ...selectedChat,
          lastMessage: {
            text: messageText.trim(),
            timestamp: new Date().toISOString(),
            fromMe: true,
          },
        };
        return [updatedChat, ...otherChats].sort((a, b) => {
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
      });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  if (!currentUser) return null;

  return (
    <div className="h-screen bg-[#0a0a0f] flex overflow-hidden relative">
      {/* Floating Icons Background */}
      <FloatingIcons />
      
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(ellipse, #6366f1 0%, #8b5cf6 40%, transparent 70%)' }}
        />
      </div>
      
      {/* Sidebar - Список чатов */}
      <div className="w-80 flex-shrink-0 border-r border-white/5 flex flex-col relative z-10 backdrop-blur-xl bg-[#0a0a0f]/80">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.displayName} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm flex items-center gap-1.5">
                  {currentUser.displayName}
                  {currentUser.plan === 'elite' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold">VIP</span>
                  )}
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">ADM</span>
                  )}
                </div>
                <div className="text-gray-500 text-xs">@{currentUser.username}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = `/@${currentUser.username}`}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title="Мой профиль"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title="Выйти"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Поиск */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(e.target.value.length > 0);
              }}
              placeholder="Поиск..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          
          {/* Результаты поиска */}
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-[#0a0a0f]/95 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-64 overflow-auto">
              {searchResults.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    const newChat: Chat = {
                      userId: user.id,
                      username: user.username,
                      displayName: user.displayName,
                      avatar: user.avatar,
                      lastMessage: null,
                      unreadCount: 0,
                    };
                    setSelectedChat(newChat);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-all text-left border-b border-white/5 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{user.displayName}</div>
                    <div className="text-gray-500 text-xs">@{user.username}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Список чатов */}
        <div className="flex-1 overflow-auto">
          {chats.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              Нет чатов. Начните поиск пользователей!
            </div>
          ) : (
            chats.map(chat => (
                <button
                  key={chat.userId}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all text-left border-b border-white/5 ${
                    selectedChat?.userId === chat.userId ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                      {chat.avatar ? (
                        <img src={chat.avatar} alt={chat.displayName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        chat.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#0a0a0f]">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-white font-medium text-sm truncate">{chat.displayName}</div>
                    {chat.lastMessage && (
                      <div className="text-gray-600 text-xs flex-shrink-0">
                        {formatTime(chat.lastMessage.timestamp)}
                      </div>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs truncate">
                    {chat.lastMessage ? (
                      <span className={chat.lastMessage.fromMe ? 'text-indigo-400' : ''}>
                        {chat.lastMessage.fromMe && 'Вы: '}{chat.lastMessage.text}
                      </span>
                    ) : (
                      'Нет сообщений'
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative z-10 backdrop-blur-xl bg-[#0a0a0f]/80">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                  {selectedChat.avatar ? (
                    <img src={selectedChat.avatar} alt={selectedChat.displayName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    selectedChat.displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{selectedChat.displayName}</div>
                <div className="text-green-500 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  онлайн
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-12">
                  Начните общение с {selectedChat.displayName}
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.from === currentUser?.id;
                  const showDate = i === 0 || formatDate(messages[i-1].timestamp) !== formatDate(msg.timestamp);
                  
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="text-center text-gray-600 text-xs my-4">
                          {formatDate(msg.timestamp)}
                        </div>
                      )}
                      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 backdrop-blur-sm ${
                            isMe
                              ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white rounded-br-sm shadow-lg shadow-indigo-500/20'
                              : 'bg-white/8 text-white rounded-bl-sm border border-white/10'
                          }`}
                        >
                          <div className="text-sm">{msg.text}</div>
                          <div className={`text-xs mt-1 flex items-center gap-1 ${isMe ? 'text-white/60' : 'text-gray-500'}`}>
                            {formatTime(msg.timestamp)}
                            {isMe && (
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Написать сообщение..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all backdrop-blur-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-2xl transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              <div className="text-lg font-medium">Выберите чат</div>
              <div className="text-sm mt-1">или найдите нового пользователя</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
