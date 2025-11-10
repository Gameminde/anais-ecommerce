import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  shipping_address_id: string;
  total_amount_dzd: number;
  delivery_fee_dzd: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  shipping_address?: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    province: string;
    postal_code?: string;
  };
  items?: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price_dzd: number;
    size?: string;
    color?: string;
    product?: {
      name_en: string;
      name_fr?: string;
      sku?: string;
      images?: Array<{
        id: string;
        image_url: string;
        is_primary: boolean;
        display_order: number;
      }>;
    };
  }>;
}

export default function AdminOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch order basic data
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      // Fetch customer profile separately
      let customerData = null;
      if (orderData.user_id) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', orderData.user_id)
          .single();

        if (!profileError && profile) {
          // Split full_name for compatibility
          const nameParts = profile.full_name.split(' ');
          customerData = {
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email: '', // Would need separate query to auth.users
            phone: ''
          };
        }
      }

      // Fetch shipping address
      let shippingAddress = null;
      if (orderData.shipping_address_id) {
        const { data: address, error: addressError } = await supabase
          .from('addresses')
          .select('*')
          .eq('id', orderData.shipping_address_id)
          .single();

        if (!addressError && address) {
          shippingAddress = address;
        }
      }

      // Fetch order items with product details and images
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
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
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      // Combine data
      const completeOrder = {
        ...orderData,
        customer: customerData,
        shipping_address: shippingAddress,
        items: itemsData?.map(item => ({
          ...item,
          product: {
            ...item.products,
            images: item.products?.product_images || []
          }
        })) || []
      };

      setOrder(completeOrder);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la commande');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('orders')
        .update({
          order_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      // Refresh order data
      fetchOrderDetails();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      // Refresh order data
      fetchOrderDetails();
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Erreur lors de la mise à jour du paiement');
    } finally {
      setUpdating(false);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = (currentStatus: string, type: 'order' | 'payment') => {
    if (type === 'order') {
      const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      return statuses.filter(status => status !== currentStatus);
    } else {
      const statuses = ['pending', 'paid', 'failed', 'refunded'];
      return statuses.filter(status => status !== currentStatus);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anais-gold"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur de chargement
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error || 'Commande non trouvée'}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Retour aux commandes
                </button>
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Commande {order.order_number}
            </h1>
            <p className="text-gray-600">
              Commandée le {formatDate(order.created_at)}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            ← Retour aux commandes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Cards */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Statuts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut de la commande
                  </label>
                  <select
                    value={order.order_status}
                    onChange={(e) => updateOrderStatus(e.target.value)}
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                  >
                    <option value={order.order_status}>
                      {order.order_status} (actuel)
                    </option>
                    {getStatusOptions(order.order_status, 'order').map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut du paiement
                  </label>
                  <select
                    value={order.payment_status}
                    onChange={(e) => updatePaymentStatus(e.target.value)}
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                  >
                    <option value={order.payment_status}>
                      {order.payment_status} (actuel)
                    </option>
                    {getStatusOptions(order.payment_status, 'payment').map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Articles commandés</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items?.map((item) => {
                  // Get the primary image or first image
                  const primaryImage = item.product?.images?.find(img => img.is_primary) ||
                                     item.product?.images?.sort((a, b) => a.display_order - b.display_order)?.[0];

                  return (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {primaryImage ? (
                            <img
                              src={primaryImage.image_url}
                              alt={item.product?.name_en || 'Produit'}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Pas d'image</span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-gray-900">
                                {item.product?.name_en}
                                {item.product?.name_fr && (
                                  <span className="text-sm font-normal text-gray-600 ml-2">
                                    ({item.product.name_fr})
                                  </span>
                                )}
                              </h3>

                              {/* SKU and Reference */}
                              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                                {item.product?.sku && (
                                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                    Réf: {item.product.sku}
                                  </span>
                                )}
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                  Qté: {item.quantity}
                                </span>
                              </div>

                              {/* Size and Color */}
                              <div className="mt-2 flex flex-wrap items-center gap-3">
                                {item.size && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-1">Taille:</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                      {item.size}
                                    </span>
                                  </div>
                                )}
                                {item.color && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-medium mr-1">Couleur:</span>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                      {item.color}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Additional Images Preview */}
                              {item.product?.images && item.product.images.length > 1 && (
                                <div className="mt-2 flex items-center space-x-1">
                                  <span className="text-xs text-gray-500 mr-2">
                                    +{item.product.images.length - 1} autres photos
                                  </span>
                                  <div className="flex space-x-1">
                                    {item.product.images.slice(1, 4).map((img, idx) => (
                                      <img
                                        key={img.id}
                                        src={img.image_url}
                                        alt={`Vue ${idx + 2}`}
                                        className="w-8 h-8 object-cover rounded border border-gray-200"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Price */}
                            <div className="text-right ml-4">
                              <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(item.price_dzd * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(item.price_dzd)} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Total */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Sous-total</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(order.total_amount_dzd - order.delivery_fee_dzd)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-900">Frais de livraison</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(order.delivery_fee_dzd)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(order.total_amount_dzd)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informations client</h2>
              {order.customer ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom</label>
                    <p className="text-sm text-gray-900">
                      {order.customer.first_name} {order.customer.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{order.customer.email}</p>
                  </div>
                  {order.customer.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Téléphone</label>
                      <p className="text-sm text-gray-900">{order.customer.phone}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Informations client non disponibles</p>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Adresse de livraison</h2>
              {order.shipping_address ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Destinataire</label>
                    <p className="text-sm text-gray-900">{order.shipping_address.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Téléphone</label>
                    <p className="text-sm text-gray-900">{order.shipping_address.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Adresse</label>
                    <div className="text-sm text-gray-900">
                      <p>{order.shipping_address.address_line1}</p>
                      {order.shipping_address.address_line2 && (
                        <p>{order.shipping_address.address_line2}</p>
                      )}
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.province}
                        {order.shipping_address.postal_code && ` ${order.shipping_address.postal_code}`}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Adresse de livraison non disponible</p>
              )}
            </div>

            {/* Order Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informations commande</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Numéro de commande</label>
                  <p className="text-sm text-gray-900 font-mono">{order.order_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Méthode de paiement</label>
                  <p className="text-sm text-gray-900 capitalize">{order.payment_method}</p>
                </div>
                {order.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-sm text-gray-900">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

