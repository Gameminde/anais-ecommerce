// Script de test pour la fonction create-order
const SUPABASE_URL = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo';

async function testCreateOrder() {
  console.log('🧪 Test de la fonction create-order...');

  // Utiliser l'utilisateur et l'adresse existants
  const testData = {
    userId: '3fd3edfb-c795-49ec-95c9-2860680553b2', // Utilisateur existant
    shippingAddressId: '84c5b122-4178-4aa5-a2e3-6ba15b1c2001', // Adresse créée
    fullName: 'Test User',
    phone: '0555123456',
    email: 'test@example.com',
    wilaya: '16',
    commune: 'Alger Centre',
    address: '123 Test Street, Algérie',
    postalCode: '16000',
    deliveryNotes: 'Test order',
    items: [
      {
        productId: '806189f9-6219-495d-8019-bf8cd7975e7a', // Produit existant
        quantity: 1,
        price: 1000,
        size: 'M',
        color: 'Blue'
      }
    ],
    subtotal: 1000,
    shippingFee: 400
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('📊 Status:', response.status);
    console.log('📋 Response complète:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Test réussi!');
    } else {
      console.log('❌ Test échoué:', result.error);
    }
  } catch (error) {
    console.error('💥 Erreur réseau:', error);
  }
}

// Exécuter le test
testCreateOrder();
