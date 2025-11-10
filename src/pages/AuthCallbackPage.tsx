import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Create/update user profile
        supabase.from('profiles').upsert({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          updated_at: new Date().toISOString(),
        });
        navigate('/', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-cream">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anais-gold mx-auto"></div>
        <p className="mt-4 font-body text-charcoal">Traitement de l'authentification...</p>
      </div>
    </div>
  );
}



