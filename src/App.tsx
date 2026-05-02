import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import BioPage from './pages/BioPage';
import MessengerPage from './pages/MessengerPage';

type Page = 'landing' | 'auth' | 'dashboard' | 'admin' | 'bio';

export default function App() {
  const { isLoggedIn, isAdmin, setViewingBio, loadUsers } = useStore();
  const [page, setPage] = useState<Page>('landing');
  const [bioUsername, setBioUsername] = useState<string>('');

  // Загрузка пользователей при старте
  useEffect(() => {
    loadUsers().catch(console.error);
  }, [loadUsers]);

  // Роутинг
  useEffect(() => {
    const handleRoute = () => {
      try {
        const path = window.location.pathname;
        const bioMatch = path.match(/^\/(?:bio\/|u\/|@|bio\.o\/)?([a-zA-Z0-9_]{3,20})$/);
        if (bioMatch && bioMatch[1] && !['auth', 'dashboard', 'admin'].includes(bioMatch[1])) {
          setBioUsername(bioMatch[1]);
          setPage('bio');
          return;
        }
        if (path === '/auth' || path === '/login') {
          setPage('auth');
          return;
        }
        if (path === '/dashboard') {
          if (isLoggedIn && !isAdmin) setPage('dashboard');
          else if (isAdmin) setPage('admin');
          else setPage('auth');
          return;
        }
        if (path === '/admin') {
          if (isAdmin) setPage('admin');
          else setPage('auth');
          return;
        }
        setPage('landing');
      } catch (e) {
        console.error('Route error:', e);
        setPage('landing');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, [isLoggedIn, isAdmin]);

  const navigateTo = (p: Page, username?: string) => {
    if (p === 'bio' && username) {
      useStore.getState().loadUsers();
      setBioUsername(username);
      setViewingBio(username);
      window.history.pushState({}, '', `/@${username}`);
    } else if (p === 'landing') {
      window.history.pushState({}, '', '/');
    } else if (p === 'auth') {
      window.history.pushState({}, '', '/auth');
    } else if (p === 'dashboard') {
      window.history.pushState({}, '', '/dashboard');
    } else if (p === 'admin') {
      window.history.pushState({}, '', '/admin');
    }
    setPage(p);
  };

  const handleAuthSuccess = () => {
    // After login go to messenger
    setTimeout(() => {
      const s = useStore.getState();
      if (s.isAdmin) navigateTo('admin');
      else navigateTo('dashboard'); // dashboard = messenger now
    }, 50);
  };

  // Re-check after login state change
  useEffect(() => {
    if (page === 'auth' && isLoggedIn) {
      if (isAdmin) navigateTo('admin');
      else navigateTo('dashboard');
    }
  }, [isLoggedIn, isAdmin]);

  return (
    <div className="min-h-screen">
      {page === 'landing' && (
        <LandingPage
          onLogin={() => navigateTo('auth')}
        />
      )}
      {page === 'auth' && (
        <AuthPage
          onSuccess={handleAuthSuccess}
          onBack={() => navigateTo('landing')}
        />
      )}
      {page === 'dashboard' && isLoggedIn && !isAdmin && (
        <MessengerPage />
      )}
      {page === 'admin' && isAdmin && (
        <AdminPage
          onViewBio={(username) => navigateTo('bio', username)}
          onGoHome={() => navigateTo('dashboard')}
        />
      )}
      {page === 'bio' && bioUsername && (
        <BioPage
          username={bioUsername}
          onBack={() => {
            if (isLoggedIn) {
              if (isAdmin) navigateTo('admin');
              else navigateTo('dashboard');
            } else {
              navigateTo('landing');
            }
          }}
        />
      )}
      {page === 'bio' && bioUsername && (
        <BioPage
          key={`bio-${bioUsername}`}
          username={bioUsername}
          onBack={() => {
            if (isLoggedIn) {
              if (isAdmin) navigateTo('admin');
              else navigateTo('dashboard');
            } else {
              navigateTo('landing');
            }
          }}
        />
      )}
      {/* Fallback */}
      {!['landing','auth','dashboard','admin','bio'].includes(page) && (
        <LandingPage
          onLogin={() => navigateTo('auth')}
        />
      )}
    </div>
  );
}
