// Script pour configurer CORS sur le bucket Supabase Storage
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixCORS() {
  console.log('🔧 Configuration CORS pour le bucket products...\n')

  try {
    // Méthode 1: Via l'API Supabase Storage
    console.log('1. Tentative via API Storage...')

    const corsConfig = {
      cors_origins: ['*'],
      cors_methods: ['GET', 'HEAD', 'OPTIONS'],
      cors_headers: ['*'],
      cors_max_age: 86400
    }

    // Cette approche peut ne pas fonctionner si l'API ne supporte pas la configuration CORS
    // Essayons plutôt une approche différente

    console.log('2. Vérification des permissions bucket...')

    // Vérifier que le bucket est public
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error('❌ Erreur list buckets:', bucketsError)
      return
    }

    const productsBucket = buckets.find(b => b.name === 'products')
    if (productsBucket) {
      console.log(`✅ Bucket 'products' trouvé:`, {
        name: productsBucket.name,
        public: productsBucket.public,
        created_at: productsBucket.created_at
      })
    }

    // Méthode alternative: Créer un proxy pour les images
    console.log('\n3. Solution alternative: Création d\'un proxy d\'images...')

    // Pour contourner ORB, on peut utiliser une approche où on charge les images via un service worker
    // ou on les convertit en data URLs, mais cela n'est pas pratique.

    // Solution recommandée: Configurer CORS via l'interface Supabase
    console.log('\n📋 INSTRUCTIONS MANUELLES:')
    console.log('1. Allez sur https://supabase.com/dashboard/project/zvyhuqkyeyzkjdvafdkx/storage')
    console.log('2. Cliquez sur le bucket "products"')
    console.log('3. Allez dans l\'onglet "CORS"')
    console.log('4. Ajoutez la configuration suivante:')
    console.log('   - Origins: *')
    console.log('   - Methods: GET, HEAD, OPTIONS')
    console.log('   - Headers: *')
    console.log('   - Max Age: 86400')

    console.log('\n🔄 Après avoir configuré CORS, testez à nouveau les images.')

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

fixCORS()
