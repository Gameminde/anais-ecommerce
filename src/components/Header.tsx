import { Link } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { cartCount } = useCart()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const currentLang = i18n.language

  return (
    <header className="bg-white border-b border-warm-gray/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logos/anais-logo-primary.svg" alt="ANAIS" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-body text-charcoal hover:text-anais-taupe transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/shop?type=ensemble" className="font-body text-charcoal hover:text-anais-taupe transition-colors">
              {t('nav.ensembles')}
            </Link>
            <Link to="/shop" className="font-body text-charcoal hover:text-anais-taupe transition-colors">
              {t('nav.shop')}
            </Link>
            <Link to="/gift-boxes" className="font-body text-charcoal hover:text-anais-taupe transition-colors">
              {t('nav.giftBoxes')}
            </Link>
            <Link to="/about" className="font-body text-charcoal hover:text-anais-taupe transition-colors">
              {t('nav.about')}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center space-x-2">
              <Globe className="w-4 h-4 text-warm-gray" />
              <select
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="text-sm font-body bg-transparent border-none focus:outline-none text-charcoal cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="ar">AR</option>
                <option value="fr">FR</option>
              </select>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-ivory-cream rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6 text-charcoal" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-antique-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link to={user ? '/account' : '/login'} className="p-2 hover:bg-ivory-cream rounded-lg transition-colors">
              <User className="w-6 h-6 text-charcoal" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-ivory-cream rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-charcoal" />
              ) : (
                <Menu className="w-6 h-6 text-charcoal" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-warm-gray/20">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-body text-charcoal hover:text-anais-taupe transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/shop?type=ensemble"
                onClick={() => setMobileMenuOpen(false)}
                className="font-body text-charcoal hover:text-anais-taupe transition-colors"
              >
                {t('nav.ensembles')}
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="font-body text-charcoal hover:text-anais-taupe transition-colors"
              >
                {t('nav.shop')}
              </Link>
              <Link
                to="/gift-boxes"
                onClick={() => setMobileMenuOpen(false)}
                className="font-body text-charcoal hover:text-anais-taupe transition-colors"
              >
                {t('nav.giftBoxes')}
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="font-body text-charcoal hover:text-anais-taupe transition-colors"
              >
                {t('nav.about')}
              </Link>

              {/* Language Switcher Mobile */}
              <div className="flex items-center space-x-2 pt-4 border-t border-warm-gray/20">
                <Globe className="w-4 h-4 text-warm-gray" />
                <select
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-sm font-body bg-transparent border-none focus:outline-none text-charcoal"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
