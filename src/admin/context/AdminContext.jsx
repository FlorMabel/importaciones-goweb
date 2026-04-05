import React, { createContext, useContext, useState, useCallback } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);
  const toggleMobileSidebar = useCallback(() => setSidebarMobileOpen(p => !p), []);
  const closeMobileSidebar = useCallback(() => setSidebarMobileOpen(false), []);

  const addNotification = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setNotifications(p => [...p, { id, msg, type }]);
    setTimeout(() => {
      setNotifications(p => p.filter(n => n.id !== id));
    }, 4000);
  }, []);

  return (
    <AdminContext.Provider value={{
      sidebarOpen, toggleSidebar,
      sidebarMobileOpen, toggleMobileSidebar, closeMobileSidebar,
      globalSearch, setGlobalSearch,
      notifications, addNotification,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
