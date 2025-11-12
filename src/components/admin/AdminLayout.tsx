import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const { adminData } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    if (mobileMenuOpen) {
      console.log('🔄 Route changed, closing mobile menu');
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

  // Forcer la fermeture du menu mobile au montage du composant
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  // Gestionnaire pour la touche Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        console.log('⌨️ Escape key pressed, closing mobile menu');
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Produits', href: '/admin/products', icon: '📦' },
    { name: 'Catégories', href: '/admin/categories', icon: '🏷️' },
    { name: 'Commandes', href: '/admin/orders', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeMobileMenu}
          onTouchEnd={closeMobileMenu}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-anais-gold">
            <h1 className="text-xl font-bold text-white">ANAIS Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-anais-gold text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-anais-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {adminData?.role === 'super_admin' ? '👑' : '⚡'}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {adminData?.permissions?.length || 0} permissions
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors min-h-[44px]"
            >
              <span className="mr-3">🚪</span>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{
        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out'
      }}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between h-16 px-4 bg-anais-gold">
            <h1 className="text-xl font-bold text-white">ANAIS Admin</h1>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-anais-gold text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-anais-gold rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {adminData?.role === 'super_admin' ? '👑' : '⚡'}
                  </span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
                <p className="text-xs text-gray-500">
                  {adminData?.permissions?.length || 0} permissions
                </p>
              </div>
            </div>
            <button
              onClick={() => { handleSignOut(); closeMobileMenu(); }}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors min-h-[44px]"
            >
              <span className="mr-3">🚪</span>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              <button
                onClick={openMobileMenu}
                className="lg:hidden p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Page title */}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate ml-2 lg:ml-0">
                {navigationItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                {mobileMenuOpen && (
                  <span className="ml-2 text-sm text-gray-500 lg:hidden">
                    (Menu ouvert)
                  </span>
                )}
              </h2>

              {/* Mobile spacing */}
              <div className="lg:hidden w-10"></div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
