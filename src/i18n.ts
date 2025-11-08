import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Accueil',
        shop: 'Boutique',
        ensembles: 'Ensemble',
        giftBoxes: 'Coffret Cadeau',
        about: 'À Propos',
        contact: 'Contact',
        cart: 'Panier',
        account: 'Compte',
        admin: 'Admin',
      },
      // Home page
      home: {
        hero: {
          title: 'Ensembles Élégants pour Femmes',
          subtitle: 'Découvrez ANAIS - Collections Raffinées pour Occasions Spéciales',
          cta: 'Voir la Collection',
          secondaryNote: 'Découvrez également notre sélection de parfums et maquillage de créateur',
        },
        featured: {
          title: 'Ensembles Vedettes',
          viewAll: 'Voir Tous les Ensembles',
        },
        giftBoxes: {
          title: 'Coffrets Cadeaux de Luxe',
          subtitle: 'Ensemble + Parfum + Maquillage pour Mariages et Occasions Spéciales',
          viewAll: 'Explorer les Coffrets',
        },
      },
      // Product page
      product: {
        addToCart: 'Add to Cart',
        selectSize: 'Select Size',
        selectColor: 'Select Color',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
        description: 'Description',
        details: 'Details',
        sku: 'SKU',
        category: 'Category',
        price: 'Price',
      },
      // Cart
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        subtotal: 'Subtotal',
        delivery: 'Delivery Fee',
        total: 'Total',
        checkout: 'Proceed to Checkout',
        continueShopping: 'Continue Shopping',
        remove: 'Remove',
        updateQuantity: 'Update Quantity',
      },
      // Checkout
      checkout: {
        title: 'Checkout',
        shippingAddress: 'Shipping Address',
        paymentMethod: 'Payment Method',
        orderSummary: 'Order Summary',
        placeOrder: 'Place Order',
        cod: 'Cash on Delivery',
        codDescription: 'Pay when you receive your order',
      },
      // Account
      account: {
        title: 'My Account',
        orders: 'My Orders',
        addresses: 'Addresses',
        profile: 'Profile',
        logout: 'Logout',
        login: 'Login',
        register: 'Register',
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        dzd: 'DZD',
        items: 'items',
      },
    },
  },
  ar: {
    translation: {
      // Navigation
      nav: {
        home: 'الرئيسية',
        shop: 'المتجر',
        ensembles: 'أطقم',
        giftBoxes: 'صناديق الهدايا',
        about: 'من نحن',
        contact: 'اتصل بنا',
        cart: 'السلة',
        account: 'الحساب',
        admin: 'الإدارة',
      },
      // Home page
      home: {
        hero: {
          title: 'أطقم أنيقة للنساء',
          subtitle: 'اكتشفي أنيس - مجموعات راقية للمناسبات الخاصة',
          cta: 'عرض المجموعة',
          secondaryNote: 'اكتشف أيضاً مجموعتنا من العطور والمكياج المصمم',
        },
        featured: {
          title: 'أطقم مميزة',
          viewAll: 'عرض جميع الأطقم',
        },
        giftBoxes: {
          title: 'صناديق هدايا فاخرة',
          subtitle: 'طقم + عطر + مكياج للأعراس والمناسبات الخاصة',
          viewAll: 'استكشف الصناديق',
        },
      },
      // Product page
      product: {
        addToCart: 'أضف إلى السلة',
        selectSize: 'اختر المقاس',
        selectColor: 'اختر اللون',
        inStock: 'متوفر',
        outOfStock: 'غير متوفر',
        description: 'الوصف',
        details: 'التفاصيل',
        sku: 'رقم المنتج',
        category: 'الفئة',
        price: 'السعر',
      },
      // Cart
      cart: {
        title: 'سلة التسوق',
        empty: 'سلتك فارغة',
        subtotal: 'المجموع الفرعي',
        delivery: 'رسوم التوصيل',
        total: 'المجموع',
        checkout: 'متابعة إلى الدفع',
        continueShopping: 'متابعة التسوق',
        remove: 'إزالة',
        updateQuantity: 'تحديث الكمية',
      },
      // Checkout
      checkout: {
        title: 'إتمام الطلب',
        shippingAddress: 'عنوان الشحن',
        paymentMethod: 'طريقة الدفع',
        orderSummary: 'ملخص الطلب',
        placeOrder: 'تأكيد الطلب',
        cod: 'الدفع عند الاستلام',
        codDescription: 'ادفع عند استلام طلبك',
      },
      // Account
      account: {
        title: 'حسابي',
        orders: 'طلباتي',
        addresses: 'العناوين',
        profile: 'الملف الشخصي',
        logout: 'تسجيل الخروج',
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
      },
      // Common
      common: {
        loading: 'جاري التحميل...',
        error: 'حدث خطأ',
        success: 'نجح',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',
        dzd: 'دج',
        items: 'عناصر',
      },
    },
  },
  fr: {
    translation: {
      // Navigation
      nav: {
        home: 'Accueil',
        shop: 'Boutique',
        ensembles: 'Ensemble',
        giftBoxes: 'Coffret Cadeau',
        about: 'À Propos',
        contact: 'Contact',
        cart: 'Panier',
        account: 'Compte',
        admin: 'Admin',
      },
      // Home page
      home: {
        hero: {
          title: 'Ensembles Élégants pour Femmes',
          subtitle: 'Découvrez ANAIS - Collections Raffinées pour Occasions Spéciales',
          cta: 'Voir la Collection',
          secondaryNote: 'Découvrez également notre sélection de parfums et maquillage de créateur',
        },
        featured: {
          title: 'Ensembles Vedettes',
          viewAll: 'Voir Tous les Ensembles',
        },
        giftBoxes: {
          title: 'Coffrets Cadeaux de Luxe',
          subtitle: 'Ensemble + Parfum + Maquillage pour Mariages et Occasions Spéciales',
          viewAll: 'Explorer les Coffrets',
        },
      },
      // Product page
      product: {
        addToCart: 'Ajouter au Panier',
        selectSize: 'Sélectionner la Taille',
        selectColor: 'Sélectionner la Couleur',
        inStock: 'En Stock',
        outOfStock: 'Rupture de Stock',
        description: 'Description',
        details: 'Détails',
        sku: 'Référence',
        category: 'Catégorie',
        price: 'Prix',
      },
      // Cart
      cart: {
        title: 'Panier',
        empty: 'Votre panier est vide',
        subtotal: 'Sous-total',
        delivery: 'Frais de Livraison',
        total: 'Total',
        checkout: 'Passer la Commande',
        continueShopping: 'Continuer les Achats',
        remove: 'Retirer',
        updateQuantity: 'Modifier la Quantité',
      },
      // Checkout
      checkout: {
        title: 'Finaliser la Commande',
        shippingAddress: 'Adresse de Livraison',
        paymentMethod: 'Mode de Paiement',
        orderSummary: 'Récapitulatif',
        placeOrder: 'Confirmer la Commande',
        cod: 'Paiement à la Livraison',
        codDescription: 'Payez à la réception de votre commande',
      },
      // Account
      account: {
        title: 'Mon Compte',
        orders: 'Mes Commandes',
        addresses: 'Adresses',
        profile: 'Profil',
        logout: 'Déconnexion',
        login: 'Connexion',
        register: 'Créer un Compte',
      },
      // Common
      common: {
        loading: 'Chargement...',
        error: 'Une erreur est survenue',
        success: 'Succès',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        dzd: 'DZD',
        items: 'articles',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language changed to French
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
