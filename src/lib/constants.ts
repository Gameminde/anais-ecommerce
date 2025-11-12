export const WILAYAS = [
  { code: '01', name: 'Adrar' },
  { code: '02', name: 'Chlef' },
  { code: '03', name: 'Laghouat' },
  { code: '04', name: 'Oum El Bouaghi' },
  { code: '05', name: 'Batna' },
  { code: '06', name: 'Béjaïa' },
  { code: '07', name: 'Biskra' },
  { code: '08', name: 'Béchar' },
  { code: '09', name: 'Blida' },
  { code: '10', name: 'Bouira' },
  { code: '11', name: 'Tamanrasset' },
  { code: '12', name: 'Tébessa' },
  { code: '13', name: 'Tlemcen' },
  { code: '14', name: 'Tiaret' },
  { code: '15', name: 'Tizi Ouzou' },
  { code: '16', name: 'Alger' },
  { code: '17', name: 'Djelfa' },
  { code: '18', name: 'Jijel' },
  { code: '19', name: 'Sétif' },
  { code: '20', name: 'Saïda' },
  { code: '21', name: 'Skikda' },
  { code: '22', name: 'Sidi Bel Abbès' },
  { code: '23', name: 'Annaba' },
  { code: '24', name: 'Guelma' },
  { code: '25', name: 'Constantine' },
  { code: '26', name: 'Médéa' },
  { code: '27', name: 'Mostaganem' },
  { code: '28', name: "M'Sila" },
  { code: '29', name: 'Mascara' },
  { code: '30', name: 'Ouargla' },
  { code: '31', name: 'Oran' },
  { code: '32', name: 'El Bayadh' },
  { code: '33', name: 'Illizi' },
  { code: '34', name: 'Bordj Bou Arréridj' },
  { code: '35', name: 'Boumerdès' },
  { code: '36', name: 'El Tarf' },
  { code: '37', name: 'Tindouf' },
  { code: '38', name: 'Tissemsilt' },
  { code: '39', name: 'El Oued' },
  { code: '40', name: 'Khenchela' },
  { code: '41', name: 'Souk Ahras' },
  { code: '42', name: 'Tipaza' },
  { code: '43', name: 'Mila' },
  { code: '44', name: 'Aïn Defla' },
  { code: '45', name: 'Naâma' },
  { code: '46', name: 'Aïn Témouchent' },
  { code: '47', name: 'Ghardaïa' },
  { code: '48', name: 'Relizane' },
  { code: '49', name: 'Timimoun' },
  { code: '50', name: 'Bordj Badji Mokhtar' },
  { code: '51', name: 'Ouled Djellal' },
  { code: '52', name: 'Béni Abbès' },
  { code: '53', name: 'In Salah' },
  { code: '54', name: 'In Guezzam' },
  { code: '55', name: 'Touggourt' },
  { code: '56', name: 'Djanet' },
  { code: '57', name: "El M'Ghair" },
  { code: '58', name: 'El Meniaa' }
];

export const validateAlgerianPhone = (phone: string): boolean => {
  // Nettoyer le numéro (supprimer espaces et caractères spéciaux)
  const cleaned = phone.replace(/\s+/g, '').replace(/[-()]/g, '');

  // Patterns valides pour les numéros algériens
  const patterns = [
    /^0[5-7]\d{8}$/,         // Format local: 0661234567
    /^\+213[5-7]\d{8}$/,     // Format international: +213661234567
    /^00213[5-7]\d{8}$/      // Format international alternatif: 00213661234567
  ];

  return patterns.some(pattern => pattern.test(cleaned));
};

export const formatAlgerianPhone = (phone: string): string => {
  // Nettoyer d'abord
  const cleaned = phone.replace(/\s+/g, '').replace(/[-()]/g, '');

  // Si c'est au format local (10 chiffres), formater comme 06XX XX XX XX
  if (/^0[5-7]\d{8}$/.test(cleaned)) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  }

  // Si c'est au format international, garder tel quel
  if (/^\+213[5-7]\d{8}$/.test(cleaned) || /^00213[5-7]\d{8}$/.test(cleaned)) {
    return cleaned;
  }

  // Sinon retourner tel quel
  return phone;
};

/**
 * Calcule les frais de livraison selon les règles suivantes :
 * - Alger : toujours 500 DA (pas de réduction)
 * - Hors wilaya : 800 DA de base, devient 600 DA si achat > 5000 DA
 */
export const calculateDeliveryFee = (province: string, cartTotal: number): number => {
  const isAlger = province?.toLowerCase().includes('alger') || province === '16';

  if (isAlger) {
    // Alger : toujours 500 DA, peu importe le montant
    return 500;
  } else {
    // Hors wilaya : 800 DA de base, 600 DA si achat > 5000 DA
    return cartTotal > 5000 ? 600 : 800;
  }
};
