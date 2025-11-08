import { useEffect, useState } from 'react'
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

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [selectedCategory, selectedType])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
    if (data) setCategories(data)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      if (selectedType) {
        query = query.eq('product_type', selectedType)
      }

      const { data } = await query.order('created_at', { ascending: false })
      if (data) setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-DZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-ivory-cream">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
            {selectedType === 'ensemble' ? 'Ensembles' : 'Boutique'}
          </h1>
          <p className="font-body text-body-lg text-warm-gray">
            Découvrez notre collection de mode élégante et pudique
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-anais-taupe" />
                <h2 className="font-display text-xl text-charcoal">Filtres</h2>
              </div>

              {/* Categories */}
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
                    className={`w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                      !selectedCategory && !selectedType
                        ? 'bg-anais-taupe text-white'
                        : 'text-warm-gray hover:bg-ivory-cream'
                    }`}
                  >
                    Tous les Produits
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setSelectedType('')
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors ${
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

              {/* Product Types */}
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

          {/* Products Grid */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="aspect-[3/4] bg-warm-gray/10 relative overflow-hidden">
                      {product.is_featured && (
                        <div className="absolute top-4 right-4 bg-antique-gold text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                          Vedette
                        </div>
                      )}
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 bg-anais-taupe/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-anais-taupe" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg text-charcoal mb-2 group-hover:text-anais-taupe transition-colors line-clamp-1">
                        {product.name_en}
                      </h3>
                      <p className="font-body text-sm text-warm-gray mb-3 line-clamp-2">
                        {product.description_en}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-body font-bold text-lg text-antique-gold">
                            {formatPrice(product.price_dzd)} DZD
                          </span>
                          {product.sale_price_dzd && (
                            <span className="block font-body text-xs text-warm-gray line-through">
                              {formatPrice(product.sale_price_dzd)} DZD
                            </span>
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
                          </div>
                        )}
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
