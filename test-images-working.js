// Test rapide pour vérifier si les images se chargent maintenant
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.6B9KC7Q5h4f9q3r9x8F7p2M5nL8jK9mN4pR6tV3wX1z'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testImages() {
  console.log('🧪 Test du chargement des images après correction ORB...\n')

  try {
    // Récupérer les produits avec images
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name_en,
        product_images (
          id,
          image_url,
          is_primary
        )
      `)
      .limit(3)

    if (error) {
      console.error('❌ Erreur récupération:', error)
      return
    }

    console.log(`✅ ${products.length} produits trouvés`)

    // Tester chaque image
    for (const product of products) {
      if (product.product_images && product.product_images.length > 0) {
        console.log(`\n📦 ${product.name_en}:`)

        for (const img of product.product_images) {
          console.log(`   🔗 URL: ${img.image_url}`)

          try {
            // Tester si l'URL est accessible
            const response = await fetch(img.image_url, {
              method: 'HEAD',
              mode: 'cors'
            })

            if (response.ok) {
              console.log(`   ✅ Accessible (${response.status})`)
            } else {
              console.log(`   ❌ Non accessible (${response.status})`)
            }
          } catch (err) {
            console.log(`   ❌ Erreur réseau: ${err.message}`)
          }
        }
      }
    }

    console.log('\n🎉 Test terminé! Les images devraient maintenant s\'afficher dans le navigateur.')

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

testImages()
