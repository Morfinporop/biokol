import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import BioPage from './pages/BioPage';

type Page = 'landing' | 'auth' | 'dashboard' | 'admin' | 'bio';

export default function App() {
  const { isLoggedIn, isAdmin, setViewingBio } = useStore();
  const [page, setPage] = useState<Page>('landing');
  const [bioUsername, setBioUsername] = useState<string>('');

  // Handle URL routing for bio pages: bio.o/username pattern
  useEffect(() => {
    const path = window.location.pathname;
    // Parse /bio/username or /u/username routes
    const bioMatch = path.match(/^\/(?:bio\/|u\/|@)?([a-zA-Z0-9_]{3,20})$/);
    if (bioMatch && bioMatch[1] && bioMatch[1] !== 'auth' && bioMatch[1] !== 'dashboard' && bioMatch[1] !== 'admin') {
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
  }, []);

  const navigateTo = (p: Page, username?: string) => {
    if (p === 'bio' && username) {
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
    // Read fresh state after login
    setTimeout(() => {
      const s = useStore.getState();
      if (s.isAdmin) navigateTo('admin');
      else navigateTo('dashboard');
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
          onViewDemo={() => navigateTo('bio', 'demo')}
        />
      )}
      {page === 'auth' && (
        <AuthPage
          onSuccess={handleAuthSuccess}
          onBack={() => navigateTo('landing')}
        />
      )}
      {page === 'dashboard' && isLoggedIn && !isAdmin && (
        <DashboardPage
          onViewBio={(username) => navigateTo('bio', username)}
        />
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
      {/* Fallback */}
      {!['landing','auth','dashboard','admin','bio'].includes(page) && (
        <LandingPage
          onLogin={() => navigateTo('auth')}
          onViewDemo={() => navigateTo('bio', 'demo')}
        />
      )}
    </div>
  );
}
