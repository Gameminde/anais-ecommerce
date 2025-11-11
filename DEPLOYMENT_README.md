# 🚀 Guide de Déploiement ANAIS E-commerce sur Netlify

## 📋 Prérequis

Avant de déployer, assurez-vous d'avoir :

1. **Repository GitHub** : https://github.com/Gameminde/anais-ecommerce
2. **Variables d'environnement** prêtes
3. **Accès Netlify** configuré

## 🔐 Variables d'Environnement Nécessaires

Ajoutez ces variables dans **Netlify Dashboard > Site Settings > Environment Variables** :

```bash
VITE_SUPABASE_URL=https://zvyhuqkyeyzkjdvafdkx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI
```

## 🎯 Méthodes de Déploiement

### Méthode 1: Via Netlify Dashboard (Recommandée)

1. **Connectez-vous** sur [Netlify](https://app.netlify.com)
2. **Cliquez** "Add new site" > "Import an existing project"
3. **Sélectionnez** "Deploy with GitHub"
4. **Autorisez** l'accès au repository `Gameminde/anais-ecommerce`
5. **Configurez** :
   - **Branch**: `master`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Ajoutez** les variables d'environnement
7. **Cliquez** "Deploy site"

### Méthode 2: Via Netlify CLI (Automatisé)

```bash
# Installation du CLI
npm install -g netlify-cli

# Connexion à Netlify
netlify login

# Déploiement depuis le repository
netlify init

# Ou déploiement manuel
netlify deploy --prod --dir=dist
```

### Méthode 3: Via API Netlify (Programmatique)

Utilisation d'un **Personal Access Token** pour déploiement automatisé.

## ⚙️ Configuration Netlify

### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18.x

### Environment Variables
```
VITE_SUPABASE_URL=https://zvyhuqkyeyzkjdvafdkx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI
```

### Headers de Sécurité (Automatiquement configurés)
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### Cache Optimisé
- Assets statiques: Cache 1 an
- JS/CSS: Cache 1 an avec immutable
- Manifest: Cache 1 heure

## 🔍 Vérification Post-Déploiement

Après déploiement, vérifiez :

### ✅ Fonctionnalités Core
- [ ] Page d'accueil se charge
- [ ] Navigation fonctionne
- [ ] Boutique affiche les produits
- [ ] Détail produit avec galeries
- [ ] Authentification utilisateur
- [ ] Panier et checkout

### ✅ Dashboard Admin
- [ ] Accès admin (admin@anais.com)
- [ ] Gestion des produits
- [ ] Gestion des commandes
- [ ] Interface responsive

### ✅ Performance
- [ ] Temps de chargement < 3s
- [ ] Images s'affichent correctement
- [ ] PWA s'installe sur mobile

### ✅ Sécurité
- [ ] HTTPS activé
- [ ] Headers de sécurité présents
- [ ] Pas d'erreurs console

## 🐛 Dépannage

### Problème: Build échoue
```bash
# Vérifier les logs de build
netlify logs

# Tester le build localement
npm run build
```

### Problème: Variables d'environnement
```bash
# Vérifier dans Netlify Dashboard
Site Settings > Environment Variables
```

### Problème: Images ne s'affichent pas
- Vérifier les URLs Supabase Storage
- Contrôler les politiques RLS
- Vérifier les CORS headers

### Problème: Authentification ne fonctionne pas
- Vérifier les variables d'environnement
- Contrôler la configuration Supabase
- Vérifier les URLs de redirection

## 📞 Support

Pour tout problème de déploiement :
1. **Consultez** les logs de build Netlify
2. **Vérifiez** les variables d'environnement
3. **Testez** localement avec `npm run build`
4. **Contactez** l'équipe technique si nécessaire

## 🎯 Status de Prêt

- [x] **Code source** optimisé et testé
- [x] **Configuration Netlify** prête
- [x] **Variables d'environnement** documentées
- [x] **Headers de sécurité** configurés
- [x] **Cache optimisé** configuré
- [x] **Documentation** complète

**🚀 PRÊT POUR DÉPLOIEMENT IMMÉDIAT !**

---
*Document généré automatiquement - Version Production Finale*
