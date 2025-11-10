// Script de test pour vérifier les images dans le navigateur
// À coller dans la console Chrome DevTools

console.log('🧪 TEST IMAGES BROWSER');

// Test direct des URLs
const testUrls = [
  'https://zvyhuqkyeyzkjdvafdkx.supabase.co/storage/v1/object/public/1762729500203-g2bf11scrbs.png',
  'https://zvyhuqkyeyzkjdvafdkx.supabase.co/storage/v1/object/public/products/1762715868428-73pcvia8pvg.png'
];

async function testImageUrl(url) {
  try {
    console.log(`🔍 Test: ${url}`);
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors'
    });

    console.log(`   Status: ${response.status}`);
    console.log(`   OK: ${response.ok}`);

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      console.log(`   Type: ${contentType}`);
      console.log(`   Size: ${contentLength} bytes`);
      console.log('   ✅ IMAGE ACCESSIBLE');
    } else {
      console.log('   ❌ IMAGE NON ACCESSIBLE');
    }

    return response.ok;
  } catch (error) {
    console.error(`   💥 ERREUR: ${error.message}`);
    return false;
  }
}

// Tester toutes les URLs
async function runTests() {
  console.log('🚀 Démarrage des tests...\n');

  for (const url of testUrls) {
    await testImageUrl(url);
    console.log(''); // Ligne vide
  }

  // Tester les images dans le DOM
  console.log('📱 Test des images dans la page...');
  const images = document.querySelectorAll('img');
  console.log(`   Total images trouvées: ${images.length}`);

  images.forEach((img, i) => {
    const status = img.complete ?
      (img.naturalWidth > 0 ? '✅ Chargée' : '❌ Échouée') :
      '⏳ En cours';

    console.log(`   Image ${i}: ${status} - ${img.src.substring(0, 80)}...`);
  });
}

runTests();
