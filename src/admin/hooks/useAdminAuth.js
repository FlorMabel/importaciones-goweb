import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase.js';

/**
 * Hook de autenticación para el admin
 * Usa Supabase Auth con verificación de rol en admin_users
 * 
 * Para desarrollo inicial: si no hay tabla admin_users, 
 * permite acceso con cualquier sesión de Supabase Auth
 */
export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check existing session
  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkRole(session.user.email);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  async function checkSession() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await checkRole(session.user.email);
      }
    } catch (e) {
      console.error('Auth check error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function checkRole(email) {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('role, name')
        .eq('email', email)
        .single();
      setRole(data?.role || 'admin'); // Default to admin if table doesn't exist yet
    } catch {
      setRole('admin'); // Fallback for development
    }
  }

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      setUser(data.user);
      await checkRole(data.user.email);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  }, []);

  const isAdmin = role === 'admin';
  const isEditor = role === 'admin' || role === 'editor';
  const isViewer = !!role;

  return {
    user,
    role,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    isEditor,
    isViewer,
    setError,
  };
}
