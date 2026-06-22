import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/items', label: 'Data Barang', icon: Package },
  { path: '/stock-in', label: 'Barang Masuk', icon: ArrowDownToLine },
  { path: '/stock-out', label: 'Barang Keluar', icon: ArrowUpFromLine },
  { path: '/reports', label: 'Laporan', icon: FileText },
  { path: '/users', label: 'Manajemen User', icon: Users },
];

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/items': 'Data Barang',
  '/stock-in': 'Barang Masuk',
  '/stock-out': 'Barang Keluar',
  '/reports': 'Laporan',
  '/users': 'Manajemen User',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app-layout">
      {/* Mobile sidebar toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="page-header">
          <div className="page-header-left">
            <span className="page-header-role">{user?.role || 'ADMIN'}</span>
            <h1 className="page-header-title">{currentTitle}</h1>
            <span className="page-header-subtitle">
              Sistem Informasi Inventori Perusahaan Berbasis Cloud
            </span>
          </div>
          <div className="page-header-right">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="user-name">{user?.name || 'Administrator'}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
