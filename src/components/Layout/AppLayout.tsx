import React, { useState } from 'react';
import '../../styles/Layout.css';

export type PageType = 'dashboard' | 'products' | 'customers' | 'sales' | 'orders' | 'reports' | 'settings';

interface AppLayoutProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  userName: string;
  userRole: string;
  onLogout: () => void;
  children: React.ReactNode;
}

const menuItems: Array<{ id: PageType; label: string; icon: string; roles?: string[] }> = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', label: 'Productos', icon: '📦' },
  { id: 'customers', label: 'Clientes', icon: '👥' },
  { id: 'sales', label: 'Ventas', icon: '🛒' },
  { id: 'orders', label: 'Órdenes', icon: '📋' },
  { id: 'reports', label: 'Reportes', icon: '📈' },
  { id: 'settings', label: 'Configuración', icon: '⚙️', roles: ['admin'] },
];

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onPageChange,
  userName,
  userRole,
  onLogout,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const visibleMenuItems = menuItems.filter(
    item => !item.roles || item.roles.includes(userRole)
  );

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">🏪</span>
            {sidebarOpen && <span className="logo-text">San Martín</span>}
          </h1>
          <button
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Contraer' : 'Expandir'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleMenuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            {sidebarOpen && (
              <>
                <div className="user-name">{userName}</div>
                <div className="user-role">{userRole}</div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-layout">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h2 className="page-title">
              {menuItems.find(item => item.id === currentPage)?.label}
            </h2>
          </div>

          <div className="topbar-right">
            <div className="search-bar">
              <input type="text" placeholder="Buscar..." />
            </div>

            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                👤 {userName}
              </button>

              {userMenuOpen && (
                <div className="dropdown-menu">
                  <button className="menu-item">Mi Perfil</button>
                  <button className="menu-item">Preferencias</button>
                  <hr />
                  <button className="menu-item logout" onClick={onLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};
