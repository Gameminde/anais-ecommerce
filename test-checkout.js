// Script de test pour les appels REST API du checkout
const SUPABASE_URL = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo';

// Simuler un token JWT (à remplacer par un vrai token)
const MOCK_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.fake_token';

async function testCheckoutAPIs() {
  console.log('🧪 Test des APIs de checkout...\n');

  try {
    // Test 1: Création d'adresse
    console.log('1️⃣ Test création d\'adresse...');
    const addressData = {
      user_id: '3fd3edfb-c795-49ec-95c9-2860680553b2', // Utilisateur existant
      full_name: 'Test User',
      phone: '0555123456',
      address_line1: '123 Test Street',
      city: 'Alger Centre',
      province: '16',
      is_default: false
    };

    const addressResponse = await fetch(`${SUPABASE_URL}/rest/v1/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${MOCK_JWT_TOKEN}`,
      },
      body: JSON.stringify(addressData),
    });

    console.log('   Status:', addressResponse.status);
    const addressText = await addressResponse.text();
    console.log('   Response:', addressText);

    if (!addressResponse.ok) {
      console.log('❌ Échec création adresse');
      return;
    }

    const addressResult = JSON.parse(addressText);
    const addressId = addressResult[0]?.id;
    console.log('✅ Adresse créée:', addressId);

    // Test 2: Génération numéro commande
    console.log('\n2️⃣ Test génération numéro commande...');
    const seqResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?select=order_number&order=created_at.desc&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${MOCK_JWT_TOKEN}`,
        },
      }
    );

    console.log('   Status:', seqResponse.status);
    const seqText = await seqResponse.text();
    console.log('   Response:', seqText);

    // Test 3: Création commande
    console.log('\n3️⃣ Test création commande...');
    const orderNumber = 'TEST-999';
    const orderData = {
      order_number: orderNumber,
      user_id: '3fd3edfb-c795-49ec-95c9-2860680553b2',
      shipping_address_id: addressId,
      total_amount_dzd: 1400,
      delivery_fee_dzd: 400,
      payment_method: 'cod',
      payment_status: 'pending',
      order_status: 'pending',
    };

    const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${MOCK_JWT_TOKEN}`,
      },
      body: JSON.stringify(orderData),
    });

    console.log('   Status:', orderResponse.status);
    const orderText = await orderResponse.text();
    console.log('   Response:', orderText);

    if (!orderResponse.ok) {
      console.log('❌ Échec création commande');
      return;
    }

    const orderResult = JSON.parse(orderText);
    const orderId = orderResult[0]?.id;
    console.log('✅ Commande créée:', orderId);

    // Test 4: Création articles
    console.log('\n4️⃣ Test création articles...');
    const itemsData = [
      {
        order_id: orderId,
        product_id: '806189f9-6219-495d-8019-bf8cd7975e7a',
        quantity: 1,
        price_dzd: 1000,
        size: 'M',
        color: 'Blue',
      }
    ];

    const itemsResponse = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${MOCK_JWT_TOKEN}`,
      },
      body: JSON.stringify(itemsData),
    });

    console.log('   Status:', itemsResponse.status);
    const itemsText = await itemsResponse.text();
    console.log('   Response:', itemsText);

    if (itemsResponse.ok) {
      console.log('✅ Articles créés avec succès!');
    } else {
      console.log('❌ Échec création articles');
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error.message);
  }
}

testCheckoutAPIs();
