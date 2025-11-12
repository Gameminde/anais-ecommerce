import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { useMobileGestures } from './hooks/useMobileGestures'
import { ScrollProgressBar } from './components/ScrollAnimationWrapper'
// Note: Analytics utils were removed, using direct GA/Facebook Pixel
import './i18n'

import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/admin/AdminRoute'

// Import pages directly (no lazy loading for now to avoid bundling issues)
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import GiftBoxesPage from './pages/GiftBoxesPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import AboutPage from './pages/AboutPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import CheckoutPage from './pages/CheckoutPage'
import AccountPage from './pages/AccountPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

// Import admin pages directly
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage'

function App() {
  const handlePullRefresh = useCallback(() => {
    // Refresh the page data
    window.location.reload()
  }, [])

  const { setPullIndicatorRef } = useMobileGestures({
    onPullRefresh: handlePullRefresh,
    pullRefreshThreshold: 80
  })

  // Initialize analytics on app start
  useEffect(() => {
    // Analytics initialization removed - was using deleted utils
  }, [])

  // Track page views
  useEffect(() => {
    // Page view tracking removed - was using deleted utils
  }, [])

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            {/* Scroll Progress Bar */}
            <ScrollProgressBar />

            {/* Pull to refresh indicator */}
            <div ref={setPullIndicatorRef} className="pull-refresh-indicator">
              Refreshing...
            </div>

            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/gift-boxes" element={<GiftBoxesPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/account/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                <Route path="/order-success/:id" element={<OrderSuccessPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
                <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailsPage /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>

          {/* Mobile Bottom Navigation Portal - Complètement indépendant */}
          <MobileBottomNav />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
