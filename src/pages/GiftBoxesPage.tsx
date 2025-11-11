import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Filter, Sparkles, Gift, Heart, Calendar, PartyPopper } from 'lucide-react'
import { supabase, Product } from '../lib/supabase'
// Note: OptimizedImage component was removed, using direct img tag

export default function GiftBoxesPage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOccasion, setSelectedOccasion] = useState<string>('')

  const fetchGiftBoxes = useCallback(async () => {
    setLoading(true)
    try {
      console.log('🔍 GiftBoxesPage: Fetching gift boxes with occasion filter:', selectedOccasion)

      // Fetch products of type 'gift_box'
      const query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('product_type', 'gift_box')

      const { data: productsData, error: productsError } = await query.order('created_at', { ascending: false })

      if (productsError) {
        console.error('Error fetching gift boxes:', productsError)
        setLoading(false)
        return
      }

      if (productsData && productsData.length > 0) {
        // Fetch images separately for all products
        const productIds = productsData.map(p => p.id)
        const { data: imagesData, error: imagesError } = await supabase
          .from('product_images')
          .select('*')
          .in('product_id', productIds)
          .order('display_order')

        if (imagesError) {
          console.warn('Error fetching product images:', imagesError)
        }

        // Combine products with their images
        const productsWithImages = productsData.map(product => ({
          ...product,
          product_images: imagesData?.filter(img => img.product_id === product.id) || []
        }))

        setProducts(productsWithImages)
        console.log('✅ GiftBoxesPage: Loaded', productsWithImages.length, 'gift boxes with images')
      } else {
        setProducts([])
        console.log('ℹ️ GiftBoxesPage: No gift boxes found')
      }
    } catch (error) {
      console.error('Exception in fetchGiftBoxes:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [selectedOccasion])

  useEffect(() => {
    fetchGiftBoxes()
  }, [fetchGiftBoxes])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-DZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const occasionFilters = [
    { key: '', label: 'Tous les Coffrets', icon: Gift, color: 'text-gray-600' },
    { key: 'anniversaire', label: 'Anniversaire', icon: Calendar, color: 'text-pink-500' },
    { key: 'mariage', label: 'Mariage', icon: Heart, color: 'text-red-500' },
    { key: 'fete', label: 'Fête', icon: PartyPopper, color: 'text-purple-500' },
    { key: 'naissance', label: 'Naissance', icon: Sparkles, color: 'text-blue-500' },
    { key: 'promotion', label: 'Promotion', icon: Sparkles, color: 'text-green-500' }
  ]

  return (
    <div className="min-h-screen bg-ivory-cream">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
            Coffrets Cadeaux
          </h1>
          <p className="font-body text-body-lg text-warm-gray">
            Offrez l'élégance ANAIS avec nos coffrets cadeaux raffinés
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-anais-taupe" />
                <h2 className="font-display text-xl text-charcoal">Occasions</h2>
              </div>

              {/* Occasion Filters */}
              <div className="space-y-2">
                {occasionFilters.map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedOccasion(key)}
                    className={`w-full text-left px-3 py-3 rounded-lg font-body text-sm sm:text-base transition-colors min-h-[44px] flex items-center space-x-3 ${
                      selectedOccasion === key
                        ? 'bg-anais-taupe text-white'
                        : 'text-warm-gray hover:bg-ivory-cream'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${selectedOccasion === key ? 'text-white' : color}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <p className="font-body text-warm-gray">{t('common.loading')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="space-y-4">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto" />
                  <p className="font-body text-warm-gray">Aucun coffret cadeau trouvé</p>
                  <p className="font-body text-sm text-gray-500">
                    {selectedOccasion ? `pour l'occasion "${selectedOccasion}"` : 'dans notre collection'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="aspect-[3/4] bg-warm-gray/10 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      {product.is_featured && (
                        <div className="absolute top-4 right-4 bg-antique-gold text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                          Vedette
                        </div>
                      )}
                      {product.product_images && product.product_images.length > 0 ? (
                        <img
                          src={product.product_images.find(img => img.is_primary)?.image_url || product.product_images[0].image_url}
                          alt={product.name_en}
                          className="w-full h-full object-cover object-center"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-anais-taupe/10 to-anais-gold/10">
                          <div className="text-center">
                            <Gift className="w-16 h-16 text-anais-taupe mx-auto mb-2" />
                            <div className="text-xs text-anais-taupe font-medium">ANAIS</div>
                            <div className="text-xs text-gray-500 truncate px-2">{product.name_en}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 lg:p-5">
                      <h3 className="font-display text-base sm:text-lg text-charcoal mb-2 group-hover:text-anais-taupe transition-colors line-clamp-1">
                        {product.name_en}
                      </h3>
                      <p className="font-body text-xs sm:text-sm text-warm-gray mb-3 line-clamp-2">
                        {product.description_en}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-body font-bold text-base sm:text-lg text-antique-gold">
                            {formatPrice(product.price_dzd)} DZD
                          </span>
                          {product.sale_price_dzd && (
                            <span className="block font-body text-xs text-warm-gray line-through">
                              {formatPrice(product.sale_price_dzd)} DZD
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
