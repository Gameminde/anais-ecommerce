import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zvyhuqkyeyzkjdvafdkx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDuplicateSignup() {
  console.log('🧪 TEST: Prévention des inscriptions multiples')
  console.log('='.repeat(50))

  try {
    // Test 1: Tentative d'inscription avec un email qui existe déjà
    console.log('\n1️⃣ Test avec email existant (test@anais.com - devrait échouer)...')
    const { data: existingEmailSignup, error: existingError } = await supabase.auth.signUp({
      email: 'test@anais.com',
      password: 'DifferentPassword123!',
      options: {
        data: { full_name: 'Test Duplicate' }
      }
    })

    if (existingError) {
      console.log(`✅ Tentative avec email existant correctement rejetée`)
      console.log(`📝 Message d'erreur: ${existingError.message}`)

      // Vérifier si le message contient les termes attendus pour les doublons
      const isDuplicateError = existingError.message.includes('User already registered') ||
                              existingError.message.includes('already been registered') ||
                              existingError.message.includes('already exists') ||
                              existingError.message.includes('email address is already registered')

      if (isDuplicateError) {
        console.log('✅ Message d\'erreur approprié pour email dupliqué')
      } else {
        console.log('ℹ️ Autre type d\'erreur:', existingError.message)
      }
    } else {
      console.log(`❌ ERREUR: Inscription avec email existant a réussi - ce n'est pas normal!`)
      console.log('⚠️ Cela indique un problème de sécurité')
    }

    // Test 2: Test avec l'email admin
    console.log('\n2️⃣ Test avec email admin (admin@anais.com - devrait échouer)...')
    const { data: adminEmailSignup, error: adminError } = await supabase.auth.signUp({
      email: 'admin@anais.com',
      password: 'AnotherPassword123!',
      options: {
        data: { full_name: 'Fake Admin' }
      }
    })

    if (adminError) {
      console.log(`✅ Tentative avec email admin correctement rejetée`)
      console.log(`📝 Message d'erreur: ${adminError.message}`)
    } else {
      console.log(`❌ ERREUR: Inscription avec email admin a réussi!`)
      console.log('🚨 Cela constitue un risque de sécurité élevé!')
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  }

  console.log('\n🏁 Test terminé')
}

// Fonction pour tester via l'API admin (nécessite clé service role)
async function testAdminCheck() {
  console.log('\n🔧 Test via API admin (pour référence)...')

  const supabaseAdmin = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI")

  try {
    // Lister les utilisateurs (pour vérification)
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.log(`❌ Impossible d'accéder à la liste des utilisateurs: ${error.message}`)
    } else {
      const testUsers = users.users.filter(u => u.email?.includes('test@anais.com') || u.email?.includes('duplicate-test'))
      console.log(`📊 Utilisateurs de test trouvés: ${testUsers.length}`)
      testUsers.forEach(user => console.log(`  - ${user.email} (${user.id})`))
    }
  } catch (err) {
    console.log(`❌ Erreur admin: ${err.message}`)
  }
}

// Exécuter les tests
async function runTests() {
  await testDuplicateSignup()
  await testAdminCheck()
}

runTests().catch(console.error)
