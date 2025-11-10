// Script de test complet pour la création de commande
const SUPABASE_URL = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo';

// Simuler un token JWT valide
const VALID_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTRlN2M2My1jMmYxLTQ0MDQtYTk4My1jYWUwZjd5ZjY0OTMiLCJlbWFpbCI6InlvdWNlZm5lb3lvdWNlZkBnbWFpbC5jb20iLCJpYXQiOjE3MzQ3MzM0NzUsImV4cCI6MTc2NjI2OTQ3NX0.fake_token';

async function testOrderCreation() {
  console.log('🧪 Test complet de création de commande...\n');

  try {
    // Étape 1: Créer une adresse
    console.log('1️⃣ Création d\'adresse...');
    const addressData = {
      user_id: '194e7c63-c2f1-4404-a983-cae0f7d96493',
      full_name: 'CHERIET YOUCEF',
      phone: '+213797771807',
      address_line1: 'ALGER GUE D CONSTANTINE',
      city: 'ALGER',
      province: '16',
      postal_code: '16000',
      is_default: false
    };

    const addressResponse = await fetch(`${SUPABASE_URL}/rest/v1/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${VALID_JWT_TOKEN}`,
      },
      body: JSON.stringify(addressData),
    });

    console.log('   Status:', addressResponse.status);
    const addressText = await addressResponse.text();
    console.log('   Response body:', addressText);

    if (!addressResponse.ok) {
      console.log('❌ Échec création adresse');
      return;
    }

    // Récupérer l'adresse créée (car le corps peut être vide)
    const recentAddressResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/addresses?user_id=eq.194e7c63-c2f1-4404-a983-cae0f7d96493&order=created_at.desc&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${VALID_JWT_TOKEN}`,
        },
      }
    );

    let addressId;
    if (recentAddressResponse.ok) {
      const recentAddresses = await recentAddressResponse.json().catch(() => []);
      if (recentAddresses.length > 0) {
        addressId = recentAddresses[0].id;
        console.log('✅ Adresse récupérée:', addressId);
      }
    }

    if (!addressId) {
      console.log('❌ Impossible de récupérer l\'ID de l\'adresse');
      return;
    }

    // Étape 2: Créer la commande
    console.log('\n2️⃣ Création de commande...');
    const orderNumber = 'TEST-' + Date.now();
    const orderData = {
      order_number: orderNumber,
      user_id: '194e7c63-c2f1-4404-a983-cae0f7d96493',
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
        'Authorization': `Bearer ${VALID_JWT_TOKEN}`,
      },
      body: JSON.stringify(orderData),
    });

    console.log('   Status:', orderResponse.status);
    const orderText = await orderResponse.text();
    console.log('   Response body:', orderText);

    if (!orderResponse.ok) {
      console.log('❌ Échec création commande');
      return;
    }

    // Récupérer la commande créée
    const recentOrderResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?user_id=eq.194e7c63-c2f1-4404-a983-cae0f7d96493&order=created_at.desc&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${VALID_JWT_TOKEN}`,
        },
      }
    );

    let orderId;
    if (recentOrderResponse.ok) {
      const recentOrders = await recentOrderResponse.json().catch(() => []);
      if (recentOrders.length > 0) {
        orderId = recentOrders[0].id;
        console.log('✅ Commande récupérée:', orderId);
      }
    }

    if (!orderId) {
      console.log('❌ Impossible de récupérer l\'ID de la commande');
      return;
    }

    // Étape 3: Créer les articles
    console.log('\n3️⃣ Création des articles...');
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
        'Authorization': `Bearer ${VALID_JWT_TOKEN}`,
      },
      body: JSON.stringify(itemsData),
    });

    console.log('   Status:', itemsResponse.status);
    const itemsText = await itemsResponse.text();
    console.log('   Response body:', itemsText);

    if (itemsResponse.ok) {
      console.log('\n🎉 Test réussi ! Commande complète créée.');
      console.log('   - Adresse ID:', addressId);
      console.log('   - Commande ID:', orderId);
      console.log('   - Numéro:', orderNumber);
    } else {
      console.log('❌ Échec création articles');
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

testOrderCreation();
