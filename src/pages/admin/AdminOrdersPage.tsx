import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  delivery_fee_dzd: number;
  payment_method: string;
  order_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  shipping_address: any;
  items: Array<{
    id: string;
    quantity: number;
    price_dzd: number;
    size?: string;
    color?: string;
    product?: {
      name_en: string;
      name_fr?: string;
      sku?: string;
      product_images?: Array<{
        id: string;
        image_url: string;
        is_primary: boolean;
        display_order: number;
      }>;
    };
  }>;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, searchTerm, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use separate queries to avoid join issues
      // First get orders
      let ordersQuery = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit - 1);

      // Apply filters
      if (selectedStatus) {
        ordersQuery = ordersQuery.eq('order_status', selectedStatus);
      }

      if (searchTerm) {
        ordersQuery = ordersQuery.or(`order_number.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }

      const { data: ordersData, error: ordersError, count } = await ordersQuery;

      if (ordersError) throw ordersError;

      // Get unique user IDs, address IDs, and order IDs
      const userIds = ordersData?.map(o => o.user_id).filter(id => id) || [];
      const addressIds = ordersData?.map(o => o.shipping_address_id).filter(id => id) || [];
      const orderIds = ordersData?.map(o => o.id) || [];

      // Get profiles, addresses, and order items separately
      let profilesMap = new Map();
      let addressesMap = new Map();
      let orderItemsMap = new Map();

      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (!profilesError && profilesData) {
          profilesMap = new Map(profilesData.map(profile => [profile.id, profile]));
        }
      }

      if (addressIds.length > 0) {
        const { data: addressesData, error: addressesError } = await supabase
          .from('addresses')
          .select('*')
          .in('id', addressIds);

        if (!addressesError && addressesData) {
          addressesMap = new Map(addressesData.map(address => [address.id, address]));
        }
      }

      // Get order items with product details
      if (orderIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            order_id,
            product_id,
            quantity,
            price_dzd,
            size,
            color,
            products (
              name_en,
              name_fr,
              sku,
              product_images (
                id,
                image_url,
                is_primary,
                display_order
              )
            )
          `)
          .in('order_id', orderIds);

        if (!itemsError && itemsData) {
          // Group items by order_id
          const groupedItems = itemsData.reduce((acc, item) => {
            if (!acc[item.order_id]) {
              acc[item.order_id] = [];
            }
            acc[item.order_id].push({
              ...item,
              product: item.products || {}
            });
            return acc;
          }, {});

          orderItemsMap = new Map(Object.entries(groupedItems));
        }
      }

      // Transform data
      const transformedOrders = ordersData?.map(order => {
        const profile = profilesMap.get(order.user_id);
        const orderItems = orderItemsMap.get(order.id) || [];

        return {
          ...order,
          customer: profile ? {
            ...profile,
            first_name: profile.full_name.split(' ')[0] || '',
            last_name: profile.full_name.split(' ').slice(1).join(' ') || '',
            email: '', // Not available in profiles table
            phone: '' // Not available in profiles table
          } : null,
          shipping_address: addressesMap.get(order.shipping_address_id) || null,
          items: orderItems
        };
      }) || [];

      setOrders(transformedOrders);
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pagination.limit)
      }));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          order_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh orders
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Erreur lors de la mise à jour du statut de la commande');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const allStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <input
                type="text"
                placeholder="Nom, email du client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-anais-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-anais-gold"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="preparing">En préparation</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anais-gold mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des commandes...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">❌</div>
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande & Produits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client & Adresse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant & Paiement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statuts & Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        {/* Commande & Produits */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-gray-900">
                                #{order.order_number || order.id.slice(-8)}
                              </span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                {order.items?.length || 0} article{order.items?.length !== 1 ? 's' : ''}
                              </span>
                            </div>

                            {/* Produits avec images */}
                            <div className="space-y-2">
                              {order.items?.slice(0, 2).map((item, index) => (
                                <div key={item.id} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-md">
                                  {/* Image du produit */}
                                  {item.product?.product_images && item.product.product_images.length > 0 && (
                                    <div className="w-8 h-8 flex-shrink-0">
                                      <img
                                        src={item.product.product_images.find(img => img.is_primary)?.image_url ||
                                             item.product.product_images[0]?.image_url}
                                        alt={item.product.name_en}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                  )}

                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-gray-900 truncate">
                                      {item.product?.name_en}
                                    </div>
                                    <div className="flex items-center space-x-1 mt-1">
                                      <span className="text-xs text-gray-600">Qté: {item.quantity}</span>
                                      {item.size && (
                                        <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs">
                                          T: {item.size}
                                        </span>
                                      )}
                                      {item.color && (
                                        <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs">
                                          C: {item.color}
                                        </span>
                                      )}
                                      {item.product?.sku && (
                                        <span className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs">
                                          SKU: {item.product.sku}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {order.items && order.items.length > 2 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{order.items.length - 2} autres produits...
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Client & Adresse */}
                        <td className="px-6 py-4 max-w-xs">
                          {order.customer ? (
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900">
                                {order.customer.first_name} {order.customer.last_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                📧 {order.customer.email}
                              </div>
                              {order.customer.phone && (
                                <div className="text-xs text-gray-500">
                                  📱 {order.customer.phone}
                                </div>
                              )}

                              {/* Adresse de livraison */}
                              {order.shipping_address && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="text-xs text-gray-600 font-medium mb-1">Adresse de livraison:</div>
                                  <div className="text-xs text-gray-500">
                                    {order.shipping_address.address_line1}
                                    {order.shipping_address.city && `, ${order.shipping_address.city}`}
                                    {order.shipping_address.province && ` (${order.shipping_address.province})`}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Client inconnu</span>
                          )}
                        </td>

                        {/* Montant & Paiement */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-gray-900">
                              {formatCurrency(order.total_amount)}
                            </div>
                            <div className="text-xs text-gray-600">
                              Produits: {formatCurrency(order.total_amount - (order.delivery_fee_dzd || 0))}
                            </div>
                            <div className="text-xs text-gray-600">
                              Livraison: {formatCurrency(order.delivery_fee_dzd || 0)}
                            </div>

                            {/* Méthode de paiement */}
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                💳 {order.payment_method === 'cod' ? 'Paiement à la livraison' : order.payment_method}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Statuts & Dates */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {/* Statut commande */}
                            <div>
                              <select
                                value={order.order_status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(order.order_status)}`}
                              >
                                <option value={order.order_status} disabled>
                                  {order.order_status}
                                </option>
                                {getStatusOptions(order.order_status).map(status => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Statut paiement */}
                            <div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                                {order.payment_status}
                              </span>
                            </div>

                            {/* Dates */}
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>📅 Créée: {formatDate(order.created_at)}</div>
                              {order.updated_at !== order.created_at && (
                                <div>🔄 Modifiée: {formatDate(order.updated_at)}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="space-y-1">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-anais-gold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              📋 Voir détails
                            </Link>

                            {/* Actions rapides */}
                            <div className="flex space-x-1 mt-1">
                              <button
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                disabled={order.order_status === 'confirmed'}
                                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                              >
                                ✓ Confirmer
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                disabled={order.order_status === 'shipped' || order.order_status === 'delivered'}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                              >
                                🚚 Expédier
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de{' '}
                        <span className="font-medium">
                          {(pagination.page - 1) * pagination.limit + 1}
                        </span>{' '}
                        à{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        sur{' '}
                        <span className="font-medium">{pagination.total}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          ‹
                        </button>
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, pagination.page - 2) + i;
                          if (pageNum > pagination.totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === pagination.page
                                  ? 'z-10 bg-anais-gold border-anais-gold text-white'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          ›
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
