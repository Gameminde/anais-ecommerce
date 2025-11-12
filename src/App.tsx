import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useCallback, useEffect } from 'react'
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

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const GiftBoxesPage = lazy(() => import('./pages/GiftBoxesPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'))

// Lazy load admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'))
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'))
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'))
const AdminOrderDetailsPage = lazy(() => import('./pages/admin/AdminOrderDetailsPage'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anais-gold"></div>
  </div>
)

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
              <Suspense fallback={<LoadingSpinner />}>
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
              </Suspense>
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
