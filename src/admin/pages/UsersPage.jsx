import React from 'react';
import EmptyState from '../components/ui/EmptyState.jsx';

/**
 * Página de gestión de usuarios — preparada para implementación futura
 */
export default function UsersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-main">Usuarios</h1>
          <p className="text-xs text-text-muted">Gestión de usuarios y roles</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-light p-8">
        <EmptyState
          icon="group"
          title="Sistema de usuarios"
          description="El sistema de gestión de usuarios con roles (admin, editor, viewer) está preparado para escalar. Configura tu primer usuario administrador en Supabase Auth."
        />
        
        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
          {[
            { icon: 'admin_panel_settings', role: 'Admin', desc: 'Acceso total al panel', color: 'text-error' },
            { icon: 'edit_note', role: 'Editor', desc: 'Crear y editar contenido', color: 'text-primary' },
            { icon: 'visibility', role: 'Viewer', desc: 'Solo lectura', color: 'text-accent' },
          ].map(r => (
            <div key={r.role} className="bg-background-soft rounded-xl p-4 text-center">
              <span className={`material-symbols-outlined text-2xl ${r.color} mb-2 block`}>{r.icon}</span>
              <p className="text-sm font-bold text-text-main">{r.role}</p>
              <p className="text-xs text-text-muted mt-0.5">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
