import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Filter, Sparkles } from 'lucide-react'
import { supabase, Product, Category } from '../lib/supabase'

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || '')

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
    if (data) setCategories(data)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      console.log('🔍 ShopPage: Fetching products with filters:', { selectedCategory, selectedType })

      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('product_type', 'gift_box')

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      if (selectedType) {
        query = query.eq('product_type', selectedType)
      }

      const { data: productsData, error: productsError } = await query.order('created_at', { ascending: false })

      if (productsError) {
        console.error('Error fetching products:', productsError)
        setLoading(false)
        return
      }

      if (productsData && productsData.length > 0) {
        const productIds = productsData.map(p => p.id)
        const { data: imagesData, error: imagesError } = await supabase
          .from('product_images')
          .select('*')
          .in('product_id', productIds)
          .order('display_order')

        if (imagesError) {
          console.warn('Error fetching product images:', imagesError)
        }

        const productsWithImages = productsData.map(product => ({
          ...product,
          product_images: imagesData?.filter(img => img.product_id === product.id) || []
        }))

        setProducts(productsWithImages)
        console.log('✅ ShopPage: Loaded', productsWithImages.length, 'products with images')
      } else {
        setProducts([])
        console.log('ℹ️ ShopPage: No products found')
      }
    } catch (error) {
      console.error('Exception in fetchProducts:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedType])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [fetchProducts])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-DZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-ivory-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
            {selectedType === 'ensemble' ? 'Ensembles' : 'Boutique'}
          </h1>
          <p className="font-body text-body-lg text-warm-gray">
            Découvrez notre collection de mode élégante et pudique
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-anais-taupe" />
                <h2 className="font-display text-xl text-charcoal">Filtres</h2>
              </div>

              <div className="mb-6">
                <h3 className="font-body font-bold text-sm uppercase tracking-wider text-charcoal mb-3">
                  Catégories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setSelectedType('')
                    }}
                    className={`w-full text-left px-3 py-3 rounded-lg font-body text-sm sm:text-base transition-colors min-h-[44px] flex items-center ${
                      !selectedCategory && !selectedType
                        ? 'bg-anais-taupe text-white'
                        : 'text-warm-gray hover:bg-ivory-cream'
                    }`}
                  >
                    Tous les Produits
                  </button>
                  {categories.filter(category =>
                    !category.name_fr?.toLowerCase().includes('coffret') &&
                    !category.name_en?.toLowerCase().includes('gift')
                  ).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setSelectedType('')
                      }}
                      className={`w-full text-left px-3 py-3 rounded-lg font-body text-sm sm:text-base transition-colors min-h-[44px] flex items-center ${
                        selectedCategory === category.id
                          ? 'bg-anais-taupe text-white'
                          : 'text-warm-gray hover:bg-ivory-cream'
                      }`}
                    >
                      {category.name_fr || category.name_en}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-body font-bold text-sm uppercase tracking-wider text-charcoal mb-3">
                  Type
                </h3>
                <div className="space-y-2">
                  {[
                    { type: 'ensemble', label: 'Ensembles' },
                    { type: 'perfume', label: 'Parfums' },
                    { type: 'makeup', label: 'Maquillage' }
                  ].map(({ type, label }) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type)
                        setSelectedCategory('')
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                        selectedType === type
                          ? 'bg-anais-taupe text-white'
                          : 'text-warm-gray hover:bg-ivory-cream'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <p className="font-body text-warm-gray">{t('common.loading')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-body text-warm-gray">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => {
                  const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];
                  const otherImages = product.product_images?.filter(img => img.id !== primaryImage?.id).slice(0, 3) || [];

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="aspect-[3/4] bg-warm-gray/10 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        {product.is_featured && (
                          <div className="absolute top-4 right-4 bg-antique-gold text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                            Vedette
                          </div>
                        )}

                        {product.product_type === 'ensemble' && (
                          <div className="absolute top-4 left-4 bg-anais-taupe text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                            Ensemble
                          </div>
                        )}

                        {primaryImage ? (
                          <div className="relative w-full h-full">
                            <img
                              src={primaryImage.image_url}
                              alt={product.name_en}
                              className="w-full h-full object-cover object-center"
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                            />

                            {product.product_type === 'ensemble' && otherImages.length > 0 && (
                              <div className="absolute bottom-3 right-3 flex space-x-1">
                                {otherImages.map((img, index) => (
                                  <div
                                    key={img.id}
                                    className="w-6 h-6 bg-white/90 rounded border-2 border-white shadow-sm overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ transform: `translateX(${index * 2}px)` }}
                                  >
                                    <img
                                      src={img.image_url}
                                      alt={`${product.name_en} view ${index + 2}`}
                                      className="w-full h-full object-cover"
                                      crossOrigin="anonymous"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-anais-taupe/10 to-anais-gold/10">
                            <div className="text-center">
                              <Sparkles className="w-16 h-16 text-anais-taupe mx-auto mb-2" />
                              <div className="text-xs text-anais-taupe font-medium">ANAIS</div>
                              <div className="text-xs text-gray-500 truncate px-2">{product.name_en}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-4 lg:p-5">
                        <div className="mb-2">
                          <h3 className="font-display text-base sm:text-lg text-charcoal mb-1 group-hover:text-anais-taupe transition-colors line-clamp-1">
                            {product.name_en}
                          </h3>
                          {product.product_type === 'ensemble' && (
                            <div className="flex items-center space-x-1 mb-2">
                              <span className="text-xs bg-anais-taupe/10 text-anais-taupe px-2 py-0.5 rounded-full font-medium">
                                Ensemble Complet
                              </span>
                              {product.product_images && product.product_images.length > 1 && (
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                  {product.product_images.length} vues
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="font-body text-xs sm:text-sm text-warm-gray mb-3 line-clamp-2">
                          {product.description_en}
                        </p>

                        {product.product_type === 'ensemble' && (
                          <div className="mb-3">
                            <div className="text-xs text-anais-taupe font-medium mb-1">Inclus dans cet ensemble :</div>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs px-2 py-0.5 bg-ivory-cream text-charcoal rounded">Robe</span>
                              <span className="text-xs px-2 py-0.5 bg-ivory-cream text-charcoal rounded">Voile</span>
                              <span className="text-xs px-2 py-0.5 bg-ivory-cream text-charcoal rounded">Accessoires</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-body font-bold text-base sm:text-lg text-antique-gold">
                              {formatPrice(product.price_dzd)} DA
                            </span>
                            {product.sale_price_dzd && (
                              <span className="block font-body text-xs text-warm-gray line-through">
                                {formatPrice(product.sale_price_dzd)} DZD
                              </span>
                            )}
                            {product.product_type === 'ensemble' && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                Économisez vs achat séparé
                              </div>
                            )}
                          </div>
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="flex gap-1">
                              {product.sizes.slice(0, 3).map((size) => (
                                <span
                                  key={size}
                                  className="text-xs px-2 py-1 bg-ivory-cream text-warm-gray rounded"
                                >
                                  {size}
                                </span>
                              ))}
                              {product.sizes.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                  +{product.sizes.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}