import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { WILAYAS, validateAlgerianPhone, formatAlgerianPhone, calculateDeliveryFee } from '../lib/constants';
// Select component removed - using native select
// Analytics utils removed - using direct tracking

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // États pour les adresses sauvegardées
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  // États pour le formulaire de livraison rapide
  const [useQuickForm, setUseQuickForm] = useState(true);
  const [quickForm, setQuickForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    wilaya: '',
    commune: '',
    address: '',
    postal_code: '',
    delivery_notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Logique améliorée pour le calcul des frais de livraison
  const selectedProvince = useMemo(() => {
    if (selectedAddress) {
      // Adresse sauvegardée sélectionnée
      const addr = addresses.find(addr => addr.id === selectedAddress);
      return addr?.province || '';
    } else {
      // Formulaire rapide
      return quickForm.wilaya;
    }
  }, [selectedAddress, addresses, quickForm.wilaya]);

  const deliveryFee = useMemo(() => {
    return calculateDeliveryFee(selectedProvince, cartTotal);
  }, [selectedProvince, cartTotal]);

  const total = cartTotal + deliveryFee;

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  useEffect(() => {
    // Analytics removed - trackEvent('initiate_checkout', { total: cartTotal, itemCount: cartItems.length })
  }, [cartItems, cartTotal]);

  const loadAddresses = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id);

    if (data) setAddresses(data);
  };

  const handleQuickFormChange = (field: string, value: string) => {
    setQuickForm(prev => ({ ...prev, [field]: value }));

    // Supprimer l'erreur quand l'utilisateur commence à taper
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Formatage automatique du téléphone
    if (field === 'phone') {
      const formatted = formatAlgerianPhone(value);
      if (formatted !== value) {
        setQuickForm(prev => ({ ...prev, phone: formatted }));
      }
    }
  };

  const validateQuickForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Validation du nom complet
    if (!quickForm.full_name.trim()) {
      errors.full_name = 'Le nom complet est obligatoire';
    } else if (quickForm.full_name.trim().length < 2) {
      errors.full_name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation du téléphone
    if (!quickForm.phone.trim()) {
      errors.phone = 'Le numéro de téléphone est obligatoire';
    } else if (!validateAlgerianPhone(quickForm.phone)) {
      errors.phone = 'Numéro invalide. Format accepté : 06XX XX XX XX';
    }

    // Validation de l'email (optionnel mais si fourni, doit être valide)
    if (quickForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quickForm.email.trim())) {
      errors.email = 'Adresse email invalide';
    }

    // Validation de la wilaya
    if (!quickForm.wilaya) {
      errors.wilaya = 'Veuillez sélectionner une wilaya';
    }

    // Validation de la commune
    if (!quickForm.commune.trim()) {
      errors.commune = 'La commune est obligatoire';
    }

    // Validation de l'adresse
    if (!quickForm.address.trim()) {
      errors.address = 'L\'adresse complète est obligatoire';
    }

    return errors;
  };

  const handlePlaceOrder = async () => {
    // Vérifier qu'il y a des articles dans le panier
    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    // Validation selon le mode choisi
    if (useQuickForm) {
      const validationErrors = validateQuickForm();
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        // Focus sur le premier champ avec erreur
        const firstErrorField = Object.keys(validationErrors)[0];
        const element = document.getElementById(`field-${firstErrorField}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
        return;
      }
    } else {
      if (!selectedAddress) {
        alert('Veuillez sélectionner une adresse ou utiliser le formulaire rapide');
        return;
      }
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      let requestBody;

      if (useQuickForm) {
        // Utiliser la nouvelle Edge Function pour créer la commande complète
        requestBody = {
          userId: user?.id,
          fullName: quickForm.full_name,
          phone: quickForm.phone,
          email: quickForm.email,
          wilaya: quickForm.wilaya,
          commune: quickForm.commune,
          address: quickForm.address,
          postalCode: quickForm.postal_code,
          deliveryNotes: quickForm.delivery_notes,
          items: cartItems.map(item => ({
            productId: item.product?.id,
            quantity: item.quantity,
            price: item.product?.price_dzd || 0,
            size: item.size,
            color: item.color
          })),
          subtotal: cartTotal,
          shippingFee: deliveryFee
        };
      } else {
        // Pour les adresses sauvegardées, récupérer les données de l'adresse
        const selectedAddr = addresses.find(addr => addr.id === selectedAddress);
        if (!selectedAddr) {
          throw new Error('Adresse sélectionnée introuvable');
        }

        requestBody = {
          userId: user?.id,
          shippingAddressId: selectedAddress,
          fullName: selectedAddr.full_name,
          phone: selectedAddr.phone,
          email: '', // Pas stocké dans addresses
          wilaya: selectedAddr.province,
          commune: selectedAddr.city,
          address: selectedAddr.address_line1,
          postalCode: selectedAddr.postal_code,
          deliveryNotes: '', // Sera ajouté si nécessaire
          items: cartItems.map(item => ({
            productId: item.product?.id,
            quantity: item.quantity,
            price: item.product?.price_dzd || 0,
            size: item.size,
            color: item.color
          })),
          subtotal: cartTotal,
          shippingFee: deliveryFee
        };
      }

      // TEMPORARY: Create order directly via REST API instead of Edge Function
      console.log('🛒 Creating order directly via REST API...');
      console.log('📋 Request body:', requestBody);
      console.log('👤 User ID:', user?.id);
      console.log('🔑 Session exists:', !!session?.access_token);

      // Validation des données requises
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }
      if (!session?.access_token) {
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      // Rafraîchir la session si elle risque d'être expirée
      try {
        const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
        if (error) {
          console.warn('Session refresh failed:', error);
        } else if (refreshedSession) {
          console.log('✅ Session refreshed');
          // Utiliser le nouveau token si disponible
          if (refreshedSession.access_token) {
            // Mettre à jour les headers avec le nouveau token
            // Note: Les variables locales utilisent déjà session?.access_token
          }
        }
      } catch (refreshError) {
        console.warn('Session refresh error:', refreshError);
        // Continuer avec le token actuel
      }

      // 1. Create address if needed
      let addressId = requestBody.shippingAddressId;

      if (!addressId) {
        console.log('🏠 Creating new address...');

        const addressData = {
          user_id: user?.id,
          full_name: requestBody.fullName,
          phone: requestBody.phone,
          address_line1: requestBody.address,
          city: requestBody.commune,
          province: requestBody.wilaya,
          postal_code: requestBody.postalCode || null,
          is_default: false
        };

        console.log('📤 Address data to send:', addressData);

        // Validation des données d'adresse
        if (!addressData.user_id || !addressData.full_name || !addressData.address_line1 || !addressData.city || !addressData.province) {
          throw new Error('Données d\'adresse incomplètes. Champs requis: nom, adresse, ville, wilaya');
        }

        const addressResponse = await fetch(
          `https://zvyhuqkyeyzkjdvafdkx.supabase.co/rest/v1/addresses`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify(addressData),
          }
        );

        console.log('📡 Address response status:', addressResponse.status);
        console.log('📡 Address response headers:', Object.fromEntries(addressResponse.headers.entries()));

        const addressText = await addressResponse.text();
        console.log('📡 Address response body:', addressText);

        if (!addressResponse.ok) {
          const error = await addressResponse.text();
          console.error('Address creation failed:', error);

          // Vérifier si c'est une erreur d'authentification
          if (addressResponse.status === 401) {
            throw new Error('Session expirée. Veuillez vous reconnecter.');
          }

          throw new Error('Erreur lors de la création de l\'adresse');
        }

        // Pour les créations, Supabase peut retourner un corps vide avec un statut 201
        const addressResult = await addressResponse.json().catch(() => {
          console.log('⚠️ Corps de réponse vide, tentative de récupération de l\'adresse créée...');
          return null;
        });

        if (addressResult && addressResult[0]?.id) {
          addressId = addressResult[0]?.id;
        } else {
          // Si pas d'ID dans la réponse, récupérer l'adresse la plus récente pour cet utilisateur
          console.log('🔍 Récupération de l\'adresse la plus récente...');
          const recentAddressResponse = await fetch(
            `https://zvyhuqkyeyzkjdvafdkx.supabase.co/rest/v1/addresses?user_id=eq.${user?.id}&order=created_at.desc&limit=1`,
            {
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo',
                'Authorization': `Bearer ${session?.access_token}`,
              },
            }
          );

          if (recentAddressResponse.ok) {
            const recentAddresses = await recentAddressResponse.json().catch(() => []);
            if (recentAddresses.length > 0) {
              addressId = recentAddresses[0].id;
              console.log('✅ Adresse récupérée:', addressId);
            } else {
              throw new Error('Aucune adresse trouvée pour cet utilisateur');
            }
          } else {
            throw new Error('Impossible de récupérer l\'adresse créée');
          }
        }

        if (!addressId) {
          throw new Error('Impossible de récupérer l\'ID de l\'adresse créée');
        }
        console.log('✅ Address created:', addressId);
      }

      // 2. Generate order number
      console.log('🔢 Generating order number...');
      const orderSeqResponse = await fetch(
        `https://zvyhuqkyeyzkjdvafdkx.supabase.co/rest/v1/orders?select=order_number&order=created_at.desc&limit=1`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo',
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );

      let nextNumber = 1;
      if (orderSeqResponse.ok) {
        const lastOrders = await orderSeqResponse.json().catch(() => []);
        if (lastOrders.length > 0 && lastOrders[0]?.order_number) {
          const match = lastOrders[0].order_number.match(/ORD-(\d+)/);
          if (match) {
            nextNumber = parseInt(match[1]) + 1;
          }
        }
      }

      const orderNumber = `ORD-${String(nextNumber).padStart(6, '0')}`;
      console.log('📋 Order number:', orderNumber);

      // 3. Create order
      console.log('📝 Creating order...');
      const orderResponse = await fetch(
        `https://zvyhuqkyeyzkjdvafdkx.supabase.co/rest/v1/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            order_number: orderNumber,
            user_id: user?.id,
            shipping_address_id: addressId,
            total_amount_dzd: total,
            delivery_fee_dzd: deliveryFee,
            payment_method: 'cod',
            payment_status: 'pending',
            order_status: 'pending',
            notes: requestBody.deliveryNotes || null,
          }),
        }
      );

      if (!orderResponse.ok) {
        const error = await orderResponse.text();
        console.error('Order creation failed:', error);

        // Vérifier si c'est une erreur d'authentification
        if (orderResponse.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        throw new Error('Erreur lors de la création de la commande');
      }

      // Gestion similaire pour la commande
      const orderData = await orderResponse.json().catch(() => {
        console.log('⚠️ Corps de réponse de commande vide, tentative de récupération...');
        return null;
      });

      let orderId: string;
      if (orderData && orderData[0]?.id) {
        orderId = orderData[0]?.id;
      } else {
        // Si pas d'ID dans la réponse, récupérer la commande la plus récente pour cet utilisateur
        console.log('🔍 Récupération de la commande la plus récente...');
        const recentOrderResponse = await fetch(
          `https://zvyhuqkyeyzkjdvafdkx.supabase.co/rest/v1/orders?user_id=eq.${user?.id}&order=created_at.desc&limit=1`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo',
              'Authorization': `Bearer ${session?.access_token}`,
            },
          }
        );

        if (recentOrderResponse.ok) {
          const recentOrders = await recentOrderResponse.json().catch(() => []);
          if (recentOrders.length > 0) {
            orderId = recentOrders[0].id;
            console.log('✅ Commande récupérée:', orderId);
          } else {
            throw new Error('Aucune commande trouvée pour cet utilisateur');
          }
        } else {
          throw new Error('Impossible de récupérer la commande créée');
        }
      }

      if (!orderId) {
        throw new Error('Impossible de récupérer l\'ID de la commande créée');
      }
      console.log('✅ Order created:', orderId);

      // 4. Create order items
      console.log('🛒 Creating order items...');
      console.log('📦 Raw items:', requestBody.items);

      const orderItemsData = requestBody.items.map((item: any) => ({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price_dzd: item.price,
        size: item.size || null,
        color: item.color || null,
      }));

      console.log('📋 Processed items data:', orderItemsData);

      // Validation des données d'articles
      if (!orderItemsData.length) {
        throw new Error('Aucun article dans la commande');
      }

      for (const item of orderItemsData) {
        if (!item.product_id || !item.quantity || item.price_dzd === undefined) {
          throw new Error('Données d\'article incomplètes');
        }
      }

      const itemsResponse = await fetch(
        `https://zvyhuqkyeyzkjdvafdkx.supabase.co/rest/v1/order_items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(orderItemsData),
        }
      );

      if (!itemsResponse.ok) {
        const error = await itemsResponse.text();
        console.error('Order items creation failed:', error);

        // Vérifier si c'est une erreur d'authentification
        if (itemsResponse.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        throw new Error('Erreur lors de l\'ajout des articles');
      }

      // Vérifier que les articles ont été créés (pas nécessaire de parser le JSON ici)
      console.log('✅ Order items created');

      // Analytics removed - trackEvent('purchase', { orderId, total, items: cartItems })

      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error('Order error:', error);

      let errorMessage = 'Erreur lors de la commande';

      if (error instanceof Error) {
        if (error.message.includes('Session expirée') || error.message.includes('reconnecter')) {
          errorMessage = 'Votre session a expiré. Veuillez vous reconnecter et réessayer.';
          // Rediriger vers la page de connexion après un court délai
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Erreur de communication avec le serveur. Veuillez réessayer.';
        } else {
          errorMessage = error.message;
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-6">Finaliser la commande</h1>

          {/* Récapitulatif de commande */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Récapitulatif de commande</h2>
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{item.product?.name_en} x{item.quantity}</span>
                <span>{item.product?.price_dzd} DA</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{cartTotal} DA</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison:</span>
                <span>{deliveryFee} DA</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{total} DA</span>
              </div>
            </div>
          </div>

          {/* Adresse de livraison */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Adresse de livraison</h2>

            {/* Options de livraison */}
            <div className="mb-4">
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryOption"
                    checked={!useQuickForm}
                    onChange={() => {
                      setUseQuickForm(false);
                      setSelectedAddress('');
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">Utiliser une adresse sauvegardée</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryOption"
                    checked={useQuickForm}
                    onChange={() => {
                      setUseQuickForm(true);
                      setSelectedAddress('');
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">Saisir une nouvelle adresse</span>
                </label>
            </div>
          </div>

            {!useQuickForm ? (
              // Adresses sauvegardées
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-500 mb-4">Aucune adresse sauvegardée</p>
                ) : (
                  addresses.map(addr => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`p-4 border rounded-lg mb-3 cursor-pointer ${
                  selectedAddress === addr.id ? 'border-yellow-500 bg-yellow-50' : ''
                }`}
              >
                <p className="font-semibold">{addr.full_name}</p>
                <p className="text-sm text-gray-600">{addr.address_line1}, {addr.city}</p>
              </div>
                  ))
                )}

            <button
              onClick={() => navigate('/account/addresses?fromCheckout=true')}
              className="mt-3 py-2 border-2 border-dashed border-gray-300 rounded-md w-full text-gray-500 hover:border-yellow-500 hover:text-yellow-500"
            >
              + Ajouter une adresse
            </button>
          </div>
            ) : (
              /* Formulaire de livraison complet */
              <div className="space-y-6">
                {/* Informations client */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informations client</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom complet *
                      </label>
                      <input
                        id="field-full_name"
                        type="text"
                        value={quickForm.full_name}
                        onChange={(e) => handleQuickFormChange('full_name', e.target.value)}
                        className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base ${
                          formErrors.full_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Ahmed Ben Ali"
                      />
                      {formErrors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de téléphone *
                      </label>
                      <input
                        id="field-phone"
                        type="tel"
                        value={quickForm.phone}
                        onChange={(e) => handleQuickFormChange('phone', e.target.value)}
                        className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base ${
                          formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 0555123456 ou +21355123456"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Formats acceptés: 05XXXXXXXX, +2135XXXXXXXX, 002135XXXXXXXX
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email (optionnel)
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      value={quickForm.email}
                      onChange={(e) => handleQuickFormChange('email', e.target.value)}
                      className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base ${
                        formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="votre@email.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse de livraison</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Wilaya *
                      </label>
                      <select
                        value={quickForm.wilaya}
                        onChange={(e) => handleQuickFormChange('wilaya', e.target.value)}
                        required={true}
                        className={`w-full px-3 py-2 border rounded-md text-base ${formErrors.wilaya ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Sélectionnez votre wilaya</option>
                        {WILAYAS.map(w => (
                          <option key={w.code} value={w.code}>
                            {w.code} - {w.name}
                          </option>
                        ))}
                      </select>
        </div>

        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commune/Daira *
                      </label>
                      <input
                        id="field-commune"
                        type="text"
                        value={quickForm.commune}
                        onChange={(e) => handleQuickFormChange('commune', e.target.value)}
                        className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base ${
                          formErrors.commune ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Alger Centre, Oran Ville"
                      />
                      {formErrors.commune && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.commune}</p>
                      )}
                    </div>
            </div>

            <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse complète *
                    </label>
                    <textarea
                      id="field-address"
                      value={quickForm.address}
                      onChange={(e) => handleQuickFormChange('address', e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base resize-none ${
                        formErrors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Cité 200 logements, Bloc A, N°12, Étage 3, Porte 5&#10;Précisez les points de repère si nécessaire"
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Plus l'adresse est détaillée, plus la livraison sera facile et rapide
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal (optionnel)
                      </label>
                      <input
                        type="text"
                        value={quickForm.postal_code}
                        onChange={(e) => handleQuickFormChange('postal_code', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base"
                        placeholder="Ex: 16000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructions de livraison (optionnel)
                      </label>
                      <input
                        type="text"
                        value={quickForm.delivery_notes}
                        onChange={(e) => handleQuickFormChange('delivery_notes', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base"
                        placeholder="Ex: Sonner à la porte rouge"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Paiement */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Paiement</h2>
            <div className="border-2 border-green-500 bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">💰 Paiement à la livraison</h3>
              <p className="text-sm text-green-700 mt-1">En espèces à réception de la commande</p>
            </div>
            </div>

            <button
              onClick={handlePlaceOrder}
            disabled={loading || (!selectedAddress && !useQuickForm)}
              className="w-full bg-yellow-500 text-white py-3 rounded-md font-bold disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Passer la commande'}
            </button>
        </div>
      </div>
    </div>
  );
}
