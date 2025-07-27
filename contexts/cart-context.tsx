"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number | null
  image: string
  size: string
  quantity: number
  category: string
  sku?: string
  weight?: string
  maxQuantity?: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isInitialized: boolean
  isLoading: boolean
  error: string | null
}

type CartAction =
  | { type: "INITIALIZE" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; size: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "RESTORE_CART"; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  isOpen: false,
  isInitialized: false,
  isLoading: false,
  error: null,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "INITIALIZE":
      return { ...state, isInitialized: true, isLoading: false }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload }

    case "RESTORE_CART":
      return { ...state, items: action.payload }

    case "ADD_ITEM": {
      const { quantity = 1, ...itemData } = action.payload
      const itemKey = `${itemData.id}-${itemData.size}`

      const existingItemIndex = state.items.findIndex((item) => `${item.id}-${item.size}` === itemKey)

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item
        const existingItem = state.items[existingItemIndex]
        const newQuantity = existingItem.quantity + quantity
        const maxQuantity = itemData.maxQuantity || 99

        if (newQuantity > maxQuantity) {
          return {
            ...state,
            error: `Cannot add more than ${maxQuantity} items of this product`,
          }
        }

        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: newQuantity } : item,
        )
      } else {
        // Add new item
        const newItem: CartItem = { ...itemData, quantity }
        updatedItems = [...state.items, newItem]
      }

      return { ...state, items: updatedItems, error: null }
    }

    case "REMOVE_ITEM": {
      const itemKey = `${action.payload.id}-${action.payload.size}`
      const updatedItems = state.items.filter((item) => `${item.id}-${item.size}` !== itemKey)
      return { ...state, items: updatedItems, error: null }
    }

    case "UPDATE_QUANTITY": {
      const { id, size, quantity } = action.payload

      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id, size } })
      }

      const updatedItems = state.items.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item,
      )

      return { ...state, items: updatedItems, error: null }
    }

    case "CLEAR_CART":
      return { ...state, items: [], error: null }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    default:
      return state
  }
}

interface CartContextType {
  // State
  items: CartItem[]
  isOpen: boolean
  isInitialized: boolean
  isLoading: boolean
  error: string | null

  // Computed values
  itemCount: number
  total: number

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  clearError: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Initialize cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("sbtc-cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[]
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          dispatch({ type: "RESTORE_CART", payload: parsedCart })
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    } finally {
      dispatch({ type: "INITIALIZE" })
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (state.isInitialized) {
      try {
        localStorage.setItem("sbtc-cart", JSON.stringify(state.items))
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error)
      }
    }
  }, [state.items, state.isInitialized])

  // Computed values
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  const total = state.items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Actions
  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "ADD_ITEM", payload: item })
    setTimeout(() => {
      dispatch({ type: "SET_LOADING", payload: false })
    }, 300)
  }

  const removeItem = (id: string, size: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, size } })
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null })
  }

  const value: CartContextType = {
    // State
    items: state.items,
    isOpen: state.isOpen,
    isInitialized: state.isInitialized,
    isLoading: state.isLoading,
    error: state.error,

    // Computed values
    itemCount,
    total,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    clearError,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider. Make sure your component is wrapped with CartProvider.",
    )
  }
  return context
}