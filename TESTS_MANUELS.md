# 🧪 GUIDE DE TESTS MANUELS - ANAIS E-COMMERCE

## 📋 CHECKLIST PRÉ-DÉPLOIEMENT

### 🔍 TESTS TECHNIQUES

#### 1. CONSOLE ERRORS
- [ ] Ouvrir Chrome DevTools (F12)
- [ ] Onglet Console : **0 erreurs rouges**
- [ ] Rafraîchir la page : Pas d'erreurs
- [ ] Naviguer entre les pages : Console propre

#### 2. RÉSEAU & PERFORMANCE
- [ ] Onglet Network : Toutes les requêtes en **200/201**
- [ ] Images chargent correctement
- [ ] Pas de requêtes échouées (rouge)
- [ ] Taille du bundle < 500KB (gzipped)

#### 3. LIGHTHOUSE AUDIT
- [ ] Performance : **> 70**
- [ ] Accessibilité : **> 90**
- [ ] Bonnes pratiques : **> 80**
- [ ] SEO : **> 80**

### 📱 TESTS MOBILES

#### 1. RESPONSIVE DESIGN
- [ ] **iPhone SE** (375px) : Layout correct
- [ ] **iPhone 12** (390px) : Layout correct
- [ ] **iPad** (768px) : Layout correct
- [ ] **Desktop** (1920px) : Layout correct

#### 2. NAVIGATION TACTILE
- [ ] Bottom navigation visible sur mobile
- [ ] Boutons assez grands (>44px)
- [ ] Scroll fluide sans lag
- [ ] Swipe gestures fonctionnels

#### 3. FORMULAIRES MOBILES
- [ ] Clavier virtuel adapté
- [ ] Champs focus correctement
- [ ] Validation visible sur mobile

### 🛒 TESTS E-COMMERCE

#### SCÉNARIO COMPLET UTILISATEUR
- [ ] Page d'accueil charge rapidement
- [ ] Navigation catalogue fluide
- [ ] Produits affichés avec images
- [ ] Filtrage par catégorie fonctionne
- [ ] Tri par prix fonctionne

#### PANIER D'ACHATS
- [ ] Ajout au panier : Toast de confirmation
- [ ] Quantité modifiable dans le panier
- [ ] Suppression d'articles
- [ ] Total calculé correctement
- [ ] Panier persiste après refresh

#### FORMULAIRE DE COMMANDE
- [ ] **Validation nom complet** : Champs requis
- [ ] **Validation téléphone** : Format algérien strict
- [ ] **Dropdown wilayas** : Toutes les 58 wilayas présentes
- [ ] **Validation commune** : Champ requis
- [ ] **Validation adresse** : Champ requis et détaillé
- [ ] **Email optionnel** : Validation si fourni

#### PAIEMENT À LA LIVRAISON
- [ ] Section paiement visible et claire
- [ ] Mention "Paiement à la livraison" bien visible
- [ ] Bouton commander désactivé si formulaire invalide
- [ ] Confirmation commande avec numéro unique

### 🔐 TESTS SÉCURITÉ

#### AUTHENTIFICATION
- [ ] Inscription avec email valide
- [ ] Connexion automatique après inscription
- [ ] Routes protégées accessibles après login
- [ ] Déconnexion fonctionne
- [ ] Accès admin protégé

#### DONNÉES SENSIBLES
- [ ] Mots de passe non loggés en console
- [ ] Tokens JWT non exposés
- [ ] Données clients protégées

### 📊 TESTS ANALYTICS

#### GOOGLE ANALYTICS
- [ ] Code GA présent dans le HTML
- [ ] Page views trackés
- [ ] Events e-commerce configurés

#### FACEBOOK PIXEL
- [ ] Code Pixel dans index.html
- [ ] Events AddToCart, Purchase trackés
- [ ] ViewContent sur pages produits

### 🚀 TESTS PERFORMANCE

#### CHARGEMENT
- [ ] **Première visite** : < 3 secondes
- [ ] **Visites suivantes** : < 1 seconde (cache)
- [ ] Images lazy loaded
- [ ] Pas de layout shift

#### NAVIGATION
- [ ] Changement de pages fluide
- [ ] Loading states présents
- [ ] Transitions smooth

### 🌐 TESTS CROSS-BROWSER

#### DESKTOP
- [ ] **Chrome** : Fonctionne parfaitement
- [ ] **Firefox** : Fonctionne parfaitement
- [ ] **Safari** : Fonctionne parfaitement
- [ ] **Edge** : Fonctionne parfaitement

#### MOBILE BROWSERS
- [ ] **Chrome Mobile** : Fonctionne parfaitement
- [ ] **Safari iOS** : Fonctionne parfaitement
- [ ] **Samsung Internet** : Fonctionne parfaitement

### 🛡️ TESTS CAS LIMITE

#### ERREURS UTILISATEUR
- [ ] Formulaire soumis avec champs vides
- [ ] Email invalide
- [ ] Téléphone algérien invalide
- [ ] Wilaya non sélectionnée
- [ ] Panier vide au checkout

#### CONNEXION LENTE
- [ ] Mode "Slow 3G" dans DevTools
- [ ] Images se chargent progressivement
- [ ] Fonctionnalités non bloquées

#### STOCK ÉPUISÉ
- [ ] Comportement quand produit indisponible
- [ ] Message d'erreur approprié

### 📱 TESTS PWA

#### INSTALLATION
- [ ] Icône d'installation visible
- [ ] PWA s'installe correctement
- [ ] Manifest valide

#### OFFLINE
- [ ] Service Worker actif
- [ ] Pages mises en cache
- [ ] Mode offline fonctionnel

### 🔍 TESTS SEO

#### META TAGS
- [ ] Title pertinent pour chaque page
- [ ] Meta description présente
- [ ] Open Graph tags pour partage

#### CONTENU
- [ ] Headings (H1, H2, H3) logiques
- [ ] Alt texts sur toutes les images
- [ ] URLs propres et lisibles

---

## 📝 PROCÉDURE DE TEST

### 1. PRÉPARATION
```bash
# Lancer le serveur de développement
npm run dev

# Ouvrir Chrome DevTools
# Activer Device Toolbar pour tests mobiles
```

### 2. TESTS AUTOMATISÉS
```bash
# Lancer les tests automatisés
npm run test-production
```

### 3. TESTS MANUELS SYSTÉMATIQUES
Suivre chaque item de cette checklist et cocher au fur et à mesure.

### 4. TESTS UTILISATEUR RÉEL
- [ ] Demander à 3 personnes de tester le parcours complet
- [ ] Noter leurs retours et problèmes rencontrés
- [ ] Corriger les problèmes identifiés

---

## ✅ VALIDATION FINALE

### CRITÈRES DE RÉUSSITE
- [ ] **95% des tests manuels réussis**
- [ ] **0 erreurs console critiques**
- [ ] **Performance Lighthouse > 75**
- [ ] **Fonctionnalités e-commerce 100% opérationnelles**
- [ ] **Mobile responsive parfait**

### CHECKLIST DÉPLOIEMENT
- [ ] Build production réussi (`npm run build`)
- [ ] Tests production passés
- [ ] Variables d'environnement configurées
- [ ] Domaine pointé vers Vercel/Netlify
- [ ] SSL activé
- [ ] Analytics configurés avec vrais IDs
- [ ] Supervisee monitoring en place

---

## 🚨 PROBLÈMES COURANTS À VÉRIFIER

### Performance
- Images non optimisées
- Bundle trop lourd
- Requêtes non optimisées
- Cache mal configuré

### Mobile
- Viewport mal configuré
- Boutons trop petits
- Navigation complexe
- Formulaires non adaptés

### E-commerce
- Validation insuffisante
- États loading manquants
- Messages d'erreur confus
- Panier non persistant

### Analytics
- IDs non configurés
- Events mal trackés
- Pixels non chargés

---

**⏱️ TEMPS ESTIMÉ : 2-3 heures pour tests complets**

**🎯 OBJECTIF : 0 bug critique avant déploiement**
