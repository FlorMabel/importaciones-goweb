import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { supabase } from '../services/supabase.js';

// Lazy-loaded admin pages
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage.jsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'));
const MediaPage = lazy(() => import('./pages/MediaPage.jsx'));
const UsersPage = lazy(() => import('./pages/UsersPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));

function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Cargando...</p>
      </div>
    </div>
  );
}

// Full-screen loading state while checking existing session
function SessionCheck() {
  return (
    <div className="min-h-screen bg-[#14110f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-white/40 font-display">Verificando sesión...</p>
      </div>
    </div>
  );
}

/**
 * AdminApp — Root component for the admin dashboard
 * Uses Supabase Auth with session persistence
 */
export default function AdminApp() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAuth(true);
        }
      } catch (e) {
        console.warn('Session check failed:', e);
      } finally {
        setCheckingSession(false);
      }
    }
    checkSession();

    // Listen for auth state changes (e.g. token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuth(true);
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuth(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setAuthError(
          error.message === 'Invalid login credentials'
            ? 'Credenciales inválidas. Verifica tu email y contraseña.'
            : error.message
        );
        return;
      }

      setUser(data.user);
      setIsAuth(true);
    } catch (err) {
      setAuthError('Error de conexión. Intenta de nuevo.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuth(false);
    setUser(null);
  }, []);

  // Still checking if there's an existing session
  if (checkingSession) {
    return <SessionCheck />;
  }

  // Not authenticated — show login
  if (!isAuth) {
    return (
      <LoginPage
        onLogin={handleLogin}
        loading={authLoading}
        error={authError}
      />
    );
  }

  // Authenticated — show admin dashboard
  return (
    <AdminProvider>
      <Routes>
        <Route element={<AdminLayout user={user} onLogout={handleLogout} />}>
          <Route index element={
            <Suspense fallback={<AdminLoading />}><DashboardPage /></Suspense>
          } />
          <Route path="productos" element={
            <Suspense fallback={<AdminLoading />}><ProductsPage /></Suspense>
          } />
          <Route path="categorias" element={
            <Suspense fallback={<AdminLoading />}><CategoriesPage /></Suspense>
          } />
          <Route path="pedidos" element={
            <Suspense fallback={<AdminLoading />}><OrdersPage /></Suspense>
          } />
          <Route path="media" element={
            <Suspense fallback={<AdminLoading />}><MediaPage /></Suspense>
          } />
          <Route path="usuarios" element={
            <Suspense fallback={<AdminLoading />}><UsersPage /></Suspense>
          } />
          <Route path="configuracion" element={
            <Suspense fallback={<AdminLoading />}><SettingsPage /></Suspense>
          } />
        </Route>
      </Routes>
    </AdminProvider>
  );
}
