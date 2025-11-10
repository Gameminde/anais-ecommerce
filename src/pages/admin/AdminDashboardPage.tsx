import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  recentOrders: any[];
  monthlyRevenue: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use direct database queries instead of Edge Functions
      // TODO: Switch back to Edge Functions once deployed

      // Get basic stats
      const [
        { count: totalOrders },
        { data: revenueData },
        { count: pendingOrders },
        { count: totalProducts }
      ] = await Promise.all([
        // Total orders
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        // Total revenue from delivered orders
        supabase.from('orders').select('total_amount_dzd').eq('order_status', 'delivered'),
        // Pending orders
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'pending'),
        // Total products
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true)
      ]);

      // Get recent orders separately to avoid join issues
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount_dzd, order_status, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;

      // Get user profiles separately
      const userIds = ordersData?.map(o => o.user_id).filter(id => id) || [];
      let profilesMap = new Map();

      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (!profilesError && profilesData) {
          profilesMap = new Map(profilesData.map(p => [p.id, p]));
        }
      }

      const recentOrders = ordersData?.map(order => {
        const profile = profilesMap.get(order.user_id);
        return {
          ...order,
          customer: profile ? {
            ...profile,
            first_name: profile.full_name.split(' ')[0] || '',
            last_name: profile.full_name.split(' ').slice(1).join(' ') || '',
            email: '' // Not available in profiles table
          } : null,
          user_id: undefined
        };
      }) || [];

      // Calculate total revenue
      const totalRevenue = revenueData?.reduce((sum: number, order: any) => sum + (order.total_amount_dzd || 0), 0) || 0;

      // Mock monthly revenue data (you can implement real monthly stats later)
      const monthlyRevenue = [
        { month: 'Jan', revenue: 15000 },
        { month: 'Fév', revenue: 18000 },
        { month: 'Mar', revenue: 22000 },
        { month: 'Avr', revenue: 19000 },
        { month: 'Mai', revenue: 25000 },
        { month: 'Jun', revenue: 28000 }
      ];

      setStats({
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders || 0,
        totalProducts: totalProducts || 0,
        recentOrders: recentOrders || [],
        monthlyRevenue: monthlyRevenue
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur de chargement
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Commandes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.totalOrders || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Chiffre d'Affaires
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(stats?.totalRevenue || 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Commandes en Attente
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.pendingOrders || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">🏪</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Produits
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats?.totalProducts || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Commandes Récentes
            </h3>
            <div className="space-y-4">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm">📋</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Commande #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.order_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.order_status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : order.order_status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucune commande récente
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Chiffre d'Affaires Mensuel
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Graphique en cours de développement
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
