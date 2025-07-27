"use client"

import { useCart } from "@/contexts/cart-context"

export default function CartDebug() {
  const cart = useCart()

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Cart Debug Info</h3>
      <div>Items: {cart?.itemCount || 0}</div>
      <div>Total: ${cart?.total?.toFixed(2) || "0.00"}</div>
      <div>Initialized: {cart?.isInitialized ? "Yes" : "No"}</div>
      <div>Loading: {cart?.isLoading ? "Yes" : "No"}</div>
      <div>Error: {cart?.error || "None"}</div>
      <div>Context Available: {cart ? "Yes" : "No"}</div>
      <div>Dispatch Available: {cart?.dispatch ? "Yes" : "No"}</div>
    </div>
  )
}