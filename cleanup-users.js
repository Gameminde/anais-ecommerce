import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zvyhuqkyeyzkjdvafdkx.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI"

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function cleanupUsers() {
  console.log('🧹 NETTOYAGE DES COMPTES UTILISATEUR')
  console.log('='.repeat(50))

  try {
    // Lister tous les utilisateurs
    console.log('\n📋 Liste des utilisateurs existants:')
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', listError)
      return
    }

    console.log(`📊 ${users.users.length} utilisateur(s) trouvé(s)`)

    // Identifier l'admin et les utilisateurs à supprimer
    const adminUser = users.users.find(u => u.email === 'admin@anais.com')
    const usersToDelete = users.users.filter(u => u.email !== 'admin@anais.com')

    console.log(`\n👑 Admin conservé: ${adminUser ? adminUser.email : 'AUCUN ADMIN TROUVÉ'}`)
    console.log(`\n🗑️ Utilisateurs à supprimer: ${usersToDelete.length}`)
    usersToDelete.forEach(user => {
      console.log(`  - ${user.email} (${user.id})`)
    })

    // Supprimer les utilisateurs non-admin
    if (usersToDelete.length > 0) {
      console.log('\n🗑️ Suppression des utilisateurs...')

      for (const user of usersToDelete) {
        try {
          console.log(`Suppression de ${user.email}...`)
          const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

          if (deleteError) {
            console.error(`❌ Erreur suppression ${user.email}:`, deleteError.message)
          } else {
            console.log(`✅ ${user.email} supprimé`)
          }
        } catch (err) {
          console.error(`❌ Exception suppression ${user.email}:`, err.message)
        }
      }
    }

    // Nettoyer les profils orphelins
    console.log('\n🧽 Nettoyage des profils orphelins...')
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')

    if (profileError) {
      console.error('❌ Erreur récupération profils:', profileError)
    } else {
      console.log(`📊 ${profiles.length} profil(s) trouvé(s)`)

      // Récupérer la liste des utilisateurs restants
      const { data: remainingUsers, error: remainingError } = await supabaseAdmin.auth.admin.listUsers()

      if (remainingError) {
        console.error('❌ Erreur vérification utilisateurs restants:', remainingError)
      } else {
        const remainingUserIds = remainingUsers.users.map(u => u.id)

        // Identifier les profils à supprimer
        const profilesToDelete = profiles.filter(p => !remainingUserIds.includes(p.id))

        if (profilesToDelete.length > 0) {
          console.log(`🗑️ Suppression de ${profilesToDelete.length} profil(s) orphelin(s)...`)

          for (const profile of profilesToDelete) {
            const { error: deleteProfileError } = await supabaseAdmin
              .from('profiles')
              .delete()
              .eq('id', profile.id)

            if (deleteProfileError) {
              console.error(`❌ Erreur suppression profil ${profile.full_name}:`, deleteProfileError.message)
            } else {
              console.log(`✅ Profil ${profile.full_name} supprimé`)
            }
          }
        } else {
          console.log('✅ Aucun profil orphelin trouvé')
        }
      }
    }

    // Vérification finale
    console.log('\n🔍 VÉRIFICATION FINALE:')
    const { data: finalUsers, error: finalError } = await supabaseAdmin.auth.admin.listUsers()

    if (finalError) {
      console.error('❌ Erreur vérification finale:', finalError)
    } else {
      console.log(`✅ ${finalUsers.users.length} utilisateur(s) restant(s):`)
      finalUsers.users.forEach(user => {
        console.log(`  - ${user.email} (${user.id})`)
      })
    }

    const { data: finalProfiles, error: finalProfileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')

    if (finalProfileError) {
      console.error('❌ Erreur vérification profils finaux:', finalProfileError)
    } else {
      console.log(`✅ ${finalProfiles.length} profil(s) restant(s)`)
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }

  console.log('\n🏁 Nettoyage terminé!')
  console.log('🔄 Vous pouvez maintenant tester l\'inscription avec un nouvel email.')
}

cleanupUsers().catch(console.error)
