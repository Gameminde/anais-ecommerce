// Script pour tester la base de données
const SUPABASE_URL = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo';

async function testDatabase() {
  console.log('🗄️ Test de la base de données...');

  // Test 1: Vérifier les tables
  console.log('\n1️⃣ Vérification des tables...');
  const tables = ['addresses', 'orders', 'order_items', 'products'];

  for (const table of tables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (response.ok) {
        console.log(`✅ Table ${table} existe`);
      } else {
        console.log(`❌ Table ${table} problème:`, response.status, await response.text());
      }
    } catch (error) {
      console.log(`💥 Erreur table ${table}:`, error.message);
    }
  }

  // Test 2: Vérifier les colonnes de la table orders
  console.log('\n2️⃣ Vérification des colonnes orders...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&limit=0`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      console.log('✅ Peut accéder à la table orders');
    } else {
      console.log('❌ Problème accès orders:', response.status);
    }
  } catch (error) {
    console.log('💥 Erreur accès orders:', error.message);
  }

  // Test 3: Vérifier les colonnes de la table addresses
  console.log('\n3️⃣ Vérification des colonnes addresses...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/addresses?select=*&limit=0`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      console.log('✅ Peut accéder à la table addresses');
    } else {
      console.log('❌ Problème accès addresses:', response.status);
    }
  } catch (error) {
    console.log('💥 Erreur accès addresses:', error.message);
  }

  // Test 4: Vérifier les colonnes de la table order_items
  console.log('\n4️⃣ Vérification des colonnes order_items...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/order_items?select=*&limit=0`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      console.log('✅ Peut accéder à la table order_items');
    } else {
      console.log('❌ Problème accès order_items:', response.status);
    }
  } catch (error) {
    console.log('💥 Erreur accès order_items:', error.message);
  }
}

// Exécuter le test
testDatabase();
