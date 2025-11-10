// Script de test pour vérifier le chargement des images
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.6B9KC7Q5h4f9q3r9x8F7p2M5nL8jK9mN4pR6tV3wX1z'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testImageLoading() {
  console.log('🧪 Test du chargement des images...\n')

  try {
    // 1. Tester la récupération des produits avec images
    console.log('1. Récupération des produits avec images...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name_en,
        name_fr,
        product_images (
          id,
          image_url,
          is_primary,
          display_order
        )
      `)
      .limit(5)

    if (productsError) {
      console.error('❌ Erreur récupération produits:', productsError)
      return
    }

    console.log(`✅ ${products.length} produits récupérés`)

    // 2. Afficher les détails des images
    products.forEach(product => {
      console.log(`\n📦 Produit: ${product.name_en}`)
      if (product.product_images && product.product_images.length > 0) {
        product.product_images.forEach(img => {
          console.log(`   🖼️  Image: ${img.is_primary ? 'PRINCIPALE' : 'Secondaire'}`)
          console.log(`      URL: ${img.image_url}`)
          console.log(`      ID: ${img.id}`)
        })
      } else {
        console.log('   ❌ Aucune image trouvée')
      }
    })

    // 3. Tester l'accès direct à une image
    if (products.length > 0 && products[0].product_images && products[0].product_images.length > 0) {
      const testUrl = products[0].product_images[0].image_url
      console.log(`\n3. Test d'accès direct à l'image:`)
      console.log(`   URL: ${testUrl}`)

      try {
        const response = await fetch(testUrl, { method: 'HEAD' })
        console.log(`   Status: ${response.status}`)
        if (response.ok) {
          console.log('   ✅ Image accessible')
        } else {
          console.log('   ❌ Image non accessible')
        }
      } catch (error) {
        console.log('   ❌ Erreur réseau:', error.message)
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

testImageLoading()
