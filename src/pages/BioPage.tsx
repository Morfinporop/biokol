import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { getPlatformIcon, getPlatformColor } from '../components/Icons';

interface Props {
  username: string;
  onBack: () => void;
}

export default function BioPage({ username, onBack }: Props) {
  const { users } = useStore();
  const [animIn, setAnimIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  useEffect(() => {
    if (user?.musicUrl) {
      setShowWelcome(true);
      // Создаем аудио элемент
      const audio = new Audio(user.musicUrl);
      audio.loop = true;
      audio.volume = 0.7;
      audio.preload = 'auto';
      audioRef.current = audio;
      
      console.log('Аудио создано:', user.musicUrl);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    } else {
      setTimeout(() => setAnimIn(true), 50);
    }
  }, [user]);

  const handleEnter = () => {
    console.log('Кнопка "Открыть" нажата');
    
    if (audioRef.current) {
      console.log('Аудио элемент найден, пытаемся воспроизвести...');
      
      // Запускаем воспроизведение
      audioRef.current.play()
        .then(() => {
          console.log('✅ МУЗЫКА ИГРАЕТ!');
          setShowWelcome(false);
          setTimeout(() => setAnimIn(true), 100);
        })
        .catch((error) => {
          console.error('❌ Ошибка воспроизведения:', error);
          alert('Не удалось запустить музыку. Попробуйте обновить страницу.');
          setShowWelcome(false);
          setTimeout(() => setAnimIn(true), 100);
        });
    } else {
      console.error('❌ Аудио элемент не найден');
      setShowWelcome(false);
      setTimeout(() => setAnimIn(true), 100);
    }
  };

  const handleClose = () => {
    window.close();
    setTimeout(() => {
      onBack();
    }, 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <div className="text-6xl font-black text-white/10">404</div>
        <div className="text-white text-xl font-semibold">Пользователь не найден</div>
        <p className="text-gray-500 text-sm">bio.o/{username} не существует</p>
        <button onClick={onBack} className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all">
          На главную
        </button>
      </div>
    );
  }

  if (user.blocked) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <div className="text-white text-xl font-semibold">Аккаунт заблокирован</div>
        <button onClick={onBack} className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all">
          На главную
        </button>
      </div>
    );
  }

  const enabledLinks = user.links.filter(l => l.enabled).sort((a, b) => a.order - b.order);
  const accent = user.accentColor || '#6366f1';

  // Welcome screen for music
  if (showWelcome && user?.musicUrl) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
        {/* Blur background */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-md">
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleEnter}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1 active:translate-y-0"
            >
              Открыть
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
            >
              Закрыть
            </button>
          </div>

          <p className="text-gray-400 text-sm">
            При открытии будет играть музыка
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Custom background image or gradient */}
      {user.profileBg ? (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${user.profileBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4) blur(2px)',
          }}
        />
      ) : null}

      {/* Background glow */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          biolink
        </button>

        {/* Profile card */}
        <div
          className={`transition-all duration-700 ${animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Avatar & name */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white mb-4 ring-2 ring-white/10 shadow-2xl overflow-hidden"
              style={{
                background: user.avatar
                  ? 'transparent'
                  : `linear-gradient(135deg, ${accent}80, ${accent}30)`,
              }}
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.displayName} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ imageRendering: 'auto' }}
                />
              ) : (
                user.displayName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
              {user.verified && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={accent}>
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              )}
            </div>

            <p className="text-gray-400 text-sm mt-1">@{user.username}</p>

            {user.bio && (
              <p className="text-gray-300 text-sm text-center mt-3 max-w-xs leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {enabledLinks.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">Ссылки не добавлены</p>
            )}
            {enabledLinks.map((link, i) => {
              const color = getPlatformColor(link.platform);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{
                    transitionDelay: `${i * 40}ms`,
                    animation: `fadeSlideUp 0.5s ease forwards ${i * 60}ms`,
                    opacity: 0,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                  >
                    {getPlatformIcon(link.platform, 18, color)}
                  </div>
                  <span className="flex-1 text-white font-medium text-sm">{link.label}</span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col items-center gap-2">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs group">
              <img src="/logo.png" alt="BioLink" className="w-4 h-4 rounded" />
              <span>Создано с <span className="text-indigo-400">BioLink</span> — бесплатно</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
