import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
// Analytics utils removed - using direct tracking

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const deliveryFee = 400;
  const total = cartTotal + deliveryFee;

  useEffect(() => {
    // Analytics removed - trackEvent('initiate_checkout', { total: cartTotal, itemCount: cartItems.length })
  }, [cartItems, cartTotal]);

  const handleCheckout = async () => {
    // Version simplifiée temporaire
    alert('Checkout temporaire - Fonctionnalité en cours de développement');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

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

          <button
            onClick={handleCheckout}
            className="w-full bg-yellow-500 text-white py-3 rounded-md font-bold hover:bg-yellow-600"
          >
            Passer la commande (Temporaire)
          </button>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Fonctionnalité complète en cours de développement
          </p>
        </div>
      </div>
    </div>
  );
}
