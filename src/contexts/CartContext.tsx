import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react'
import { supabase, Product, CartItem } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface CartContextType {
  cartItems: (CartItem & { product?: Product })[]
  addToCart: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  cartCount: number
  cartTotal: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<(CartItem & { product?: Product })[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCartItems([])
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data: items, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch product details for each cart item
      if (items && items.length > 0) {
        const productIds = items.map(item => item.product_id)
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)

        const itemsWithProducts = items.map(item => ({
          ...item,
          product: products?.find(p => p.id === item.product_id),
        }))

        setCartItems(itemsWithProducts)
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number, size?: string, color?: string) => {
    if (!user) {
      throw new Error('Please sign in to add items to cart')
    }

    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size || '')
        .eq('color', color || '')
        .maybeSingle()

      if (existing) {
        // Update quantity
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
      } else {
        // Insert new item
        await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: productId,
          quantity,
          size,
          color,
        })
      }

      await fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      await supabase.from('cart_items').delete().eq('id', itemId)
      await fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    try {
      await supabase.from('cart_items').update({ quantity }).eq('id', itemId)
      await fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      await supabase.from('cart_items').delete().eq('user_id', user.id)
      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const cartCount = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )

  const cartTotal = useMemo(() =>
    cartItems.reduce((sum, item) => {
      const price = item.product?.sale_price_dzd || item.product?.price_dzd || 0
      return sum + price * item.quantity
    }, 0),
    [cartItems]
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
