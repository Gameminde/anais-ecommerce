import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Settings, MapPin, ShoppingBag, LogOut } from 'lucide-react'

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (user) {
      loadProfile()
      loadAddresses()
      loadOrders()
    }
  }, [user])

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
    } else {
      setProfile(data)
    }
  }

  const loadAddresses = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading addresses:', error)
    } else {
      setAddresses(data || [])
    }
  }

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price_dzd,
          product:products (name_en)
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error loading orders:', error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anais-taupe mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'addresses', label: 'Adresses', icon: MapPin },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag },
  ]

  return (
    <div className="min-h-screen bg-ivory-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-anais-taupe rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-charcoal">
                  {profile?.full_name || 'Utilisateur ANAIS'}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-anais-taupe border-b-2 border-anais-taupe'
                      : 'text-gray-600 hover:text-anais-taupe'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations du profil
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {profile?.full_name || 'Non défini'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'inscription
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dernière connexion
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Adresses de livraison ({addresses.length})
              </h2>
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune adresse enregistrée</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Les adresses sont automatiquement sauvegardées lors de vos commandes
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{address.full_name}</h3>
                          <p className="text-gray-600 mt-1">
                            {address.address_line1}
                            {address.city && `, ${address.city}`}
                            {address.province && `, ${address.province}`}
                          </p>
                          {address.phone && (
                            <p className="text-gray-600 text-sm mt-1">📞 {address.phone}</p>
                          )}
                        </div>
                        {address.is_default && (
                          <span className="px-2 py-1 bg-anais-taupe text-white text-xs rounded">
                            Par défaut
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Historique des commandes ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune commande trouvée</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Vos futures commandes apparaîtront ici
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Commande #{order.order_number}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-anais-taupe">
                            {order.total_amount_dzd} DZD
                          </p>
                          <span className={`px-2 py-1 text-xs rounded ${
                            order.order_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.order_status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {order.order_status === 'pending' ? 'En attente' :
                             order.order_status === 'confirmed' ? 'Confirmée' : 'Livrée'}
                          </span>
                        </div>
                      </div>
                      {order.order_items && order.order_items.length > 0 && (
                        <div className="text-sm text-gray-600">
                          {order.order_items.length} article(s): {order.order_items.map((item: any) =>
                            item.product?.name_en
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



