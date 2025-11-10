// Script de test pour vérifier la session Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo';

async function testSession() {
  console.log('🔐 Test de session Supabase...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Vérifier la session actuelle
    console.log('1️⃣ Vérification session actuelle...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.log('❌ Erreur session:', sessionError);
    } else if (session) {
      console.log('✅ Session active:', {
        user: session.user?.email,
        expires_at: new Date(session.expires_at * 1000),
        now: new Date()
      });
    } else {
      console.log('❌ Aucune session active');
    }

    // Essayer de rafraîchir la session
    console.log('\n2️⃣ Tentative de rafraîchissement...');
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      console.log('❌ Erreur refresh:', refreshError);
    } else if (refreshData.session) {
      console.log('✅ Session rafraîchie:', {
        user: refreshData.session.user?.email,
        expires_at: new Date(refreshData.session.expires_at * 1000)
      });
    } else {
      console.log('⚠️ Aucun token de refresh disponible');
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

testSession();
