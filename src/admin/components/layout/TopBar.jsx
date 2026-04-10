import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext.jsx';
import SearchBar from '../ui/SearchBar.jsx';

const BREADCRUMB_MAP = {
  '/admin': 'Dashboard',
  '/admin/productos': 'Productos',
  '/admin/categorias': 'Categorías',
  '/admin/pedidos': 'Pedidos',
  '/admin/media': 'Media',
  '/admin/usuarios': 'Usuarios',
  '/admin/configuracion': 'Configuración',
};

export default function TopBar({ user, onLogout }) {
  const { toggleMobileSidebar, globalSearch, setGlobalSearch } = useAdmin();
  const location = useLocation();

  // Build breadcrumb
  const pageTitle = BREADCRUMB_MAP[location.pathname] || 'Admin';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-border-light flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-text-main hover:bg-background-soft transition-colors"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-lg font-bold text-text-main truncate">{pageTitle}</h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <SearchBar
          value={globalSearch}
          onChange={setGlobalSearch}
          placeholder="Buscar productos, pedidos..."
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Quick link to store */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
          title="Ver tienda"
        >
          <span className="material-symbols-outlined text-xl">storefront</span>
        </a>


        {/* Profile */}
        <div className="flex items-center gap-2 pl-3 ml-1 border-l border-border-light">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-text-main leading-tight">
              {user?.email?.split('@')[0] || 'Admin'}
            </span>
            <span className="text-[10px] text-text-muted leading-tight">Administrador</span>
          </div>
          <button
            onClick={onLogout}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-red-50 transition-colors"
            title="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
