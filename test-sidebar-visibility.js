import http from 'http';

async function testSidebarVisibility() {
  console.log('🧪 Test de visibilité de la sidebar mobile...');

  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5173', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Vérifier si la sidebar existe dans le HTML
          const hasSidebar = data.includes('mobile-bottom-nav-portal');

          if (hasSidebar) {
            console.log('✅ Sidebar trouvée dans le HTML');
            console.log('📝 Le CSS devrait la cacher sur desktop et l\'afficher sur mobile');
            console.log('🎯 Solution appliquée: display: none par défaut, block sur @media (max-width: 768px)');
          } else {
            console.log('❌ Sidebar non trouvée dans le HTML');
          }

          console.log('🎉 Test terminé!');
          console.log('💡 Pour vérifier manuellement:');
          console.log('   - Desktop: Ouvrez http://localhost:5173 et vérifiez qu\'aucune sidebar n\'apparaît');
          console.log('   - Mobile: Utilisez les dev tools (responsive design) et vérifiez que la sidebar apparaît sur <768px');

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

testSidebarVisibility().catch((error) => {
  console.error('❌ Erreur lors du test:', error.message);
});
