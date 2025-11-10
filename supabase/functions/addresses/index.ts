import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Non authentifié");

    const body = await req.json();

    switch (req.method) {
      case 'GET':
        const { data: addresses } = await supabaseClient
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });
        return new Response(JSON.stringify({ addresses }), { headers: corsHeaders });

      case 'POST':
        const { data: newAddress } = await supabaseClient
          .from('addresses')
          .insert({ ...body, user_id: user.id })
          .select()
          .single();
        return new Response(JSON.stringify({ address: newAddress }), { headers: corsHeaders });

      case 'PUT':
        const { data: updated } = await supabaseClient
          .from('addresses')
          .update(body)
          .eq('id', body.id)
          .eq('user_id', user.id)
          .select()
          .single();
        return new Response(JSON.stringify({ address: updated }), { headers: corsHeaders });

      case 'DELETE':
        await supabaseClient
          .from('addresses')
          .delete()
          .eq('id', body.id)
          .eq('user_id', user.id);
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });

      default:
        throw new Error('Method not allowed');
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: corsHeaders,
      status: 400
    });
  }
});



