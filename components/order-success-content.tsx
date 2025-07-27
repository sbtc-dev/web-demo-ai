"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle, Package, Truck, Calendar, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface OrderDetails {
  orderNumber: string
  total: string
  items: number
  estimatedDelivery: string
  paymentMethod: string
  deliveryAddress: string
  contactPhone: string
  contactEmail: string
}

export default function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // Get order details from URL params or localStorage
    const orderNumber = searchParams.get("orderNumber") || "ORD-" + Date.now()
    const total = searchParams.get("total") || "0"
    const items = Number.parseInt(searchParams.get("items") || "0")

    // Try to get more details from localStorage
    const savedOrderDetails = localStorage.getItem("lastOrderDetails")
    let orderData: OrderDetails

    if (savedOrderDetails) {
      const parsed = JSON.parse(savedOrderDetails)
      orderData = {
        orderNumber: orderNumber,
        total: total,
        items: items || parsed.items || 0,
        estimatedDelivery: parsed.estimatedDelivery || "3-5 business days",
        paymentMethod: parsed.paymentMethod || "Credit Card",
        deliveryAddress: parsed.deliveryAddress || "Default Address",
        contactPhone: parsed.contactPhone || "+1 (555) 123-4567",
        contactEmail: parsed.contactEmail || "customer@example.com",
      }
    } else {
      orderData = {
        orderNumber,
        total,
        items,
        estimatedDelivery: "3-5 business days",
        paymentMethod: "Credit Card",
        deliveryAddress: "Default Address",
        contactPhone: "+1 (555) 123-4567",
        contactEmail: "customer@example.com",
      }
    }

    setOrderDetails(orderData)

    // Clear cart after successful order
    localStorage.removeItem("cart")
    localStorage.removeItem("lastOrderDetails")
  }, [searchParams])

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order. We've received your payment and will process your order shortly.
        </p>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg border p-6 mb-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Details
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Order Number:</span> {orderDetails.orderNumber}
                </p>
                <p>
                  <span className="font-medium">Total Amount:</span> ${orderDetails.total}
                </p>
                <p>
                  <span className="font-medium">Items:</span> {orderDetails.items} products
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span> {orderDetails.paymentMethod}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Delivery Info
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-medium">Estimated Delivery:</span> {orderDetails.estimatedDelivery}
                  </span>
                </p>
                <p className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-medium">Address:</span> {orderDetails.deliveryAddress}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a
              href={`tel:${orderDetails.contactPhone}`}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Phone className="h-4 w-4 mr-2" />
              {orderDetails.contactPhone}
            </a>
            <a
              href={`mailto:${orderDetails.contactEmail}`}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Mail className="h-4 w-4 mr-2" />
              {orderDetails.contactEmail}
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/track-order/${orderDetails.orderNumber}`}>
                Track Your Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" asChild className="text-sm">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-sm text-gray-500 space-y-2">
          <p>A confirmation email has been sent to {orderDetails.contactEmail}</p>
          <p>You can track your order status anytime using your order number</p>
        </div>
      </div>
    </div>
  )
}