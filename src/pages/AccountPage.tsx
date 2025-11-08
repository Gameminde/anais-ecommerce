import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mon compte</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">Informations</h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
          <button
            onClick={() => navigate('/account/profile')}
            className="mt-4 text-yellow-500 text-sm font-medium"
          >
            Modifier →
          </button>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">Mes commandes</h3>
          <p className="text-sm text-gray-600">Consulter l'historique</p>
          <button
            onClick={() => navigate('/account/orders')}
            className="mt-4 text-yellow-500 text-sm font-medium"
          >
            Voir →
          </button>
        </div>

        {/* Addresses Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">Adresses</h3>
          <p className="text-sm text-gray-600">Gérer mes adresses</p>
          <button
            onClick={() => navigate('/account/addresses')}
            className="mt-4 text-yellow-500 text-sm font-medium"
          >
            Gérer →
          </button>
        </div>
      </div>

      <button
        onClick={() => signOut()}
        className="mt-8 text-red-500 text-sm font-medium"
      >
        Se déconnecter
      </button>
    </div>
  );
}
