// Test de la fonction calculateDeliveryFee
const calculateDeliveryFee = (province, cartTotal) => {
  const isAlger = province?.toLowerCase().includes('alger') || province === '16';
  let baseFee = isAlger ? 500 : 800;

  // Si achat > 5000 DA, livraison devient 600 DA (uniquement pour Alger)
  if (isAlger && cartTotal > 5000) {
    baseFee = 600;
  }

  return baseFee;
};

console.log('🧪 TESTS DE CALCUL DES FRAIS DE LIVRAISON');
console.log('=====================================');
console.log('Test livraison Alger 3000 DA:', calculateDeliveryFee('Alger', 3000), 'DA (doit être 500)');
console.log('Test livraison Alger 6000 DA:', calculateDeliveryFee('Alger', 6000), 'DA (doit être 600)');
console.log('Test livraison Oran 3000 DA:', calculateDeliveryFee('Oran', 3000), 'DA (doit être 800)');
console.log('Test livraison Constantine 6000 DA:', calculateDeliveryFee('Constantine', 6000), 'DA (doit être 800)');
console.log('Test livraison vide 3000 DA:', calculateDeliveryFee('', 3000), 'DA (doit être 800)');
console.log('=====================================');
console.log('✅ Tests terminés');
