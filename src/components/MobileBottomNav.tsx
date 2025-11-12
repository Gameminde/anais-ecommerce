import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Home, ShoppingBag, Package, Shield } from 'lucide-react'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useAdmin } from '../hooks/useAdmin'
import { createPortal } from 'react-dom'

// Mobile Bottom Navigation Component - Avec Portal pour fixation absolue
export default function MobileBottomNav() {
  const location = useLocation()
  const { cartCount } = useCart()
  const { user } = useAuth()
  const { isAdmin } = useAdmin()

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/', active: location.pathname === '/' },
    {
      icon: ShoppingBag,
      label: 'Ensembles',
      path: '/shop?type=ensemble',
      active: location.pathname === '/shop' && location.search.includes('type=ensemble')
    },
    { icon: Package, label: 'Boutique', path: '/shop', active: location.pathname === '/shop' && !location.search.includes('type=ensemble') },
    { icon: ShoppingCart, label: 'Panier', path: '/cart', active: location.pathname === '/cart', badge: cartCount },
    { icon: User, label: 'Mon Compte', path: user ? '/account' : '/login', active: location.pathname === '/account' || location.pathname === '/login' },
    ...(isAdmin ? [{ icon: Shield, label: 'Admin', path: '/admin', active: location.pathname.startsWith('/admin') }] : [])
  ]

  const handleNavClick = (path: string) => {
    // Scroll to top when navigating to prevent staying at bottom
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Créer un élément DOM séparé pour la sidebar si nécessaire
  useEffect(() => {
    let portalRoot = document.getElementById('mobile-nav-portal')
    if (!portalRoot) {
      portalRoot = document.createElement('div')
      portalRoot.id = 'mobile-nav-portal'
      portalRoot.style.cssText = `
        position: fixed !important;
        bottom: 0px !important;
        left: 0px !important;
        right: 0px !important;
        z-index: 2147483647 !important;
        pointer-events: none;
        width: 100vw !important;
        height: auto !important;
      `
      document.body.appendChild(portalRoot)
    }
  }, [])

  const navContent = (
    <nav className="mobile-bottom-nav-premium">
      {/* Background with elegant blur effect */}
      <div className="nav-background-blur"></div>

      {/* Main navigation container */}
      <div className="nav-container-premium">
        {navItems.map(({ icon: Icon, label, path, active, badge }) => (
          <Link
            key={path}
            to={path}
            onClick={() => handleNavClick(path)}
            className={`nav-item-premium ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
            aria-label={label}
          >
            {/* Icon container with premium styling */}
            <div className="nav-icon-container">
              <Icon className={`nav-icon ${active ? 'nav-icon-active' : 'nav-icon-inactive'}`} />

              {/* Badge for cart count */}
              <div className={`nav-badge ${badge === 0 ? 'nav-badge-empty' : ''}`}>
                <span className="nav-badge-text">
                  {badge > 99 ? '99+' : badge}
                </span>
              </div>

              {/* Active indicator dot */}
              {active && (
                <div className="nav-active-dot"></div>
              )}
            </div>

            {/* Label with elegant typography */}
            <span className={`nav-label ${active ? 'nav-label-active' : 'nav-label-inactive'}`}>
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Safe area padding for modern devices */}
      <div className="safe-area-padding"></div>
    </nav>
  )

  // Utiliser createPortal pour rendre la sidebar en dehors de la hiérarchie normale
  const portalRoot = document.getElementById('mobile-nav-portal')
  if (portalRoot) {
    return createPortal(navContent, portalRoot)
  }

  // Fallback si le portal n'existe pas encore
  return navContent
}