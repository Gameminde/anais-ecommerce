import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { ShoppingCart, User, Home, ShoppingBag, Package, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useAdmin } from '../hooks/useAdmin'

function MobileBottomNavContent() {
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
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  return (
    <nav className="mobile-bottom-nav-portal">
      {/* Background with elegant blur effect */}
      <div className="nav-background-blur-portal"></div>

      {/* Main navigation container */}
      <div className="nav-container-portal">
        {navItems.map(({ icon: Icon, label, path, active, badge }) => (
          <Link
            key={path}
            to={path}
            onClick={() => handleNavClick(path)}
            className={`nav-item-portal ${active ? 'nav-item-active-portal' : 'nav-item-inactive-portal'}`}
            aria-label={label}
          >
            {/* Icon container with premium styling */}
            <div className="nav-icon-container-portal">
              <Icon className={`nav-icon-portal ${active ? 'nav-icon-active-portal' : 'nav-icon-inactive-portal'}`} />

              {/* Badge for cart count */}
              <div className={`nav-badge-portal ${badge === 0 ? 'nav-badge-empty-portal' : ''}`}>
                <span className="nav-badge-text-portal">
                  {badge > 99 ? '99+' : badge}
                </span>
              </div>

              {/* Active indicator dot */}
              {active && (
                <div className="nav-active-dot-portal"></div>
              )}
            </div>

            {/* Label with elegant typography */}
            <span className={`nav-label-portal ${active ? 'nav-label-active-portal' : 'nav-label-inactive-portal'}`}>
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Safe area padding for modern devices */}
      <div className="safe-area-padding-portal"></div>
    </nav>
  )
}

// Composant principal qui utilise createPortal
export default function MobileBottomNavPortal() {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Créer un élément root pour le portal s'il n'existe pas
    let portalElement = document.getElementById('mobile-nav-portal-root')
    if (!portalElement) {
      portalElement = document.createElement('div')
      portalElement.id = 'mobile-nav-portal-root'
      portalElement.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        pointer-events: none !important;
        z-index: 2147483647 !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      `
      document.body.appendChild(portalElement)
    }
    setPortalRoot(portalElement)

    // Nettoyer lors du démontage
    return () => {
      if (portalElement && portalElement.parentNode) {
        portalElement.parentNode.removeChild(portalElement)
      }
    }
  }, [])

  // Ne rendre que si le portal root existe
  if (!portalRoot) return null

  return createPortal(<MobileBottomNavContent />, portalRoot)
}

