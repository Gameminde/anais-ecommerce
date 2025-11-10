import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const { adminData } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Produits', href: '/admin/products', icon: '📦' },
    { name: 'Catégories', href: '/admin/categories', icon: '🏷️' },
    { name: 'Commandes', href: '/admin/orders', icon: '📋' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-anais-gold">
            <h1 className="text-xl font-bold text-white">ANAIS Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-anais-gold text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-anais-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {adminData?.role === 'super_admin' ? '👑' : '⚡'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {adminData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {adminData?.permissions?.length || 0} permissions
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <span className="mr-3">🚪</span>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {navigationItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
