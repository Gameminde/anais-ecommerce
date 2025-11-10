// Script de test pour la création d'adresse
const SUPABASE_URL = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo';

// Token JWT valide (à remplacer par un vrai token)
const VALID_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTRlN2M2My1jMmYxLTQ0MDQtYTk4My1jYWUwZjd5ZjY0OTMiLCJlbWFpbCI6InlvdWNlZm5lb3lvdWNlZkBnbWFpbC5jb20iLCJpYXQiOjE3MzQ3MzM0NzUsImV4cCI6MTc2NjI2OTQ3NX0.fake_token';

async function testAddressCreation() {
  console.log('🏠 Test création d\'adresse...\n');

  const addressData = {
    user_id: '194e7c63-c2f1-4404-a983-cae0f7d96493',
    full_name: 'CHERIET YOUCEF',
    phone: '+213797771807',
    address_line1: '123 Rue de Test, Alger',
    city: 'Alger Centre',
    province: '16',
    postal_code: '16000',
    is_default: false
  };

  console.log('📤 Données à envoyer:', addressData);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${VALID_JWT_TOKEN}`,
      },
      body: JSON.stringify(addressData),
    });

    console.log('📡 Status:', response.status);
    console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📡 Response body:', responseText);

    if (response.ok) {
      console.log('✅ Adresse créée avec succès!');
    } else {
      console.log('❌ Échec création adresse');
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

testAddressCreation();
