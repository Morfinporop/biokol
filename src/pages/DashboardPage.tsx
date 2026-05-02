import { useState } from 'react';
import { useStore } from '../store/useStore';
import { getPlatformIcon, getPlatformColor, PLATFORMS } from '../components/Icons';

interface Props {
  onViewBio: (username: string) => void;
}

type Tab = 'overview' | 'links' | 'appearance' | 'settings';

export default function DashboardPage({ onViewBio }: Props) {
  const { currentUser, logout, updateBio, addLink, updateLink, removeLink } = useStore();
  const [tab, setTab] = useState<Tab>('overview');
  const [newLink, setNewLink] = useState({ platform: 'github', url: '', label: '' });
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [bioForm, setBioForm] = useState({
    displayName: currentUser?.displayName || '',
    bio: currentUser?.bio || '',
    accentColor: currentUser?.accentColor || '#6366f1',
    profileBg: currentUser?.profileBg || '',
    musicUrl: currentUser?.musicUrl || '',
  });


  if (!currentUser) return null;

  const user = currentUser;
  const links = user.links.sort((a, b) => a.order - b.order);

  const saveAndNotify = (fn: () => void) => {
    fn();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddLink = () => {
    if (!newLink.url || !newLink.label) return;
    addLink({ ...newLink, enabled: true, icon: newLink.platform });
    setNewLink({ platform: 'github', url: '', label: '' });
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Обзор', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'links', label: 'Ссылки', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'appearance', label: 'Внешний вид', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { id: 'settings', label: 'Настройки', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const accentColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f97316', '#eab308', '#22c55e', '#06b6d4',
    '#3b82f6', '#ffffff',
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="BioLink" className="w-7 h-7 rounded-lg" />
            <span className="text-white font-bold text-lg">BioLink</span>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden"
              style={{
                background: user.avatar
                  ? 'transparent'
                  : `linear-gradient(135deg, ${user.accentColor}80, ${user.accentColor}30)`,
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                user.displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{user.displayName}</div>
              <div className="text-gray-500 text-xs truncate">@{user.username}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <button
            onClick={() => onViewBio(user.username)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Моя страница
          </button>
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Главная страница
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">
              {tab === 'overview' && 'Обзор'}
              {tab === 'links' && 'Управление ссылками'}
              {tab === 'appearance' && 'Внешний вид'}
              {tab === 'settings' && 'Настройки профиля'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-green-400 text-sm flex items-center gap-1.5 animate-fade-in">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Сохранено
              </span>
            )}
            <button
              onClick={() => onViewBio(user.username)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-medium transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Открыть
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Активных ссылок', value: user.links.filter(l => l.enabled).length, icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', color: 'purple' },
                  { label: 'Тариф', value: user.plan === 'elite' ? 'Elite' : user.plan === 'pro' ? 'Pro' : 'Free', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', color: user.plan === 'elite' ? 'yellow' : 'yellow' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                    <div className={`w-9 h-9 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-3`}>
                      <svg className={`w-4.5 h-4.5 text-${stat.color}-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d={stat.icon} />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Profile preview */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Предпросмотр профиля</h3>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0 overflow-hidden"
                    style={{
                      background: user.avatar
                        ? 'transparent'
                        : `linear-gradient(135deg, ${user.accentColor}80, ${user.accentColor}20)`,
                    }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      user.displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-white font-bold">{user.displayName}</div>
                      {user.verified && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={user.accentColor}>
                          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">@{user.username}</div>
                    <div className="text-gray-500 text-xs mt-1">{user.bio || 'Нет описания'}</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {user.links.filter(l => l.enabled).length} активных ссылок
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Быстрые действия</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Добавить ссылку', tab: 'links' as Tab, icon: 'M12 4v16m8-8H4' },
                    { label: 'Изменить внешний вид', tab: 'appearance' as Tab, icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
                  ].map(action => (
                    <button
                      key={action.label}
                      onClick={() => setTab(action.tab)}
                      className="flex items-center gap-3 p-4 bg-white/3 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-xl text-sm text-gray-300 hover:text-white transition-all text-left"
                    >
                      <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d={action.icon} />
                      </svg>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LINKS */}
          {tab === 'links' && (
            <div className="space-y-6 max-w-2xl">
              {/* Add link */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Добавить ссылку</h3>
                <div className="space-y-3">
                  <select
                    value={newLink.platform}
                    onChange={e => {
                      const p = PLATFORMS.find(pl => pl.id === e.target.value);
                      setNewLink(prev => ({ ...prev, platform: e.target.value, label: p?.name || '' }));
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all appearance-none"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.id} value={p.id} style={{ background: '#1a1a2e' }}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                  />
                  <input
                    type="text"
                    value={newLink.label}
                    onChange={e => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Название ссылки"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                  />
                  <button
                    onClick={handleAddLink}
                    disabled={!newLink.url || !newLink.label}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white py-3 rounded-xl text-sm font-semibold transition-all"
                  >
                    Добавить ссылку
                  </button>
                </div>
              </div>

              {/* Links list */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Ваши ссылки ({links.length})</h3>
                <div className="space-y-3">
                  {links.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-8">Нет ссылок. Добавьте первую!</p>
                  )}
                  {links.map(link => {
                    const color = getPlatformColor(link.platform);
                    const isEditing = editingLink === link.id;
                    return (
                      <div key={link.id} className="bg-white/3 border border-white/8 rounded-xl p-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              defaultValue={link.label}
                              onChange={e => updateLink(link.id, { label: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60"
                              placeholder="Название"
                            />
                            <input
                              type="url"
                              defaultValue={link.url}
                              onChange={e => updateLink(link.id, { url: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60"
                              placeholder="URL"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setEditingLink(null); saveAndNotify(() => {}); }}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-medium transition-all"
                              >
                                Сохранить
                              </button>
                              <button
                                onClick={() => setEditingLink(null)}
                                className="px-4 bg-white/5 hover:bg-white/10 text-gray-400 py-2 rounded-lg text-xs transition-all"
                              >
                                Отмена
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: `${color}15` }}
                            >
                              {getPlatformIcon(link.platform, 16, color)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium truncate">{link.label}</div>
                              <div className="text-gray-500 text-xs truncate">{link.url}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Toggle */}
                              <button
                                onClick={() => saveAndNotify(() => updateLink(link.id, { enabled: !link.enabled }))}
                                className={`w-9 h-5 rounded-full transition-all duration-300 relative ${link.enabled ? 'bg-indigo-600' : 'bg-white/10'}`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${link.enabled ? 'left-4' : 'left-0.5'}`} />
                              </button>
                              <button
                                onClick={() => setEditingLink(link.id)}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => saveAndNotify(() => removeLink(link.id))}
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {tab === 'appearance' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-1">Профиль</h3>
                <p className="text-gray-500 text-xs mb-5">Основная информация отображаемая в вашем bio</p>
                <div className="space-y-4">
                  {/* Avatar */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Аватар</label>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0 overflow-hidden"
                        style={{
                          background: user.avatar
                            ? 'transparent'
                            : `linear-gradient(135deg, ${user.accentColor}80, ${user.accentColor}30)`,
                        }}
                      >
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          user.displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-all text-gray-300 hover:text-white text-sm font-medium">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {user.avatar ? 'Изменить' : 'Загрузить'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Для админа разрешаем GIF
                                const isAdmin = user.email === 'energoferon41@gmail.com';
                                const maxSize = isAdmin ? 10 * 1024 * 1024 : 3 * 1024 * 1024;
                                
                                if (file.size > maxSize) {
                                  alert(`Файл слишком большой. Максимум ${isAdmin ? '10' : '3'}MB`);
                                  return;
                                }
                                
                                const reader = new FileReader();
                                reader.onload = () => {
                                  const result = reader.result as string;
                                  saveAndNotify(() => updateBio({ avatar: result }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        {user.avatar && (
                          <button
                            onClick={() => saveAndNotify(() => updateBio({ avatar: '' }))}
                            className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Удалить аватар
                          </button>
                        )}
                        <p className="text-gray-600 text-xs mt-1">
                          {user.email === 'energoferon41@gmail.com' 
                            ? 'JPG, PNG, GIF (до 10MB)'
                            : 'JPG, PNG (до 3MB)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Отображаемое имя</label>
                    <input
                      type="text"
                      value={bioForm.displayName}
                      onChange={e => setBioForm(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Описание</label>
                    <textarea
                      value={bioForm.bio}
                      onChange={e => setBioForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      maxLength={160}
                      placeholder="Расскажите о себе..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
                    />
                    <p className="text-gray-600 text-xs mt-1 text-right">{bioForm.bio.length}/160</p>
                  </div>
                  <button
                    onClick={() => saveAndNotify(() => updateBio({ displayName: bioForm.displayName, bio: bioForm.bio }))}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-semibold transition-all"
                  >
                    Сохранить
                  </button>
                </div>
              </div>

              {/* Background & Music */}
              <div className={`bg-white/3 border rounded-2xl p-6 ${
                user.plan === 'elite' 
                  ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5' 
                  : 'border-white/8'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">Фон и музыка</h3>
                  {user.plan === 'elite' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold">Elite</span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mb-5">
                  {user.plan === 'elite' 
                    ? 'GIF фоны и неограниченный размер музыки' 
                    : 'Персонализируйте свою страницу'}
                </p>
                <div className="space-y-4">
                  {/* Background Image */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Изображение фона</label>
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-2 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-400 group-hover:text-white transition-colors">
                            {user.profileBg ? 'Изменить фон' : 'Загрузить изображение'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            JPG, PNG, GIF (макс. {user.plan === 'elite' ? '20' : '5'}MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const maxSize = user.plan === 'elite' ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
                                if (file.size > maxSize) {
                                  alert(`Файл слишком большой. Максимум ${user.plan === 'elite' ? '20' : '5'}MB.\n\nДля больших изображений используйте внешний хостинг (например, imgur.com) и вставьте ссылку.`);
                                  return;
                                }
                              const reader = new FileReader();
                              reader.onload = () => {
                                const result = reader.result as string;
                                setBioForm(prev => ({ ...prev, profileBg: result }));
                                saveAndNotify(() => updateBio({ profileBg: result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {user.profileBg && (
                        <div className="relative">
                          <img src={user.profileBg} alt="Preview" className="w-full h-24 object-cover rounded-xl" />
                          <button
                            onClick={() => {
                              setBioForm(prev => ({ ...prev, profileBg: '' }));
                              saveAndNotify(() => updateBio({ profileBg: '' }));
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all"
                            title="Удалить фон"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Music */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">Фоновая музыка</label>
                    <div className="space-y-2">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-3 pb-4">
                          <svg className="w-6 h-6 mb-2 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          <p className="text-xs text-gray-400 group-hover:text-white transition-colors">
                            {user.musicUrl ? 'Изменить музыку' : 'Загрузить аудио'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            MP3, OGG, WAV (макс. {user.plan === 'elite' ? '50' : '10'}MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const maxSize = user.plan === 'elite' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
                                if (file.size > maxSize) {
                                  alert(`Файл слишком большой. Максимум ${user.plan === 'elite' ? '50' : '10'}MB.\n\nДля больших аудио файлов используйте внешний хостинг и вставьте ссылку.`);
                                  return;
                                }
                              const reader = new FileReader();
                              reader.onload = () => {
                                const result = reader.result as string;
                                setBioForm(prev => ({ ...prev, musicUrl: result }));
                                saveAndNotify(() => updateBio({ musicUrl: result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {user.musicUrl && (
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                          <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          <span className="text-white text-sm flex-1">Музыка загружена</span>
                          <button
                            onClick={() => {
                              setBioForm(prev => ({ ...prev, musicUrl: '' }));
                              saveAndNotify(() => updateBio({ musicUrl: '' }));
                            }}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Удалить музыку"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => saveAndNotify(() => updateBio({ profileBg: bioForm.profileBg, musicUrl: bioForm.musicUrl }))}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-semibold transition-all"
                  >
                    Сохранить изменения
                  </button>
                </div>
              </div>

              {/* Accent color */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-1">Акцентный цвет</h3>
                <p className="text-gray-500 text-xs mb-5">Цвет который используется для выделения элементов</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {accentColors.map(color => (
                    <button
                      key={color}
                      onClick={() => saveAndNotify(() => updateBio({ accentColor: color }))}
                      className={`w-9 h-9 rounded-xl transition-all duration-200 hover:scale-110 ${user.accentColor === color ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-[#0a0a0f] scale-110' : ''}`}
                      style={{ background: color, border: color === '#ffffff' ? '1px solid rgba(255,255,255,0.2)' : 'none' }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-gray-400 text-xs">Свой цвет:</label>
                  <input
                    type="color"
                    value={user.accentColor}
                    onChange={e => saveAndNotify(() => updateBio({ accentColor: e.target.value }))}
                    className="w-10 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-gray-500 text-xs font-mono">{user.accentColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-1">Аккаунт</h3>
                <p className="text-gray-500 text-xs mb-5">Информация об аккаунте</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Email</div>
                      <div className="text-white text-sm">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Имя пользователя</div>
                      <div className="text-white text-sm">@{user.username}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Дата регистрации</div>
                      <div className="text-white text-sm">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Тариф</div>
                      <div className="text-white text-sm flex items-center gap-2">
                        {user.plan === 'elite' ? (
                          <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-white text-xs px-2 py-0.5 rounded-md font-bold animate-pulse">Elite</span>
                        ) : user.plan === 'pro' ? (
                          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-md font-semibold">Pro</span>
                        ) : (
                          <span className="bg-white/10 text-gray-300 text-xs px-2 py-0.5 rounded-md">Free</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-1">Ваш биолинк</h3>
                <p className="text-gray-500 text-xs mb-4">Поделитесь этой ссылкой</p>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-indigo-400 text-sm flex-1 font-mono">bio.o/{user.username}</span>
                  <button
                    onClick={async () => {
                      const realUrl = `${window.location.origin}/@${user.username}`;
                      try {
                        await navigator.clipboard.writeText(realUrl);
                        alert('Ссылка скопирована!');
                      } catch (err) {
                        // Fallback для старых браузеров
                        const textArea = document.createElement('textarea');
                        textArea.value = realUrl;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.select();
                        try {
                          document.execCommand('copy');
                          alert('Ссылка скопирована!');
                        } catch (e) {
                          alert('Не удалось скопировать ссылку');
                        }
                        document.body.removeChild(textArea);
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-xs mt-2">Короткий адрес bio.o/{user.username} ведет на {window.location.origin}/@{user.username}</p>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                <h3 className="text-red-400 font-semibold mb-1">Опасная зона</h3>
                <p className="text-gray-500 text-xs mb-4">Необратимые действия</p>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
