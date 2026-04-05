import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';

export default function AdminLayout({ user, onLogout }) {
  const { sidebarOpen } = useAdmin();

  return (
    <div className="min-h-screen bg-background-soft font-display">
      <Sidebar />
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[72px]'
      }`}>
        <TopBar user={user} onLogout={onLogout} />
        <main className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
