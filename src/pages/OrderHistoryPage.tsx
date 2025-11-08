import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-orders`,
      {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      }
    );

    const { orders } = await response.json();
    setOrders(orders || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Historique des commandes</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between mb-2">
              <p className="font-semibold">Commande #{order.id}</p>
              <p className="text-sm text-gray-500">{order.created_at?.split('T')[0]}</p>
            </div>
            <p className="text-sm mb-2">Total: {order.total_amount} DZD</p>
            <p className="text-sm mb-4">Statut: {order.status}</p>
            <button className="text-yellow-500 text-sm">
              Voir les détails →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
