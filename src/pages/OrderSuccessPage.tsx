import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
        <p className="text-gray-600 mb-2">
          Votre commande <strong>#{id}</strong> a été enregistrée.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Paiement à la livraison. Vous recevrez un email de confirmation.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-yellow-500 text-white px-6 py-2 rounded-md"
        >
          Continuer vos achats
        </button>
      </div>
    </div>
  );
}

