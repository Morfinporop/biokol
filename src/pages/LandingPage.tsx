import FloatingIcons from '../components/FloatingIcons';

interface Props {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: Props) {
  const features = [
    {
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      title: 'Мгновенные сообщения',
      desc: 'Общайся с друзьями в реальном времени. Сообщения доставляются за миллисекунды',
    },
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      title: 'Приватность',
      desc: 'Твои сообщения защищены. Никакой рекламы и отслеживания',
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'Быстрый и легкий',
      desc: 'Молниеносная работа даже при медленном интернете',
    },
    {
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      title: 'Медиа',
      desc: 'Отправляй фото, видео и документы любого размера',
    },
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      title: 'Групповые чаты',
      desc: 'Создавай группы до 1000 человек',
    },
    {
      icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
      title: 'Облачное хранение',
      desc: 'Все сообщения сохраняются в облаке. Доступ с любого устройства',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <FloatingIcons />

      {/* Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(ellipse, #6366f1 0%, #8b5cf6 40%, transparent 70%)' }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">BioGram</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Войти
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-xs font-medium mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Бесплатно. Навсегда. Без рекламы.
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
          <span className="text-white">Мессенджер</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
            нового поколения
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Быстрый, безопасный и бесплатный. Общайся с друзьями в реальном времени без ограничений.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={onLogin}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Начать общаться
          </button>
        </div>

        <p className="text-gray-600 text-xs mt-5">Регистрация за 30 секунд. Бесплатно.</p>

        {/* URL preview */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
            </div>
            <div className="bg-white/5 rounded-xl px-4 py-2.5 font-mono text-sm text-indigo-300 border border-white/5">
              biolink.up.railway.app/@<span className="text-white font-bold">yourname</span>
            </div>
            <p className="text-gray-500 text-xs mt-3">Твой профиль в BioGram</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-white mb-4">Всё что нужно для общения</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Полный набор функций для комфортного общения — без подписок и ограничений</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group backdrop-blur-sm bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/15 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={f.icon} />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <span className="text-gray-500 text-sm">BioGram</span>
          </div>
          <p className="text-gray-600 text-xs">Бесплатный мессенджер</p>
        </div>
      </footer>
    </div>
  );
}
