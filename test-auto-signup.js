import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zvyhuqkyeyzkjdvafdkx.supabase.co"
const supabaseAnonKey = "2d2f50cb113979bf1105082b1f0f17e81da91b9e377af799ce5d5b0679ca6fd8"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAutoSignup() {
  console.log('🧪 TEST D\'INSCRIPTION AUTOMATIQUE VIA RPC')

  // Générer un email unique pour le test
  const timestamp = Date.now()
  const testEmail = `test${timestamp}@example.com`
  const testPassword = 'Test123456'
  const testFullName = 'Test User'

  console.log(`📧 Test avec email: ${testEmail}`)

  try {
    // Test d'inscription via fonction RPC
    console.log('1️⃣ Test d\'inscription...')
    const { data: result, error: rpcError } = await supabase.rpc('auto_confirm_signup', {
      p_email: testEmail,
      p_password: testPassword,
      p_full_name: testFullName
    })

    if (rpcError) {
      console.error('❌ Erreur RPC:', rpcError.message)
      return
    }

    if (!result.success) {
      console.error('❌ Échec de l\'inscription:', result.error)
      return
    }

    console.log('✅ Inscription réussie:', result.message)
    console.log('👤 Utilisateur créé:', result.user)

    // Vérifier que l'utilisateur est confirmé en essayant de se connecter
    console.log('2️⃣ Test de connexion pour vérifier la confirmation...')

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

    if (signInError) {
      console.error('❌ Échec de la connexion:', signInError.message)
      if (signInError.message.includes('Email not confirmed')) {
        console.error('❌ Email pas confirmé automatiquement')
      }
      return
    }

    console.log('✅ Connexion réussie ! Email confirmé automatiquement')
    console.log('🎫 Session créée:', !!signInData.session)

    // Vérifier le profil
    console.log('3️⃣ Vérification du profil...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', result.user.id)
      .single()

    if (profileError) {
      console.error('❌ Erreur profil:', profileError.message)
    } else {
      console.log('✅ Profil trouvé:', profile)
    }

    // Test d'inscription avec le même email (devrait échouer)
    console.log('4️⃣ Test de doublon...')
    const { data: duplicateResult, error: duplicateError } = await supabase.rpc('auto_confirm_signup', {
      p_email: testEmail,
      p_password: 'AnotherPassword123',
      p_full_name: 'Another User'
    })

    if (duplicateError || (duplicateResult && !duplicateResult.success && duplicateResult.error.includes('déjà utilisé'))) {
      console.log('✅ Prévention du doublon fonctionne !')
    } else {
      console.error('❌ Le doublon n\'est pas empêché:', duplicateResult)
    }

    console.log('\n🎉 TESTS TERMINÉS !')

  } catch (error) {
    console.error('💥 Erreur inattendue:', error)
  }
}

testAutoSignup()
