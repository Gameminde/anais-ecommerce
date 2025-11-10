import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zvyhuqkyeyzkjdvafdkx.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI"

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUser() {
  try {
    console.log('🔐 Création d\'un utilisateur de test...')

    // Créer l'utilisateur
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@anais.com',
      password: 'Test123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Utilisateur Test ANAIS'
      }
    })

    if (error) {
      console.error('❌ Erreur lors de la création:', error)
      return
    }

    console.log('✅ Utilisateur créé avec succès!')
    console.log('📧 Email: test@anais.com')
    console.log('🔑 Mot de passe: Test123!')
    console.log('🆔 ID:', data.user.id)

    // Créer le profil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: data.user.id,
        full_name: 'Utilisateur Test ANAIS',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (profileError) {
      console.warn('⚠️ Erreur lors de la création du profil:', profileError)
    } else {
      console.log('✅ Profil créé avec succès!')
    }

  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

createTestUser()
