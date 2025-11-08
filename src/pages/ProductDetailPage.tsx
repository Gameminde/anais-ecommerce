import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Check, Sparkles } from 'lucide-react'
import { supabase, Product } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (id) fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      if (data) {
        setProduct(data)
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0])
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!product) return

    setAddingToCart(true)
    try {
      await addToCart(product.id, quantity, selectedSize, selectedColor)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-DZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-warm-gray">{t('common.loading')}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-warm-gray">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="aspect-[3/4] bg-warm-gray/10 relative">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-40 h-40 bg-anais-taupe/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-20 h-20 text-anais-taupe" />
                </div>
              </div>
              {product.is_featured && (
                <div className="absolute top-6 right-6 bg-antique-gold text-white px-4 py-2 rounded-full font-bold">
                  Featured
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
                {product.name_en}
              </h1>
              <p className="font-body text-body-lg text-warm-gray leading-relaxed">
                {product.description_en}
              </p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline space-x-4">
                <span className="font-display text-4xl text-antique-gold">
                  {formatPrice(product.sale_price_dzd || product.price_dzd)} DZD
                </span>
                {product.sale_price_dzd && (
                  <span className="font-body text-xl text-warm-gray line-through">
                    {formatPrice(product.price_dzd)} DZD
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="font-body font-bold text-sm uppercase tracking-wider text-charcoal mb-3 block">
                  {t('product.selectSize')}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg font-body font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-anais-taupe text-white shadow-lg'
                          : 'bg-white text-charcoal border-2 border-warm-gray/20 hover:border-anais-taupe'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <label className="font-body font-bold text-sm uppercase tracking-wider text-charcoal mb-3 block">
                  {t('product.selectColor')}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg font-body transition-all ${
                        selectedColor === color
                          ? 'bg-anais-taupe text-white shadow-lg'
                          : 'bg-white text-charcoal border-2 border-warm-gray/20 hover:border-anais-taupe'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="font-body font-bold text-sm uppercase tracking-wider text-charcoal mb-3 block">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg bg-white border-2 border-warm-gray/20 font-bold text-charcoal hover:border-anais-taupe transition-colors"
                >
                  -
                </button>
                <span className="font-body font-bold text-xl text-charcoal w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg bg-white border-2 border-warm-gray/20 font-bold text-charcoal hover:border-anais-taupe transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || addedToCart}
              className={`w-full py-4 rounded-xl font-body font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                addedToCart
                  ? 'bg-success-green text-white'
                  : 'bg-antique-gold text-white hover:bg-anais-taupe shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-6 h-6" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  <span>{addingToCart ? 'Adding...' : t('product.addToCart')}</span>
                </>
              )}
            </button>

            {/* Product Details */}
            <div className="mt-8 pt-8 border-t border-warm-gray/20">
              <h3 className="font-display text-xl text-charcoal mb-4">{t('product.details')}</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="font-body text-sm text-warm-gray">{t('product.sku')}:</dt>
                  <dd className="font-body text-sm font-bold text-charcoal">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-body text-sm text-warm-gray">Type:</dt>
                  <dd className="font-body text-sm font-bold text-charcoal capitalize">{product.product_type}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
