"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatSAR } from "@/lib/currency"
import { useEffect } from "react"

export default function CartSidebar() {
  const { items, isOpen, itemCount, total, closeCart, removeItem, updateQuantity, clearCart } = useCart()

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, closeCart])

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Shopping Cart ({itemCount})</h2>
            <Button variant="ghost" size="sm" onClick={closeCart} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some products to get started</p>
                <Button onClick={closeCart} className="bg-gray-900 hover:bg-gray-800">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {items.map((item) => (
                  <CartSidebarItem
                    key={`${item.id}-${item.size}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>{formatSAR(total)}</span>
              </div>

              <div className="space-y-3">
                <Link href="/cart" onClick={closeCart} className="block">
                  <Button className="w-full" variant="outline">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeCart} className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="w-full text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function CartSidebarItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: any
  onUpdateQuantity: (id: string, size: string, quantity: number) => void
  onRemove: (id: string, size: string) => void
}) {
  return (
    <Card className="p-3">
      <div className="flex items-start space-x-3">
        <img
          src={item.image || "/placeholder.svg?height=48&width=48&query=product"}
          alt={item.name}
          className="w-12 h-12 object-cover rounded-md border flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=48&width=48"
          }}
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
          <p className="text-xs text-gray-500">{item.brand}</p>
          <p className="text-xs text-gray-500">Size: {item.size}</p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, item.size, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="h-6 w-6 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">{formatSAR(item.price * item.quantity)}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id, item.size)}
                className="h-5 w-5 p-0 text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}