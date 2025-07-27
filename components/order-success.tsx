"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, Mail, Truck, CreditCard, Banknote, Clock } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function OrderSuccess() {
  const searchParams = useSearchParams()
  const paymentMethod = searchParams.get("payment") || "credit-card"
  const orderNumber = "SBTC-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
  const deliveryMethod = searchParams.get("delivery") || "standard"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your business. Your order has been successfully placed.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                  <p className="text-sm text-gray-600">
                    Order Number: <span className="font-medium">{orderNumber}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Order Date: <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Estimated Delivery: <span className="font-medium">{estimatedDelivery}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery Method:{" "}
                    <span className="font-medium">
                      {deliveryMethod === "express"
                        ? "Express Delivery (3-7 hours)"
                        : "SBTC Standard Delivery (24-48 hours)"}
                    </span>
                  </p>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Payment Method:</span>
                    {paymentMethod === "credit-card" && (
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-sm font-medium">Credit/Debit Card</span>
                      </div>
                    )}
                    {paymentMethod === "cod" && (
                      <div className="flex items-center">
                        <Banknote className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium">Cash on Delivery</span>
                      </div>
                    )}
                    {paymentMethod === "tabby" && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="text-sm font-medium">Tabby (Split Payments)</span>
                      </div>
                    )}
                    {paymentMethod === "tamara" && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-indigo-500 mr-1" />
                        <span className="text-sm font-medium">Tamara (Pay Later)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Confirmation email sent</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-2 text-green-500" />
                      <span>
                        {deliveryMethod === "express"
                          ? "Express delivery being arranged"
                          : "Order being prepared for delivery"}
                      </span>
                    </div>
                    {deliveryMethod === "express" && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Live tracking will be available soon</span>
                      </div>
                    )}
                    {paymentMethod === "cod" ? (
                      <div className="flex items-center">
                        <Banknote className="w-4 h-4 mr-2 text-yellow-500" />
                        <span>Payment will be collected upon delivery</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-2 text-purple-500" />
                        <span>Invoice available for download</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {paymentMethod !== "cod" && (
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              )}

              <Link href={`/track-order/${orderNumber}`}>
                <Button variant="outline" size="lg">
                  Track Order
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>

              <Link href="/account/orders">
                <Button variant="outline">View All Orders</Button>
              </Link>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our customer service team is here to help with any questions about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}