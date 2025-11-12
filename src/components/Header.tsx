import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Globe, Home, ShoppingBag, Package, Heart, Shield } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useAdmin } from '../hooks/useAdmin'
// import { motion, useScroll, useTransform } from 'framer-motion' // Temporarily disabled due to React conflicts
import SplitText from './SplitText'
import ScrollAnimationWrapper from './ScrollAnimationWrapper'


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { cartCount } = useCart()
  const { isAdmin, loading: adminLoading } = useAdmin()

  // Debug admin status (remove in production)
  console.log('Header - user:', user?.email, 'isAdmin:', isAdmin)

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const currentLang = i18n.language

  // Simple scroll detection for header styling
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`relative h-20 bg-transparent sticky top-0 z-50 overflow-hidden transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/Gemini_Generated_Image_5a9xp45a9xp45a9x.png"
          alt="ANAIS Fashion Collection"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Header Content Overlay */}
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
          {/* Animated Logo */}
          <Link to="/" className="flex items-center">
            <SplitText
              text="ANAIS"
              className="font-display text-xl sm:text-2xl font-bold text-white tracking-wider drop-shadow-lg"
              direction="right"
              delay={0.5}
              duration={0.8}
              staggerChildren={0.1}
              type="chars"
            />
          </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="hover:scale-105 transition-transform">
                <Link to="/" className="font-body text-white hover:text-anais-taupe transition-colors drop-shadow-lg relative">
                  {t('nav.home')}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-anais-taupe scale-x-0 hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </div>

              <div className="hover:scale-105 transition-transform">
                <Link to="/shop?type=ensemble" className="font-body text-white hover:text-anais-taupe transition-colors drop-shadow-lg relative">
                  {t('nav.ensembles')}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-anais-taupe scale-x-0 hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </div>

              <div className="hover:scale-105 transition-transform">
                <Link to="/shop" className="font-body text-white hover:text-anais-taupe transition-colors drop-shadow-lg relative">
                  {t('nav.shop')}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-anais-taupe scale-x-0 hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </div>

              <div className="hover:scale-105 transition-transform">
                <Link to="/gift-boxes" className="font-body text-white hover:text-anais-taupe transition-colors drop-shadow-lg relative">
                  {t('nav.giftBoxes')}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-anais-taupe scale-x-0 hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </div>

              <div className="hover:scale-105 transition-transform">
                <Link to="/about" className="font-body text-white hover:text-anais-taupe transition-colors drop-shadow-lg relative">
                  {t('nav.about')}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-anais-taupe scale-x-0 hover:scale-x-100 transition-transform duration-200" />
                </Link>
              </div>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="hidden md:flex items-center space-x-2">
                <Globe className="w-4 h-4 text-white drop-shadow-lg" />
                <select
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-sm font-body bg-transparent border-none focus:outline-none text-white cursor-pointer drop-shadow-lg"
                >
                  <option value="en">EN</option>
                  <option value="ar">AR</option>
                  <option value="fr">FR</option>
                </select>
              </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-3 hover:bg-white/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white drop-shadow-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-antique-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] min-h-[20px]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Dashboard */}
            {isAdmin && (
              <Link to="/admin" className="p-3 hover:bg-white/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white drop-shadow-lg" />
              </Link>
            )}

            {/* User Account */}
            <Link to={user ? '/account' : '/login'} className="p-3 hover:bg-white/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <User className="w-6 h-6 text-white drop-shadow-lg" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 hover:bg-white/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white drop-shadow-lg" />
                ) : (
                  <Menu className="w-6 h-6 text-white drop-shadow-lg" />
                )}
              </button>
            </div>
          </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl z-40">
            <nav className="flex flex-col py-4">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-charcoal hover:text-anais-taupe hover:bg-gray-50 transition-all duration-200 py-4 px-6 text-base flex items-center border-b border-gray-100 last:border-b-0"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/shop?type=ensemble"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-charcoal hover:text-anais-taupe hover:bg-gray-50 transition-all duration-200 py-4 px-6 text-base flex items-center border-b border-gray-100 last:border-b-0"
                >
                  {t('nav.ensembles')}
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-charcoal hover:text-anais-taupe hover:bg-gray-50 transition-all duration-200 py-4 px-6 text-base flex items-center border-b border-gray-100 last:border-b-0"
                >
                  {t('nav.shop')}
                </Link>
                <Link
                  to="/gift-boxes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-charcoal hover:text-anais-taupe hover:bg-gray-50 transition-all duration-200 py-4 px-6 text-base flex items-center border-b border-gray-100 last:border-b-0"
                >
                  {t('nav.giftBoxes')}
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-charcoal hover:text-anais-taupe hover:bg-gray-50 transition-all duration-200 py-4 px-6 text-base flex items-center"
                >
                  {t('nav.about')}
                </Link>

                {/* Language Switcher Mobile */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-body text-gray-700">Language</span>
                  </div>
                  <select
                    value={currentLang}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="text-sm font-body bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-anais-taupe"
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
      </div>

    </header>
  )

  
}
