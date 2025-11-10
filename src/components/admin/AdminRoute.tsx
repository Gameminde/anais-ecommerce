import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';

interface AdminRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
  requiredPermission?: string;
}

export function AdminRoute({ children, requireSuperAdmin = false, requiredPermission }: AdminRouteProps) {
  const { isAdmin, isSuperAdmin, loading, hasPermission } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anais-gold"></div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600">Vous devez être super administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
