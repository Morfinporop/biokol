import { BioLinkLogo, GitHubIcon, TwitterIcon, InstagramIcon, YouTubeIcon, TelegramIcon, DiscordIcon, TwitchIcon, LinkedInIcon } from '../components/Icons';
import FloatingIcons from '../components/FloatingIcons';

interface Props {
  onLogin: () => void;
  onViewDemo: () => void;
}

export default function LandingPage({ onLogin, onViewDemo }: Props) {

  const features = [
    {
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      title: 'Все ссылки в одном месте',
      desc: 'GitHub, Twitter, Instagram, YouTube — объедините все свои профили в одну красивую страницу',
    },
    {
      icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      title: 'Кастомный дизайн',
      desc: 'Выберите цветовую схему, акцентный цвет и стиль который отражает вашу личность',
    },
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'Аналитика просмотров',
      desc: 'Смотрите сколько людей просматривают вашу страницу в реальном времени',
    },
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      title: 'Безопасность',
      desc: 'Защита аккаунта, капча от ботов, блокировка подозрительных пользователей',
    },
    {
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      title: '100% Бесплатно',
      desc: 'Никаких скрытых платежей, никаких ограничений. Все функции бесплатно навсегда',
    },
    {
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      title: 'Поддержка 14+ платформ',
      desc: 'GitHub, Twitter, Instagram, YouTube, Telegram, Discord, TikTok, Spotify и многое другое',
    },
  ];

  const platformsRow = [
    { Icon: GitHubIcon, name: 'GitHub', color: '#ffffff' },
    { Icon: TwitterIcon, name: 'Twitter', color: '#1DA1F2' },
    { Icon: InstagramIcon, name: 'Instagram', color: '#E1306C' },
    { Icon: YouTubeIcon, name: 'YouTube', color: '#FF0000' },
    { Icon: TelegramIcon, name: 'Telegram', color: '#229ED9' },
    { Icon: DiscordIcon, name: 'Discord', color: '#5865F2' },
    { Icon: TwitchIcon, name: 'Twitch', color: '#9146FF' },
    { Icon: LinkedInIcon, name: 'LinkedIn', color: '#0077B5' },
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
            <img src="/logo.png" alt="BioLink" className="w-8 h-8 rounded-lg" />
            <span className="text-white font-bold text-lg">BioLink</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onViewDemo}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors px-3 py-2"
            >
              Демо
            </button>
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
          Бесплатно навсегда
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
          <span className="text-white">Один линк.</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
            Все платформы.
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Создайте красивую bio-страницу за 30 секунд. Объедините GitHub, Twitter, Instagram и все остальные ваши профили в одной ссылке — бесплатно.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={onLogin}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Создать бесплатно
          </button>
          <button
            onClick={onViewDemo}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Посмотреть демо
          </button>
        </div>

        <p className="text-gray-600 text-xs mt-5">Регистрация за 30 секунд. Кредитная карта не нужна.</p>
        <p className="text-gray-500 text-xs mt-3">У нас есть один минус: хостинг из-за границы, поэтому может быть пинг. Мы активно это улучшаем.</p>
      </section>

      {/* URL preview */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
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
          <p className="text-gray-500 text-xs mt-3">Ваш персональный адрес</p>
        </div>
      </section>

      {/* Platforms */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <p className="text-center text-gray-500 text-sm mb-8">Поддерживает все популярные платформы</p>
        <div className="flex items-center justify-center flex-wrap gap-6">
          {platformsRow.map(({ Icon, name, color }) => (
            <div key={name} className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                <Icon size={20} color={color} />
              </div>
              <span className="text-gray-600 text-xs">{name}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-gray-400 text-xs font-bold">+6</span>
            </div>
            <span className="text-gray-600 text-xs">и ещё</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-white mb-4">Всё что вам нужно</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Полный набор инструментов для создания идеального bio-link — без подписок</p>
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
            <BioLinkLogo size={20} />
            <span className="text-gray-500 text-sm">BioLink</span>
          </div>
          <p className="text-gray-600 text-xs">Бесплатный bio-link сервис</p>
        </div>
      </footer>
    </div>
  );
}
