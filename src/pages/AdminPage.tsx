import { useState } from 'react';
import { useStore } from '../store/useStore';

interface Props {
  onViewBio: (username: string) => void;
  onGoHome?: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'pages';

export default function AdminPage({ onViewBio, onGoHome }: Props) {
  const { users, logout, blockUser, unblockUser, deleteUser } = useStore();
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const totalLinks = users.reduce((a, u) => a + u.links.length, 0);
  const blocked = users.filter(u => u.blocked).length;

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Панель', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'users', label: 'Пользователи', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'pages', label: 'Страницы', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  ];

  return (
    <div className="min-h-screen bg-[#07070d] flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="BioLink" className="w-7 h-7 rounded-lg" />
            <div>
              <span className="text-white font-bold text-base">BioLink</span>
              <div className="text-xs text-red-400 font-medium">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? 'bg-red-500/15 text-red-400 border border-red-500/20'
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

        <div className="p-3 border-t border-white/5 space-y-1">
          <button
            onClick={onGoHome}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 rounded-xl transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Мой профиль
          </button>
          <button
            onClick={() => {
              const currentUser = useStore.getState().currentUser;
              if (currentUser) onViewBio(currentUser.username);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Моя страница
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти из аккаунта
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="border-b border-white/5 px-8 py-5">
          <h1 className="text-white font-bold text-xl">
            {tab === 'dashboard' && 'Панель управления'}
            {tab === 'users' && 'Пользователи'}
            {tab === 'pages' && 'Страницы'}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">Реальное время — {new Date().toLocaleString('ru-RU')}</p>
        </div>

        <div className="p-8">
          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Пользователей', value: users.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: '#6366f1' },
                  { label: 'Ссылок', value: totalLinks, icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', color: '#06b6d4' },
                  { label: 'Заблокировано', value: blocked, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', color: '#ef4444' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}20` }}>
                      <svg className="w-4.5 h-4.5" style={{ color: stat.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d={stat.icon} />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent users */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Последние регистрации</h3>
                <div className="space-y-3">
                  {[...users].reverse().slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
                        style={{
                          background: u.avatar
                            ? 'transparent'
                            : `linear-gradient(135deg, ${u.accentColor}60, ${u.accentColor}20)`,
                        }}
                      >
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.displayName} className="w-full h-full object-cover" />
                        ) : (
                          u.displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{u.displayName}</div>
                        <div className="text-gray-500 text-xs">@{u.username}</div>
                      </div>
                      <div className="text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString('ru-RU')}</div>
                      {u.blocked && <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">Заблокирован</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top by links */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Топ по количеству ссылок</h3>
                <div className="space-y-2">
                  {[...users].sort((a, b) => b.links.length - a.links.length).slice(0, 5).map((u, i) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="text-gray-600 text-sm font-mono w-4">#{i + 1}</div>
                      <button
                        onClick={() => onViewBio(u.username)}
                        className="flex-1 text-left text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                      >
                        @{u.username}
                      </button>
                      <div className="text-gray-400 text-sm">{u.links.length} ссылок</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Поиск пользователей..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                  />
                </div>
                <span className="text-gray-500 text-sm">{filteredUsers.length} из {users.length}</span>
              </div>

              <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider px-6 py-4">Пользователь</th>
                      <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider px-6 py-4">Email</th>
                      <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider px-6 py-4">Ссылки</th>
                      <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider px-6 py-4">Статус</th>
                      <th className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider px-6 py-4">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
                              style={{
                                background: u.avatar
                                  ? 'transparent'
                                  : `linear-gradient(135deg, ${u.accentColor}60, ${u.accentColor}20)`,
                              }}
                            >
                              {u.avatar ? (
                                <img src={u.avatar} alt={u.displayName} className="w-full h-full object-cover" />
                              ) : (
                                u.displayName.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">{u.displayName}</div>
                              <div className="text-gray-500 text-xs">@{u.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{u.email}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{u.links.length}</td>
                        <td className="px-6 py-4">
                          {u.blocked ? (
                            <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg">Заблокирован</span>
                          ) : u.verified ? (
                            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">Верифицирован</span>
                          ) : (
                            <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">Активен</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onViewBio(u.username)}
                              className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                              title="Просмотр страницы"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                            {u.blocked ? (
                              <button
                                onClick={() => unblockUser(u.id)}
                                className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                                title="Разблокировать"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 019.9-1" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => blockUser(u.id)}
                                className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-all"
                                title="Заблокировать"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                              </button>
                            )}
                            {confirmDelete === u.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => { deleteUser(u.id); setConfirmDelete(null); }}
                                  className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-all"
                                >
                                  Да
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2 py-1 bg-white/5 text-gray-400 rounded-lg text-xs hover:bg-white/10 transition-all"
                                >
                                  Нет
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(u.id)}
                                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Удалить"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-sm">Пользователи не найдены</div>
                )}
              </div>
            </div>
          )}

          {/* PAGES */}
          {tab === 'pages' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {users.map(u => (
                  <div key={u.id} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden"
                          style={{
                            background: u.avatar
                              ? 'transparent'
                              : `linear-gradient(135deg, ${u.accentColor}60, ${u.accentColor}20)`,
                          }}
                        >
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.displayName} className="w-full h-full object-cover" />
                          ) : (
                            u.displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-white text-sm font-semibold">{u.displayName}</div>
                            {u.verified && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={u.accentColor}>
                                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            )}
                          </div>
                          <div className="text-gray-500 text-xs">bio.o/{u.username}</div>
                        </div>
                      </div>
                      {u.blocked && (
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">Заблокирован</span>
                      )}
                    </div>

                    <div className="bg-white/3 rounded-xl p-3 mb-4">
                      <div className="text-white font-bold text-lg">{u.links.length}</div>
                      <div className="text-gray-500 text-xs">Ссылок добавлено</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewBio(u.username)}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-medium transition-all"
                      >
                        Открыть
                      </button>
                      {u.blocked ? (
                        <button
                          onClick={() => unblockUser(u.id)}
                          className="flex-1 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-xl text-xs font-medium transition-all"
                        >
                          Разблокировать
                        </button>
                      ) : (
                        <button
                          onClick={() => blockUser(u.id)}
                          className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium transition-all"
                        >
                          Заблокировать
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
