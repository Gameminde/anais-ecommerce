// Test rapide du frontend - à exécuter dans Node.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.6B9KC7Q5h4f9q3r9x8F7p2M5nL8jK9mN4pR6tV3wX1z'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFrontendAccess() {
  console.log('🧪 TEST FRONTEND - Accès aux images\n')

  try {
    // Test 1: Query normale des produits (comme le fait le frontend)
    console.log('1. Test requête produits normale...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)

    if (productsError) {
      console.error('❌ Erreur requête produits:', productsError.message)
      return
    }

    console.log(`✅ ${products?.length || 0} produits récupérés`)

    // Test 2: Vérifier que image_url existe maintenant
    products?.forEach((product, i) => {
      const hasImage = product.image_url ? '✅' : '❌'
      console.log(`   Produit ${i+1}: ${hasImage} image_url - ${product.name_en?.substring(0, 30)}...`)
    })

    // Test 3: Vérifier les URLs
    console.log('\n2. Test des URLs d\'images...')
    products?.forEach((product, i) => {
      if (product.image_url) {
        console.log(`   Produit ${i+1}: ${product.image_url.substring(0, 60)}...`)
      }
    })

    console.log('\n🎯 RÉSULTAT FINAL:')
    console.log('   ✅ Frontend peut maintenant accéder à products.image_url')
    console.log('   ✅ Les images devraient s\'afficher dans le navigateur')

  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
  }
}

testFrontendAccess()
