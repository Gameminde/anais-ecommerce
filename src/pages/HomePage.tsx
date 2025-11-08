import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Package, Sparkles, Heart } from 'lucide-react'
import { supabase, Product, GiftBox } from '../lib/supabase'

export default function HomePage() {
  const { t } = useTranslation()
  const [featuredEnsembles, setFeaturedEnsembles] = useState<Product[]>([])
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    setLoading(true)
    try {
      // Fetch featured ensembles
      const { data: ensembles } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'ensemble')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(6)

      if (ensembles) setFeaturedEnsembles(ensembles)

      // Fetch gift boxes
      const { data: boxes } = await supabase
        .from('gift_boxes')
        .select('*')
        .eq('is_active', true)
        .limit(3)

      if (boxes) setGiftBoxes(boxes)
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-ivory-cream">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-hero text-charcoal mb-6 leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="font-body text-body-lg text-warm-gray mb-4 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <p className="font-body text-sm text-warm-gray/80 mb-8 italic">
                {t('home.hero.secondaryNote')}
              </p>
              <Link
                to="/shop?type=ensemble"
                className="inline-flex items-center space-x-2 bg-anais-taupe text-white font-body font-bold px-8 py-4 rounded-xl hover:bg-antique-gold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <span>{t('home.hero.cta')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="/anais_dress_collection_hero.png"
                alt="ANAIS Collection"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-ivory-cream hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-anais-taupe rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-charcoal mb-2">Paiement à la Livraison</h3>
              <p className="font-body text-sm text-warm-gray">
                Payez à la réception de votre commande. Sûr et pratique.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-ivory-cream hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-deep-plum rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-charcoal mb-2">Qualité Premium</h3>
              <p className="font-body text-sm text-warm-gray">
                Ensembles de luxe avec la texture côtelée signature ANAIS.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-ivory-cream hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-antique-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-xl text-charcoal mb-2">Livraison Nationale</h3>
              <p className="font-body text-sm text-warm-gray">
                Nous livrons dans toutes les villes d'Algérie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ensembles */}
      <section className="py-20 bg-ivory-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="font-body text-body-lg text-warm-gray max-w-2xl mx-auto">
              Découvrez notre collection soigneusement sélectionnée d'ensembles élégants
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="font-body text-warm-gray">{t('common.loading')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredEnsembles.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="aspect-[3/4] bg-warm-gray/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal/10" />
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 bg-anais-taupe/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-16 h-16 text-anais-taupe" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl text-charcoal mb-2 group-hover:text-anais-taupe transition-colors">
                        {product.name_en}
                      </h3>
                      <p className="font-body text-sm text-warm-gray mb-4 line-clamp-2">
                        {product.description_en}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-body font-bold text-lg text-antique-gold">
                          {formatPrice(product.price_dzd)} DZD
                        </span>
                        {product.sale_price_dzd && (
                          <span className="font-body text-sm text-warm-gray line-through">
                            {formatPrice(product.sale_price_dzd)} DZD
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/shop?type=ensemble"
                  className="inline-flex items-center space-x-2 bg-white text-anais-taupe font-body font-bold px-8 py-4 rounded-xl border-2 border-anais-taupe hover:bg-anais-taupe hover:text-white transition-all duration-300"
                >
                  <span>{t('home.featured.viewAll')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Gift Boxes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">
              {t('home.giftBoxes.title')}
            </h2>
            <p className="font-body text-body-lg text-warm-gray max-w-2xl mx-auto">
              {t('home.giftBoxes.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {giftBoxes.map((box) => (
              <Link
                key={box.id}
                to={`/gift-box/${box.id}`}
                className="group bg-ivory-cream rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-square bg-antique-gold/10 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-antique-gold" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-charcoal mb-2 group-hover:text-antique-gold transition-colors">
                    {box.name_en}
                  </h3>
                  <p className="font-body text-sm text-warm-gray mb-4 line-clamp-3">
                    {box.description_en}
                  </p>
                  <div className="font-body font-bold text-lg text-antique-gold">
                    {formatPrice(box.price_dzd)} DZD
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/gift-boxes"
              className="inline-flex items-center space-x-2 bg-antique-gold text-white font-body font-bold px-8 py-4 rounded-xl hover:bg-deep-plum transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <span>{t('home.giftBoxes.viewAll')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-gradient-to-br from-deep-plum to-charcoal text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-6">L'Histoire ANAIS</h2>
            <p className="font-body text-body-lg text-warm-gray mb-8 leading-relaxed">
              ANAIS allie élégance traditionnelle et design contemporain. Notre signature de texture côtelée
              et notre palette de couleurs sophistiquées créent des ensembles intemporels qui célèbrent la mode pudique avec un style inégalé.
              Chaque ensemble est confectionné avec soin en Algérie, honorant notre héritage tout en embrassant l'esthétique moderne.
              Découvrez également notre sélection de parfums et maquillage de créateur.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center space-x-2 bg-white text-deep-plum font-body font-bold px-8 py-4 rounded-xl hover:bg-antique-gold hover:text-white transition-all duration-300"
            >
              <span>En Savoir Plus</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
