"use client"

import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatSAR, calculateSaudiVAT } from "@/lib/currency"
import { CartPageSkeleton } from "./cart-page-skeleton"

export default function CartPage() {
  const {
    items,
    total,
    itemCount,
    isInitialized,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
    clearError,
  } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleQuantityChange = (id: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, size, newQuantity)
  }

  const subtotal = total
  const vat = calculateSaudiVAT(subtotal)
  const shipping = subtotal >= 187.5 ? 0 : 37.5
  const totalWithTax = subtotal + vat + shipping

  // Show loading state during hydration
  if (!isClient || !isInitialized) {
    return <CartPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-2 h-auto p-0 text-red-600 hover:text-red-800"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!items || items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center justify-between">
                    <span>Cart Items</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {items.map((item) => (
                      <CartItemRow
                        key={`${item.id}-${item.size}`}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={removeItem}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatSAR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="flex items-center">
                        {shipping === 0 ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">{formatSAR(37.5)}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              FREE
                            </Badge>
                          </>
                        ) : (
                          formatSAR(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (15%)</span>
                      <span>{formatSAR(vat)}</span>
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatSAR(totalWithTax)}</span>
                  </div>

                  {subtotal < 187.5 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">Add {formatSAR(187.5 - subtotal)} more for free shipping!</p>
                    </div>
                  )}

                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>

                  <div className="pt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure checkout with SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Free shipping on orders over {formatSAR(187.5)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
  isLoading,
}: {
  item: any
  onQuantityChange: (id: string, size: string, quantity: number) => void
  onRemove: (id: string, size: string) => void
  isLoading: boolean
}) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg border"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=64&width=64"
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.brand}</p>
              <p className="text-sm text-gray-500">Size: {item.size}</p>
              {item.sku && <p className="text-xs text-gray-400">SKU: {item.sku}</p>}
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900">{formatSAR(item.price)}</p>
              {item.originalPrice && item.originalPrice > item.price && (
                <p className="text-sm text-gray-500 line-through">{formatSAR(item.originalPrice)}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(item.id, item.size, item.quantity - 1)}
                disabled={item.quantity <= 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = Number.parseInt(e.target.value) || 1
                  onQuantityChange(item.id, item.size, newQuantity)
                }}
                className="w-16 text-center h-8"
                min="1"
                max={item.maxQuantity || 99}
                disabled={isLoading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(item.id, item.size, item.quantity + 1)}
                disabled={isLoading || (item.maxQuantity && item.quantity >= item.maxQuantity)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-lg font-medium text-gray-900">{formatSAR(item.price * item.quantity)}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id, item.size)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyCartState() {
  return (
    <Card className="text-center py-16">
      <CardContent>
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Add some products to get started with your order</p>
        <Link href="/products">
          <Button className="bg-gray-900 hover:bg-gray-800">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}