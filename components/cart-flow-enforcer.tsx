"use client"

import type React from "react"

import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface CartFlowEnforcerProps {
  children: React.ReactNode
  requireCartItems?: boolean
}

export function CartFlowEnforcer({ children, requireCartItems = false }: CartFlowEnforcerProps) {
  const cart = useCart()
  const router = useRouter()

  useEffect(() => {
    // Only enforce after cart is initialized to prevent premature redirects
    if (cart.isInitialized && requireCartItems && cart.items.length === 0) {
      router.push("/cart")
    }
  }, [cart.isInitialized, cart.items.length, requireCartItems, router])

  // Render immediately without waiting - let the effect handle redirects
  return <>{children}</>
}