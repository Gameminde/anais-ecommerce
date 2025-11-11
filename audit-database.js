import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function auditDatabase() {
  console.log('🔍 AUDIT DE LA BASE DE DONNÉES ANAIS\n')

  try {
    // 1. TABLES PRINCIPALES
    console.log('📊 TABLES PRINCIPALES:')
    const tables = [
      'products',
      'categories',
      'product_images',
      'profiles',
      'admin_users',
      'addresses',
      'orders',
      'order_items'
    ]

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: ${data ? 'Accessible' : 'Vide'}`)
        }
      } catch (err) {
        console.log(`❌ ${table}: Erreur - ${err.message}`)
      }
    }

    console.log('\n📈 DONNÉES DÉTAILLÉES:')

    // 2. PRODUITS
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .limit(10)

    if (productsError) {
      console.log('❌ Produits:', productsError.message)
    } else {
      console.log(`✅ Produits: ${products.length} trouvés`)
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name_en} (${product.product_type}) - ${product.product_images?.length || 0} images`)
      })
    }

    // 3. CATÉGORIES
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')

    if (categoriesError) {
      console.log('❌ Catégories:', categoriesError.message)
    } else {
      console.log(`✅ Catégories: ${categories.length} trouvées`)
      categories.forEach(cat => {
        console.log(`   - ${cat.name_fr || cat.name_en} (${cat.is_active ? 'Actif' : 'Inactif'})`)
      })
    }

    // 4. UTILISATEURS
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')

    if (profilesError) {
      console.log('❌ Profils:', profilesError.message)
    } else {
      console.log(`✅ Profils utilisateurs: ${profiles.length} trouvés`)
    }

    // 5. ADMINS
    const { data: admins, error: adminsError } = await supabase
      .from('admin_users')
      .select('*')

    if (adminsError) {
      console.log('❌ Admins:', adminsError.message)
    } else {
      console.log(`✅ Admins: ${admins.length} trouvés`)
      admins.forEach(admin => {
        console.log(`   - ${admin.role} (Actif: ${admin.is_active})`)
      })
    }

    // 6. COMMANDES
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .limit(5)

    if (ordersError) {
      console.log('❌ Commandes:', ordersError.message)
    } else {
      console.log(`✅ Commandes récentes: ${orders.length} trouvées`)
    }

    console.log('\n🔒 POLITIQUES RLS:')
    // Test des politiques RLS basiques
    const rlsTests = [
      { table: 'products', operation: 'select' },
      { table: 'categories', operation: 'select' },
      { table: 'profiles', operation: 'select' }
    ]

    for (const test of rlsTests) {
      try {
        const { error } = await supabase
          .from(test.table)
          .select('*', { count: 'exact', head: true })

        console.log(`${error ? '❌' : '✅'} ${test.table}.${test.operation}: ${error ? error.message : 'OK'}`)
      } catch (err) {
        console.log(`❌ ${test.table}.${test.operation}: Exception - ${err.message}`)
      }
    }

    console.log('\n💾 STOCKAGE:')
    // Vérifier les buckets de stockage
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.log('❌ Stockage:', bucketsError.message)
    } else {
      console.log(`✅ Buckets: ${buckets.length} trouvés`)
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'Public' : 'Privé'})`)
      })
    }

  } catch (error) {
    console.error('❌ Erreur générale d\'audit:', error.message)
  }
}

auditDatabase()
