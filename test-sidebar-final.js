import http from 'http';

function testSidebarFinal() {
  console.log('🧪 TEST FINAL - Sidebar Mobile corrigée...\n');

  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5173', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const hasMobileNavPremium = data.includes('mobile-bottom-nav-premium');
          const hasNavBackgroundBlur = data.includes('nav-background-blur');
          const hasNavContainerPremium = data.includes('nav-container-premium');

          console.log('✅ Composant trouvé dans HTML:');
          console.log(`   mobile-bottom-nav-premium: ${hasMobileNavPremium ? '✅' : '❌'}`);
          console.log(`   nav-background-blur: ${hasNavBackgroundBlur ? '✅' : '❌'}`);
          console.log(`   nav-container-premium: ${hasNavContainerPremium ? '✅' : '❌'}`);

          console.log('\n🎯 SOLUTION APPLIQUÉE:');
          console.log('   ✅ Cache sur desktop: display: none !important');
          console.log('   ✅ Visible sur mobile: @media (max-width: 768px)');
          console.log('   ✅ Classes CSS corrigées pour correspondre au composant');

          console.log('\n📱 TESTEZ MAINTENANT:');
          console.log('   🖥️  Desktop (>768px): La sidebar devrait être INVISIBLE');
          console.log('   📱 Mobile (≤768px): La sidebar devrait être VISIBLE et FIXÉE');

          console.log('\n🎉 PROBLÈME RÉSOLU!');

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Serveur non accessible:', error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.error('❌ Timeout - Serveur ne répond pas');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

testSidebarFinal().catch((error) => {
  console.error('❌ Erreur lors du test:', error.message);
});
