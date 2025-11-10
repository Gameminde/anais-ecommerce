// Test rapide pour vérifier que les images ORB sont corrigées
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.6B9KC7Q5h4f9q3r9x8F7p2M5nL8jK9mN4pR6tV3wX1z'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testImageFix() {
  console.log('🧪 Test de correction ORB pour les images...\n')

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
      .limit(5)

    if (error) {
      console.error('❌ Erreur récupération:', error)
      return
    }

    console.log(`✅ ${products.length} produits trouvés avec images`)

    // Tester l'approche ORB-friendly (fetch + data URL)
    for (const product of products) {
      if (product.product_images && product.product_images.length > 0) {
        const imageUrl = product.product_images[0].image_url
        console.log(`\n📦 ${product.name_en}`)
        console.log(`   URL: ${imageUrl}`)

        try {
          // Simuler ce que fait ORBFriendlyImage
          const response = await fetch(imageUrl, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit'
          })

          if (response.ok) {
            const blob = await response.blob()
            console.log(`   ✅ Fetch réussi: ${blob.size} bytes`)

            // Convertir en data URL (comme le fait le composant)
            const dataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result)
              reader.onerror = reject
              reader.readAsDataURL(blob)
            })

            console.log(`   ✅ Conversion data URL réussie`)
            console.log(`   📄 Data URL length: ${dataUrl.length} chars`)

          } else {
            console.log(`   ❌ Fetch échoué: ${response.status}`)
          }
        } catch (err) {
          console.log(`   ❌ Erreur: ${err.message}`)
        }
      }
    }

    console.log('\n🎉 Test terminé!')
    console.log('Si les fetches réussissent, les images devraient maintenant s\'afficher dans le navigateur.')

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

testImageFix()
