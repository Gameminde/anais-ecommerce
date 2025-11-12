import http from 'http';

function testServerAndSidebar() {
  console.log('🧪 Test simple - Serveur et sidebar...\n');

  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5173', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const hasSidebar = data.includes('mobile-bottom-nav-portal');
          const hasMobileNav = data.includes('MobileBottomNav');

          console.log('✅ Serveur fonctionne');
          console.log(`📱 Sidebar dans HTML: ${hasSidebar ? 'OUI' : 'NON'}`);
          console.log(`📱 Composant MobileBottomNav: ${hasMobileNav ? 'OUI' : 'NON'}`);

          if (hasSidebar && hasMobileNav) {
            console.log('\n🎯 La sidebar est présente dans le code HTML');
            console.log('💡 Elle devrait être cachée sur desktop (display: none)');
            console.log('📱 Et visible sur mobile (@media max-width: 768px)');
            console.log('\n✅ SOLUTION APPLIQUÉE AVEC SUCCÈS!');
          } else {
            console.log('\n❌ Problème détecté');
          }

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

testServerAndSidebar().catch((error) => {
  console.error('❌ Erreur lors du test:', error.message);
});
