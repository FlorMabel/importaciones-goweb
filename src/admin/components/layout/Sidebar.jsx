import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext.jsx';

const NAV_ITEMS = [
  { path: '/admin',            icon: 'dashboard',          label: 'Dashboard',    exact: true },
  { path: '/admin/productos',  icon: 'inventory_2',        label: 'Productos' },
  { path: '/admin/categorias', icon: 'category',           label: 'Categorías' },
  { path: '/admin/pedidos',    icon: 'shopping_bag',       label: 'Pedidos',      badge: true },
  { path: '/admin/media',      icon: 'photo_library',      label: 'Media' },
  { divider: true },
  { path: '/admin/usuarios',   icon: 'group',              label: 'Usuarios' },
  { path: '/admin/configuracion', icon: 'settings',        label: 'Configuración' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, sidebarMobileOpen, closeMobileSidebar } = useAdmin();
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#1a1714] text-white/80">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06] flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-lg">diamond</span>
        </div>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold text-white tracking-wide">GO SHOPPING</span>
            <span className="text-[10px] text-primary font-medium tracking-widest">ADMIN PANEL</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item, i) => {
          if (item.divider) {
            return <div key={i} className="my-3 border-t border-white/[0.06]" />;
          }

          const active = isActive(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={closeMobileSidebar}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-accent text-white shadow-md'
                  : 'hover:bg-white/[0.06] text-white/60 hover:text-white/90'
              }`}
            >
              {/* Left accent bar */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <span className={`material-symbols-outlined text-xl ${
                active ? 'text-primary' : 'text-white/50 group-hover:text-white/80'
              }`}>
                {item.icon}
              </span>

              {sidebarOpen && (
                <span className="flex-1">{item.label}</span>
              )}

              {item.badge && sidebarOpen && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                  •
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button (desktop) */}
      <div className="px-3 py-3 border-t border-white/[0.06] flex-shrink-0 hidden lg:block">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">
            {sidebarOpen ? 'chevron_left' : 'chevron_right'}
          </span>
          {sidebarOpen && <span className="text-xs">Colapsar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${
          sidebarOpen ? 'w-[260px]' : 'w-[72px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={closeMobileSidebar}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[260px] z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
