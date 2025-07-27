"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PurchaseFlowGuardProps {
  productId?: string
  className?: string
}

export function PurchaseFlowGuard({ productId, className }: PurchaseFlowGuardProps) {
  const { items } = useCart()
  const hasItems = items.length > 0

  if (!hasItems) {
    return (
      <div className={`text-center p-6 bg-gray-50 rounded-lg ${className}`}>
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-4">Add products to your cart before proceeding to checkout</p>
        <Link href="/products">
          <Button className="bg-gray-900 hover:bg-gray-800">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return null
}