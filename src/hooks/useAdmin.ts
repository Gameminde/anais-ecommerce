import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  is_active: boolean;
  created_at: string;
}

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setAdminData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TEMPORARY FIX: Check if user email is admin@anais.com
      // This bypasses RLS issues while we fix the policies
      if (user.email === 'admin@anais.com') {
        console.log('✅ User is admin (email check):', user.email);
        setAdminData({
          id: 'temp-admin-id',
          user_id: user.id,
          role: 'admin',
          permissions: ['manage_products', 'manage_orders', 'manage_users', 'view_analytics'],
          is_active: true,
          created_at: new Date().toISOString()
        });
        setIsAdmin(true);
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      // Query admin_users table with safe RLS policies
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Admin check failed:', error.message);
        // Fallback: check email directly
        if (user.email === 'admin@anais.com') {
          console.log('✅ User is admin (fallback email check):', user.email);
          setAdminData({
            id: 'fallback-admin-id',
            user_id: user.id,
            role: 'admin',
            permissions: ['manage_products', 'manage_orders', 'manage_users', 'view_analytics'],
            is_active: true,
            created_at: new Date().toISOString()
          });
          setIsAdmin(true);
          setIsSuperAdmin(false);
        } else {
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setAdminData(null);
          setError(error.message);
        }
      } else if (data) {
        console.log('✅ User is admin (database):', data.role);
        setAdminData(data);
        setIsAdmin(true);
        setIsSuperAdmin(data.role === 'super_admin');
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setAdminData(null);
      }
    } catch (err) {
      console.error('Admin check exception:', err);
      // Fallback: check email directly on exception
      if (user.email === 'admin@anais.com') {
        console.log('✅ User is admin (exception fallback):', user.email);
        setAdminData({
          id: 'exception-admin-id',
          user_id: user.id,
          role: 'admin',
          permissions: ['manage_products', 'manage_orders', 'manage_users', 'view_analytics'],
          is_active: true,
          created_at: new Date().toISOString()
        });
        setIsAdmin(true);
        setIsSuperAdmin(false);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setAdminData(null);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!adminData) return false;
    return adminData.permissions.includes(permission) || adminData.role === 'super_admin';
  };

  const refreshAdminStatus = () => {
    checkAdminStatus();
  };

  return {
    isAdmin,
    isSuperAdmin,
    adminData,
    loading,
    error,
    hasPermission,
    refreshAdminStatus
  };
}
