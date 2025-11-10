import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function CartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart()

  const deliveryFee = 400
  const total = cartTotal + deliveryFee

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-DZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-warm-gray">{t('common.loading')}</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-ivory-cream flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-warm-gray mx-auto mb-6" />
          <h2 className="font-display text-3xl text-charcoal mb-4">{t('cart.empty')}</h2>
          <p className="font-body text-warm-gray mb-8">Start adding items to your cart</p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-anais-taupe text-white font-body font-bold px-8 py-4 rounded-xl hover:bg-antique-gold transition-all duration-300"
          >
            <span>{t('cart.continueShopping')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory-cream">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const price = item.product?.sale_price_dzd || item.product?.price_dzd || 0
              const itemTotal = price * item.quantity

              return (
                <div key={item.id} className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex gap-6">
                    {/* Product Image Placeholder */}
                    <div className="w-24 h-24 bg-warm-gray/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-12 h-12 text-anais-taupe" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product_id}`}
                        className="font-display text-xl text-charcoal hover:text-anais-taupe transition-colors mb-2 block"
                      >
                        {item.product?.name_en}
                      </Link>
                      <div className="flex gap-4 mb-3">
                        {item.size && (
                          <span className="font-body text-sm text-warm-gray">
                            Size: <span className="font-bold text-charcoal">{item.size}</span>
                          </span>
                        )}
                        {item.color && (
                          <span className="font-body text-sm text-warm-gray">
                            Color: <span className="font-bold text-charcoal">{item.color}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-ivory-cream font-bold text-charcoal hover:bg-anais-taupe hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="font-body font-bold text-charcoal w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-ivory-cream font-bold text-charcoal hover:bg-anais-taupe hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-body font-bold text-lg text-antique-gold">
                            {formatPrice(itemTotal)} DZD
                          </div>
                          <div className="font-body text-xs text-warm-gray">
                            {formatPrice(price)} DZD each
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-alert-rose/10 rounded-lg transition-colors self-start"
                    >
                      <Trash2 className="w-5 h-5 text-alert-rose" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h2 className="font-display text-2xl text-charcoal mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-body text-warm-gray">{t('cart.subtotal')}</span>
                  <span className="font-body font-bold text-charcoal">{formatPrice(cartTotal)} DZD</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-warm-gray">{t('cart.delivery')}</span>
                  <span className="font-body font-bold text-charcoal">{formatPrice(deliveryFee)} DZD</span>
                </div>
                <div className="border-t border-warm-gray/20 pt-4">
                  <div className="flex justify-between">
                    <span className="font-display text-xl text-charcoal">{t('cart.total')}</span>
                    <span className="font-display text-2xl text-antique-gold">{formatPrice(total)} DZD</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-antique-gold text-white font-body font-bold py-4 rounded-xl hover:bg-anais-taupe transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-4"
              >
                {t('cart.checkout')}
              </button>

              <Link
                to="/shop"
                className="block text-center font-body text-sm text-anais-taupe hover:text-antique-gold transition-colors"
              >
                {t('cart.continueShopping')}
              </Link>

              {/* COD Notice */}
              <div className="mt-6 p-4 bg-ivory-cream rounded-lg">
                <p className="font-body text-sm text-warm-gray text-center">
                  Payment on delivery available. You will pay when you receive your order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
