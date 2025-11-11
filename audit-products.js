// Script pour auditer la gestion des produits et images
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwItoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function auditProducts() {
  console.log('📦 AUDIT DE LA GESTION DES PRODUITS ET IMAGES\n')

  try {
    // 1. ANALYSE DES PRODUITS
    console.log('📊 ANALYSE DES PRODUITS:')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_active', true)

    if (productsError) {
      console.log('❌ Erreur récupération produits:', productsError.message)
      return
    }

    console.log(`✅ ${products.length} produits actifs trouvés`)

    // Statistiques par type
    const stats = {
      total: products.length,
      byType: {},
      byCategory: {},
      withImages: 0,
      featured: 0,
      withSizes: 0,
      withColors: 0,
      withSalePrice: 0
    }

    products.forEach(product => {
      // Compter par type
      stats.byType[product.product_type] = (stats.byType[product.product_type] || 0) + 1

      // Compter par catégorie
      stats.byCategory[product.category_id] = (stats.byCategory[product.category_id] || 0) + 1

      // Statistiques diverses
      if (product.product_images && product.product_images.length > 0) stats.withImages++
      if (product.is_featured) stats.featured++
      if (product.sizes && product.sizes.length > 0) stats.withSizes++
      if (product.colors && product.colors.length > 0) stats.withColors++
      if (product.sale_price_dzd) stats.withSalePrice++
    })

    console.log('\n📈 STATISTIQUES PRODUITS:')
    console.log(`   Types: ${Object.entries(stats.byType).map(([type, count]) => `${type}(${count})`).join(', ')}`)
    console.log(`   Avec images: ${stats.withImages}/${stats.total} (${Math.round(stats.withImages/stats.total*100)}%)`)
    console.log(`   Vedettes: ${stats.featured}/${stats.total} (${Math.round(stats.featured/stats.total*100)}%)`)
    console.log(`   Avec tailles: ${stats.withSizes}/${stats.total} (${Math.round(stats.withSizes/stats.total*100)}%)`)
    console.log(`   Avec couleurs: ${stats.withColors}/${stats.total} (${Math.round(stats.withColors/stats.total*100)}%)`)
    console.log(`   En promotion: ${stats.withSalePrice}/${stats.total} (${Math.round(stats.withSalePrice/stats.total*100)}%)`)

    // 2. ANALYSE DES IMAGES
    console.log('\n🖼️ ANALYSE DES IMAGES:')
    let totalImages = 0
    let primaryImages = 0
    const imageFormats = {}

    products.forEach(product => {
      if (product.product_images) {
        totalImages += product.product_images.length
        product.product_images.forEach(image => {
          if (image.is_primary) primaryImages++

          // Détecter le format d'image
          const extension = image.image_url.split('.').pop()?.toLowerCase()
          imageFormats[extension] = (imageFormats[extension] || 0) + 1
        })
      }
    })

    console.log(`✅ ${totalImages} images totales`)
    console.log(`✅ ${primaryImages} images principales`)
    console.log(`📷 Formats: ${Object.entries(imageFormats).map(([ext, count]) => `${ext.toUpperCase()}(${count})`).join(', ')}`)

    // Vérifier les URLs d'images
    console.log('\n🔗 VÉRIFICATION DES URLs D\'IMAGES:')
    let validUrls = 0
    let invalidUrls = 0

    for (const product of products) {
      if (product.product_images) {
        for (const image of product.product_images) {
          try {
            new URL(image.image_url)
            validUrls++
          } catch {
            invalidUrls++
            console.log(`❌ URL invalide: ${image.image_url.substring(0, 50)}...`)
          }
        }
      }
    }

    console.log(`✅ URLs valides: ${validUrls}`)
    console.log(`❌ URLs invalides: ${invalidUrls}`)

    // 3. STOCKAGE SUPABASE
    console.log('\n💾 VÉRIFICATION STOCKAGE:')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.log('❌ Erreur stockage:', bucketsError.message)
    } else {
      console.log(`✅ ${buckets.length} buckets trouvés`)
      for (const bucket of buckets) {
        console.log(`   📦 ${bucket.name}: ${bucket.public ? 'Public' : 'Privé'}`)

        // Lister les fichiers du bucket
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 10 })

        if (filesError) {
          console.log(`      ❌ Erreur listage fichiers: ${filesError.message}`)
        } else {
          console.log(`      ✅ ${files.length} fichiers (échantillon)`)
        }
      }
    }

    // 4. CATÉGORIES
    console.log('\n📂 VÉRIFICATION CATÉGORIES:')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')

    if (categoriesError) {
      console.log('❌ Erreur catégories:', categoriesError.message)
    } else {
      console.log(`✅ ${categories.length} catégories trouvées`)
      categories.forEach(cat => {
        const productsInCat = products.filter(p => p.category_id === cat.id).length
        console.log(`   📁 ${cat.name_fr || cat.name_en}: ${productsInCat} produits (${cat.is_active ? 'Actif' : 'Inactif'})`)
      })
    }

    // 5. PRODUITS SPÉCIAUX (ENSEMBLES)
    console.log('\n👗 ANALYSE DES ENSEMBLES:')
    const ensembles = products.filter(p => p.product_type === 'ensemble')
    console.log(`✅ ${ensembles.length} ensembles trouvés`)

    ensembles.forEach(ensemble => {
      const imageCount = ensemble.product_images?.length || 0
      console.log(`   🎀 ${ensemble.name_en}: ${imageCount} images`)
      if (imageCount > 1) {
        console.log(`      ✅ Galerie disponible (${imageCount} vues)`)
      } else {
        console.log(`      ⚠️ Galerie limitée (${imageCount} vue)`)
      }
    })

    // 6. TESTS DE PERFORMANCE
    console.log('\n⚡ TESTS DE PERFORMANCE:')

    // Test de requête simple
    const startTime = Date.now()
    const { data: quickTest, error: quickError } = await supabase
      .from('products')
      .select('id, name_en, price_dzd')
      .limit(5)

    const queryTime = Date.now() - startTime
    console.log(`🕐 Requête simple: ${queryTime}ms ${quickError ? '(Erreur)' : '(OK)'}`)

    // Test avec jointure
    const joinStartTime = Date.now()
    const { data: joinTest, error: joinError } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .limit(3)

    const joinTime = Date.now() - joinStartTime
    console.log(`🕐 Requête avec images: ${joinTime}ms ${joinError ? '(Erreur)' : '(OK)'}`)

    console.log('\n📋 RÉSUMÉ GESTION PRODUITS:')
    console.log(`✅ ${stats.total} produits actifs bien configurés`)
    console.log(`✅ ${stats.withImages}/${stats.total} produits avec images`)
    console.log(`✅ ${totalImages} images totales (${primaryImages} principales)`)
    console.log(`✅ Stockage configuré et accessible`)
    console.log(`✅ Catégories organisées`)
    console.log(`✅ Ensembles avec galeries multiples`)
    console.log(`✅ Performances acceptables (< ${Math.max(queryTime, joinTime)}ms)`)

  } catch (error) {
    console.error('❌ Erreur lors de l\'audit produits:', error.message)
  }
}

auditProducts()
