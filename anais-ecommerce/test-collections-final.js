import http from 'http';

function testCollections() {
  console.log('🧪 TEST COLLECTIONS - Photos remplacées\n');

  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5173', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          console.log('✅ Serveur fonctionne');

          // Vérifier les nouvelles collections
          const hasEnsembles = data.includes('Collection Ensembles');
          const hasMakeup = data.includes('Collection Maquillage');
          const hasPerfume = data.includes('Collection Parfums');

          console.log('\n📸 IMAGES DE COLLECTIONS:');
          console.log(`   Ensembles: ${hasEnsembles ? '✅' : '❌'}`);
          console.log(`   Maquillage: ${hasMakeup ? '✅' : '❌'}`);
          console.log(`   Parfums: ${hasPerfume ? '✅' : '❌'}`);

          // Vérifier les chemins d'images
          const hasEnsembleImg = data.includes('ensemble_collection.jpg');
          const hasMakeupImg = data.includes('makeup_collection.jpg');
          const hasPerfumeImg = data.includes('perfume_collection.jpg');

          console.log('\n🖼️ CHEMINS D\'IMAGES:');
          console.log(`   /images/ensemble_collection.jpg: ${hasEnsembleImg ? '✅' : '❌'}`);
          console.log(`   /images/makeup_collection.jpg: ${hasMakeupImg ? '✅' : '❌'}`);
          console.log(`   /images/perfume_collection.jpg: ${hasPerfumeImg ? '✅' : '❌'}`);

          // Vérifier qu'il n'y a plus les anciens overlays
          const oldOverlays = (data.match(/bg-black\/20/g) || []).length;
          console.log(`\n🎨 Anciens overlays supprimés: ${oldOverlays} restants`);

          console.log('\n🎯 RÉSULTAT:');
          if (hasEnsembles && hasMakeup && hasPerfume && hasEnsembleImg && hasMakeupImg && hasPerfumeImg) {
            console.log('   ✅ SUCCÈS - Collections avec vraies images !');
          } else {
            console.log('   ⚠️ PARTIEL - Certaines images manquent');
          }

          console.log('\n💡 INSTRUCTIONS:');
          console.log('   🖥️ Ouvrez http://localhost:5173');
          console.log('   📱 Scrollez pour voir la section "nos collections"');
          console.log('   🖼️ Vous devriez voir 3 vraies images au lieu des overlays noirs');

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      reject(new Error('Timeout'));
    });
  });
}

testCollections().catch(console.error);
