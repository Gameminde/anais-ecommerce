import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Package, Sparkles, Heart, Star, ShoppingBag } from 'lucide-react'
import { supabase, Product, GiftBox } from '../lib/supabase'
import { motion } from 'framer-motion'
import ScrollAnimationWrapper, { MagazinePage } from '../components/ScrollAnimationWrapper'
import SplitText from '../components/SplitText'
import { OptimizedImage } from '../components/ui/OptimizedImage'

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
      console.log('🔍 HomePage: Fetching featured products...')

      // Fetch featured ensembles (without images to avoid PostgREST join issues)
      const { data: ensembles, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'ensemble')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(6)

      if (productsError) {
        console.error('Error fetching products:', productsError)
        setLoading(false)
        return
      }

      if (ensembles && ensembles.length > 0) {
        // Fetch images separately for each product
        const productIds = ensembles.map(p => p.id)
        const { data: images, error: imagesError } = await supabase
          .from('product_images')
          .select('*')
          .in('product_id', productIds)
          .order('display_order')

        // Combine products with their images
        const productsWithImages = ensembles.map(product => ({
          ...product,
          product_images: images?.filter(img => img.product_id === product.id) || []
        }))

        setFeaturedEnsembles(productsWithImages)
        console.log('✅ HomePage: Loaded', productsWithImages.length, 'featured products with images')
      } else {
        setFeaturedEnsembles([])
      }

      // Fetch gift boxes
      const { data: boxes, error: boxesError } = await supabase
        .from('gift_boxes')
        .select('*')
        .eq('is_active', true)
        .limit(3)

      if (boxesError) {
        console.error('Error fetching gift boxes:', boxesError)
      } else if (boxes) {
        setGiftBoxes(boxes)
      }
    } catch (error) {
      console.error('Exception in fetchFeaturedProducts:', error)
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
      {/* Hero Section - Full Page Gemini Image */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Full Page Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/Gemini_Generated_Image_5a9xp45a9xp45a9x.png"
            alt="ANAIS Fashion Collection"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <SplitText
              text="ANAIS"
              className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] mb-2 sm:mb-4 tracking-wider drop-shadow-lg"
              direction="right"
              delay={0.5}
              duration={1.2}
              staggerChildren={0.08}
              type="chars"
            />

            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light drop-shadow-lg max-w-xs sm:max-w-sm md:max-w-none">
              Up to 50% off this Season
            </div>
          </div>

              <Link
            to="/shop"
            className="inline-block bg-anais-taupe text-white font-body font-bold px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-lg hover:bg-antique-gold transition-all duration-300 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
            Discover Now
              </Link>
            </div>
      </section>

      {/* Our Bestseller Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <SplitText
            text="Our Bestseller"
            className="font-display text-2xl sm:text-3xl md:text-4xl text-center text-charcoal mb-8 sm:mb-12"
            direction="up"
            delay={0.3}
            type="words"
          />

          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <p className="font-body text-warm-gray">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featuredEnsembles.slice(0, 4).map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block"
                >
                    <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                      {product.product_images && product.product_images.length > 0 ? (
                        <OptimizedImage
                          src={product.product_images.find(img => img.is_primary)?.image_url || product.product_images[0].image_url}
                          alt={product.name_en}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-anais-taupe/10 to-anais-gold/10">
                          <div className="text-center">
                            <Sparkles className="w-16 h-16 text-anais-taupe mx-auto mb-2" />
                            <div className="text-xs text-anais-taupe font-medium">ANAIS</div>
                            <div className="text-xs text-gray-500">{product.name_en}</div>
                          </div>
                        </div>
                      )}
                      {/* Color tags - Exact Wonder Theme style */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          index % 4 === 0 ? 'bg-black text-white' :
                          index % 4 === 1 ? 'bg-blue-600 text-white' :
                          index % 4 === 2 ? 'bg-red-500 text-white' :
                          'bg-pink-500 text-white'
                        }`}>
                          {index % 4 === 0 ? '#black' :
                           index % 4 === 1 ? '#navy' :
                           index % 4 === 2 ? '#red' :
                           '#pink'}
                        </span>
                      </div>
                      {/* New badge for last item */}
                      {index === 3 && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                            New
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="text-center">
                        <h3 className="font-display text-base sm:text-lg text-charcoal mb-2">
                          {product.name_en}
                        </h3>
                        <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          Regular price ${product.price_dzd}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-charcoal">
                          ${product.price_dzd}
            </div>
                      </div>
                    </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collection Banners - Mobile Optimized */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* MOE Collection */}
            <Link to="/shop" className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-anais-taupe to-deep-plum text-white p-6 sm:p-8 min-h-[120px] sm:min-h-[140px] flex items-center">
              <div className="relative z-10 w-full">
                <h3 className="font-display text-xl sm:text-2xl mb-2">MOE collection</h3>
                <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">Shop the Collection</p>
                <div className="flex items-center text-white font-medium">
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/10"></div>
            </Link>

            {/* New Bags */}
            <Link to="/shop" className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-antique-gold to-anais-taupe text-white p-6 sm:p-8 min-h-[120px] sm:min-h-[140px] flex items-center">
              <div className="relative z-10 w-full">
                <h3 className="font-display text-xl sm:text-2xl mb-2">new bags</h3>
                <p className="text-white/90 mb-3 sm:mb-4 text-sm sm:text-base">Shop New Arrivals</p>
                <div className="flex items-center text-white font-medium">
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/10"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Dynamiques - Basé sur les produits en base */}
      {featuredEnsembles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <SplitText
              text="nos collections"
              className="font-display text-3xl text-center text-charcoal mb-12"
              direction="up"
              delay={0.3}
              type="words"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Collection 1 - Produits récents */}
              <Link to="/shop" className="group text-center">
                <div className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-lg mb-1">Nouveautés</h3>
                    <p className="text-xs opacity-90">{featuredEnsembles.length} produits</p>
                  </div>
                </div>
              </Link>

              {/* Collection 2 - Meilleures ventes (simulé) */}
              <Link to="/shop" className="group text-center">
                <div className="aspect-square bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-lg mb-1">Best Sellers</h3>
                    <p className="text-xs opacity-90">Populaires</p>
                  </div>
                </div>
              </Link>

              {/* Collection 3 - Promotions (si applicable) */}
              <Link to="/shop" className="group text-center">
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-200 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-lg mb-1">Promotions</h3>
                    <p className="text-xs opacity-90">Économisez</p>
                  </div>
                </div>
              </Link>

              {/* Collection 4 - Tous les produits */}
              <Link to="/shop" className="group text-center">
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display text-lg mb-1">Collection Complète</h3>
                    <p className="text-xs opacity-90">Voir tout</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Product Showcase - Dynamic from Database */}
      {featuredEnsembles.length >= 4 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {featuredEnsembles.slice(0, 4).map((product, index) => (
            <div key={product.id} className="text-center">
              <div className="text-xs text-gray-500 mb-2">
                #{product.product_images && product.product_images.length > 0 ?
                  product.product_images.find(img => img.is_primary)?.id?.substring(0, 8) || 'primary' :
                  'no-image'}
              </div>
              <h4 className="font-display text-sm text-charcoal mb-1">
                {product.name_en}
              </h4>
              <div className="text-sm text-gray-600">
                Prix: {formatPrice(product.price_dzd)} DZD
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gift Boxes Section - Dynamic from Database */}
      {giftBoxes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SplitText
                text="coffrets cadeaux"
                className="font-display text-3xl text-charcoal mb-4"
                direction="left"
                delay={0.3}
                type="words"
              />
              <SplitText
                text="idées cadeaux élégantes"
                className="font-display text-2xl text-charcoal"
                direction="right"
                delay={0.8}
                type="words"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {giftBoxes.map((box, index) => (
                <Link
                  key={box.id}
                  to="/shop"
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] bg-gradient-to-br from-rose-100 to-pink-200 rounded-lg overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="font-display text-xl mb-2">{box.name_en}</h3>
                      <p className="text-sm text-white/90 mb-4">
                        {box.description_en || 'Coffret cadeau élégant'}
                      </p>
                      <div className="flex items-center text-white font-medium hover:underline">
                        Voir les coffrets <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SALE Banner */}
      <section className="py-12 bg-anais-taupe text-white">
        <div className="container mx-auto px-4 text-center">
          <SplitText
            text="Discover the best deal"
            className="font-display text-3xl mb-4"
            direction="up"
            delay={0.3}
            type="words"
          />

          <SplitText
            text="SALE up to 50% for all collections"
            className="font-display text-2xl mb-6"
            direction="down"
            delay={0.8}
            type="words"
          />

          <Link
            to="/shop"
            className="inline-block bg-white text-anais-taupe font-body font-bold px-8 py-4 rounded-lg hover:bg-antique-gold hover:text-white transition-all duration-300"
          >
            Check Now
          </Link>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <SplitText
              text="prêt à découvrir notre collection ?"
              className="font-display text-3xl text-charcoal mb-6"
              direction="up"
              delay={0.3}
              type="words"
            />
            <p className="text-gray-600 mb-8 text-lg">
              Explorez nos ensembles modernes et élégants, parfaits pour toutes les occasions.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 bg-anais-taupe text-white font-body font-bold rounded-lg hover:bg-antique-gold transition-all duration-300 text-lg"
            >
              <span>Découvrir la Collection</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* TikTok Inspiration */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SplitText
              text="Tik Tok"
              className="font-display text-3xl text-charcoal mb-12"
              direction="left"
              delay={0.3}
              type="words"
            />
            <SplitText
              text="Inspiration"
              className="font-display text-2xl text-charcoal mb-8"
              direction="right"
              delay={0.8}
              type="words"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Inspiration items - Dynamic from Database */}
          {featuredEnsembles.length > 0 ? (
            featuredEnsembles.slice(0, 6).map((product, index) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md group cursor-pointer">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.product_images && product.product_images.length > 0 ? (
                      <OptimizedImage
                        src={product.product_images.find(img => img.is_primary)?.image_url ||
                             product.product_images[0].image_url}
                        alt={product.name_en}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-anais-taupe/10 to-anais-gold/10">
                        <Sparkles className="w-12 h-12 text-anais-taupe" />
                      </div>
                    )}

                    {/* Color tag */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        index % 4 === 0 ? 'bg-black text-white' :
                        index % 4 === 1 ? 'bg-blue-600 text-white' :
                        index % 4 === 2 ? 'bg-red-500 text-white' :
                        'bg-pink-500 text-white'
                      }`}>
                        #{index % 4 === 0 ? 'black' :
                           index % 4 === 1 ? 'navy' :
                           index % 4 === 2 ? 'red' :
                           'pink'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-display text-sm text-charcoal mb-2 line-clamp-2">
                      {product.name_en}
                    </h4>
                    <div className="text-sm text-gray-600">
                      Prix: {formatPrice(product.price_dzd)} DZD
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            /* Fallback loading state */
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 text-center">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </section>


      {/* Brand Quote Section */}
      <section className="py-16 bg-gradient-to-r from-anais-taupe to-deep-plum text-white">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="font-body text-lg max-w-3xl mx-auto mb-8">
            <SplitText
              text="A brand that challenges the industry. A brand that has a chance to stage a revolution. A brand whose creators see it as a step towards a better world"
              className="font-body text-lg max-w-3xl mx-auto mb-8"
              direction="up"
              delay={0.3}
              staggerChildren={0.02}
              type="words"
            />
          </blockquote>

          <p className="text-white/90 mb-8">
            "Get ready to slay in style with our Fashion store - the ultimate destination for all things fabulous!"
          </p>
          <Link
            to="/about"
            className="inline-flex items-center space-x-2 bg-white text-anais-taupe font-body font-bold px-8 py-4 rounded-lg hover:bg-antique-gold hover:text-white transition-all duration-300"
          >
            <span>Join us</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <SplitText
              text="restez informé"
              className="font-display text-2xl text-charcoal mb-4"
              direction="up"
              delay={0.3}
              type="words"
            />
            <p className="text-gray-600 mb-8">
              Recevez nos dernières nouveautés et offres spéciales
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anais-taupe"
              />
              <button className="px-6 py-2 bg-anais-taupe text-white rounded-lg hover:bg-antique-gold transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
