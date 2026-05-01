import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import FloatingIcons from '../components/FloatingIcons';

// Simple math captcha
function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

interface Props {
  onSuccess: () => void;
  onBack?: () => void;
}

export default function AuthPage({ onSuccess, onBack }: Props) {
  const { login, register } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Admin special mode
  const isAdminEmail = email.toLowerCase() === 'energoferon41@gmail.com';

  useEffect(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    setError('');
    setSuccess('');
  }, [mode]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Captcha check (skip for admin)
    if (!isAdminEmail && mode === 'register') {
      if (parseInt(captchaInput) !== captcha.answer) {
        setError('Неверная капча. Попробуйте снова.');
        refreshCaptcha();
        return;
      }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    if (mode === 'login') {
      const result = login(email, password);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(onSuccess, 800);
      } else {
        setError(result.message);
        refreshCaptcha();
      }
    } else {
      if (parseInt(captchaInput) !== captcha.answer) {
        setError('Неверная капча. Попробуйте снова.');
        refreshCaptcha();
        setLoading(false);
        return;
      }
      const result = register(email, username, password);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(onSuccess, 800);
      } else {
        setError(result.message);
        refreshCaptcha();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-6 left-6 z-30 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Назад
        </button>
      )}

      <FloatingIcons />

      {/* Ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="BioLink" className="w-10 h-10 rounded-lg" />
            <span className="text-2xl font-bold text-white tracking-tight">BioLink</span>
          </div>
          <p className="text-gray-400 text-sm">Бесплатный bio-link сервис</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all text-sm"
              />
            </div>

            {/* Admin: show only password field in center */}
            {isAdminEmail && mode === 'login' ? (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">
                  Пароль администратора
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-indigo-500/40 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-indigo-400 text-xs mt-2 text-center">Режим администратора</p>
              </div>
            ) : (
              <>
                {/* Username (register only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Имя пользователя</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">bio.o/</span>
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        required
                        placeholder="username"
                        minLength={3}
                        maxLength={20}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-all text-sm"
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">Только латинские буквы, цифры и _</p>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Пароль</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={mode === 'register' ? 6 : 1}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPass ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Captcha (register only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Проверка: сколько будет {captcha.a} + {captcha.b}?</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={captchaInput}
                        onChange={e => setCaptchaInput(e.target.value)}
                        required
                        placeholder="Ответ"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                        title="Обновить капчу"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="23 4 23 10 17 10" />
                          <polyline points="1 20 1 14 7 14" />
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Error / Success */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Загрузка...
                </span>
              ) : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Регистрируясь, вы соглашаетесь с условиями использования.
        </p>
      </div>
    </div>
  );
}
