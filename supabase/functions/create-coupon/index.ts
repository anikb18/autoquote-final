import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    )

    // Check if user is admin
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) throw new Error('No user found')

    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      throw new Error('Admin access required')
    }

    // Get the request body
    const { code, name, description, discount_type, discount_value, usage_limit, expires_at } = await req.json()

    // Validate required fields
    if (!code || !name || !discount_type || !discount_value) {
      throw new Error('Missing required fields')
    }

    // Create the coupon
    const { data: coupon, error } = await supabaseClient
      .from('coupons')
      .insert([
        {
          code,
          name,
          description,
          discount_type,
          discount_value,
          usage_limit,
          expires_at,
          created_by: user.id
        }
      ])
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ coupon }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating coupon:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})