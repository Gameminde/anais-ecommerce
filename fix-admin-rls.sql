-- Fix RLS policies for admin_users table
-- Allow authenticated users to read their own admin data

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own admin data" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage all" ON admin_users;

-- Create new simple policy
CREATE POLICY "Users can view own admin data" ON admin_users
FOR SELECT USING (auth.uid() = user_id AND is_active = true);

-- Also allow admins to manage all (for super admin features)
CREATE POLICY "Admins can manage all" ON admin_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
    AND role IN ('admin', 'super_admin')
  )
);
