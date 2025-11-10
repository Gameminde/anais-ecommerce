// Script pour vérifier les utilisateurs existants
const SUPABASE_URL = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo';

async function checkUsers() {
  console.log('👥 Vérification des utilisateurs...');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id,full_name&limit=5`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Utilisateurs trouvés:', data);
      if (data.length > 0) {
        console.log('🎯 Utilisons le premier user ID:', data[0].id);
        return data[0].id;
      }
    } else {
      console.log('❌ Erreur accès profiles:', response.status, await response.text());
    }
  } catch (error) {
    console.log('💥 Erreur réseau:', error.message);
  }

  return null;
}

checkUsers();
