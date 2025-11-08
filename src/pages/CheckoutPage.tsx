import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, total: cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 400;
  const total = cartTotal + deliveryFee;

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id);
    if (data) setAddresses(data);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Veuillez sélectionner une adresse');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            address_id: selectedAddress,
            payment_method: 'cod',
            notes: '',
          }),
        }
      );

      const { order_id } = await response.json();
      clearCart();
      navigate(`/order-success/${order_id}`);
    } catch (error) {
      alert('Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Finaliser la commande</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
            {items.map(item => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>{item.price * item.quantity} DZD</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>{cartTotal} DZD</span>
            </div>
          </div>

          {/* Address Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
            {addresses.map(addr => (
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
            ))}

            <button
              onClick={() => navigate('/account/addresses?fromCheckout=true')}
              className="mt-3 py-2 border-2 border-dashed border-gray-300 rounded-md w-full text-gray-500 hover:border-yellow-500 hover:text-yellow-500"
            >
              + Ajouter une adresse
            </button>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Paiement</h2>
            <div className="border-2 border-green-500 bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-green-900">💰 Paiement à la livraison</h3>
              <p className="text-sm text-green-700 mt-1">En espèces à réception</p>
            </div>

            <div className="mb-4">
              <p className="flex justify-between mb-2">
                <span>Sous-total</span>
                <span>{cartTotal} DZD</span>
              </p>
              <p className="flex justify-between mb-2">
                <span>Livraison</span>
                <span>{deliveryFee} DZD</span>
              </p>
              <p className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>{total} DZD</span>
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full bg-yellow-500 text-white py-3 rounded-md font-bold disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Passer la commande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
