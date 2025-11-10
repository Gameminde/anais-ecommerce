// Script pour tester la création directe d'une commande
const SUPABASE_URL = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo';

async function testDirectOrder() {
  console.log('🧪 Test création commande directe...');

  const orderData = {
    order_number: 'TEST-001',
    user_id: '00000000-0000-0000-0000-000000000000',
    total_amount_dzd: 1400,
    delivery_fee_dzd: 400,
    payment_method: 'cash_on_delivery',
    payment_status: 'pending',
    order_status: 'pending'
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.log('Erreur:', error.message);
  }
}

testDirectOrder();
