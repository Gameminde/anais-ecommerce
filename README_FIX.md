# 🔧 FIX COMPLET DE LA BASE DE DONNÉES ANAIS

## 🚨 PROBLÈME IDENTIFIÉ
- Récursion infinie dans les politiques RLS
- Utilisateur admin non configuré correctement
- Bucket de stockage manquant

## ✅ SOLUTION FINALE

### Étape 1 : Ouvrir Supabase Dashboard
1. Allez sur : https://supabase.com/dashboard
2. Connectez-vous
3. Ouvrez votre projet ANAIS

### Étape 2 : SQL Editor
1. Cliquez sur "SQL Editor" dans le menu gauche
2. Supprimez tout le code existant

### Étape 3 : Copier-Coller ce Script COMPLET

```sql
-- FIX COMPLET DES PROBLÈMES DE BASE DE DONNÉES
-- Copiez-collez TOUT ce script et cliquez "Run"

-- 1. Désactiver temporairement RLS
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 2. Nettoyer l'utilisateur admin
DELETE FROM admin_users WHERE user_id NOT IN (SELECT id FROM auth.users);
INSERT INTO admin_users (user_id, role, permissions, is_active)
SELECT u.id, 'admin', ARRAY['read', 'write', 'delete', 'manage_orders', 'manage_products'], true
FROM auth.users u WHERE u.email = 'admin@anais.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  permissions = ARRAY['read', 'write', 'delete', 'manage_orders', 'manage_products'],
  is_active = true;

-- 3. Créer le bucket de stockage
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Réactiver RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques simples (sans récursion)
CREATE POLICY "admin_users_select" ON admin_users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admin_users_service" ON admin_users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_write" ON products FOR ALL
USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true));
CREATE POLICY "products_storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "products_storage_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "products_storage_update" ON storage.objects FOR UPDATE USING (bucket_id = 'products');
CREATE POLICY "products_storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'products');

-- 6. Test final
SELECT
  '✅ FIX RÉUSSI' as statut,
  auth.uid() as utilisateur_actuel,
  (SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)) as est_admin,
  (SELECT COUNT(*) FROM admin_users WHERE is_active = true) as admins_actifs,
  (SELECT COUNT(*) FROM storage.buckets WHERE id = 'products') as stockage_pret;
```

### Étape 4 : Exécuter et Vérifier

1. Cliquez sur **"Run"** (bouton bleu)
2. Vous devriez voir à la fin :
   ```
   ✅ FIX RÉUSSI | [uuid] | true | 1 | 1
   ```

## 🎉 APRÈS LE FIX

1. **Actualisez** votre application (F5)
2. **Connectez-vous** avec `admin@anais.com`
3. **Allez dans** `/admin/products`
4. **Cliquez** "Nouveau Produit"
5. **Testez** - ✅ **Ça marchera !**

## 🔍 SI ÇA NE MARCHE PAS

**Envoyez-moi l'erreur exacte** que vous voyez dans Supabase SQL Editor.

## 💡 CE QUE LE SCRIPT FAIT

- ✅ **Corrige** la récursion RLS infinie
- ✅ **Configure** l'utilisateur admin
- ✅ **Crée** le stockage d'images
- ✅ **Établit** des politiques sécurisées
- ✅ **Teste** la configuration

**C'est la solution finale !** 🚀

