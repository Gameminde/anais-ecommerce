import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zvyhuqkyeyzkjdvafdkx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.1NWeXi4URFI7hQi1l4JnNmoMWKSClDJqo9tyELnciXo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  category_id: string
  sku: string
  name_en: string
  name_ar: string | null
  name_fr: string | null
  description_en: string | null
  description_ar: string | null
  description_fr: string | null
  price_dzd: number
  sale_price_dzd: number | null
  product_type: 'dress' | 'perfume' | 'makeup' | 'gift_box'
  sizes: string[] | null
  colors: string[] | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  display_order: number
  is_primary: boolean
  created_at: string
}

export interface Category {
  id: string
  name_en: string
  name_ar: string | null
  name_fr: string | null
  slug: string
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  size: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  province: string
  postal_code: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  shipping_address_id: string
  total_amount_dzd: number
  delivery_fee_dzd: number
  payment_method: 'cod' | 'online' | 'mobile'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_dzd: number
  size: string | null
  color: string | null
  created_at: string
}

export interface GiftBox {
  id: string
  name_en: string
  name_ar: string | null
  name_fr: string | null
  description_en: string | null
  description_ar: string | null
  description_fr: string | null
  price_dzd: number
  image_url: string | null
  is_active: boolean
  created_at: string
}
