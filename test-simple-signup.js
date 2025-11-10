import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zvyhuqkyeyzkjdvafdkx.supabase.co"
const supabaseAnonKey = "2d2f50cb113979bf1105082b1f0f17e81da91b9e377af799ce5d5b0679ca6fd8"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSimpleSignup() {
  console.log('🧪 TEST SIMPLE D\'INSCRIPTION')

  // Générer un email unique pour le test
  const timestamp = Date.now()
  const testEmail = `test${timestamp}@example.com`
  const testPassword = 'Test123456'
  const testFullName = 'Test User'

  console.log(`📧 Test avec email: ${testEmail}`)

  try {
    // Test d'inscription simple
    console.log('1️⃣ Test d\'inscription...')
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { full_name: testFullName }
      }
    })

    if (error) {
      console.error('❌ Erreur lors de l\'inscription:', error.message)
      return
    }

    console.log('✅ Inscription réussie:', data.user?.email)

    // Attendre un peu pour que l'utilisateur soit créé
    console.log('⏳ Attente de 2 secondes...')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test de connexion
    console.log('2️⃣ Test de connexion...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

    if (signInError) {
      console.error('❌ Échec de la connexion:', signInError.message)

      // Si c'est un problème de confirmation, essayer de confirmer manuellement
      if (signInError.message.includes('Email not confirmed') && data.user) {
        console.log('3️⃣ Tentative de confirmation manuelle...')

        try {
          const confirmResponse = await fetch(
            `${supabaseUrl}/auth/v1/admin/users/${data.user.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI',
              },
              body: JSON.stringify({
                email_confirm: true
              }),
            }
          )

          if (confirmResponse.ok) {
            console.log('✅ Confirmation manuelle réussie')

            // Retester la connexion
            console.log('4️⃣ Retest de connexion...')
            const { data: retrySignInData, error: retrySignInError } = await supabase.auth.signInWithPassword({
              email: testEmail,
              password: testPassword,
            })

            if (retrySignInError) {
              console.error('❌ Échec de la reconnexion:', retrySignInError.message)
            } else {
              console.log('✅ Connexion réussie après confirmation !')
            }
          } else {
            console.error('❌ Échec de la confirmation manuelle')
          }
        } catch (confirmError) {
          console.error('❌ Erreur lors de la confirmation:', confirmError.message)
        }
      }

      return
    }

    console.log('✅ Connexion réussie immédiatement !')
    console.log('🎫 Session créée:', !!signInData.session)

    console.log('\n🎉 TEST TERMINÉ AVEC SUCCÈS !')

  } catch (error) {
    console.error('💥 Erreur inattendue:', error)
  }
}

testSimpleSignup()
