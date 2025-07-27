"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/contexts/cart-context"
import { useLoyalty } from "@/contexts/loyalty-context"
import { CreditCardIcon, Truck, Shield, ArrowLeft, Banknote, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { formatSAR, calculateSaudiVAT } from "@/lib/currency"
import CheckoutLoyaltySection from "@/components/checkout-loyalty-section"
import PaymentMethodSelector from "@/components/payment-method-selector"

// Pre-define form structure to avoid runtime creation
const INITIAL_FORM_DATA = {
  companyName: "",
  businessType: "",
  taxId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingZip: "",
  billingCountry: "",
  shippingAddress: "",
  shippingCity: "",
  shippingState: "",
  shippingZip: "",
  shippingCountry: "",
  sameAsBilling: true,
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardName: "",
  specialInstructions: "",
  newsletter: false,
} as const

export default function CheckoutPage() {
  const cart = useCart()
  const loyalty = useLoyalty()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [deliveryMethod, setDeliveryMethod] = useState("standard")
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  // Memoized cart calculations including loyalty discounts
  const calculations = useMemo(() => {
    const items = cart.items || []
    const subtotal = cart.total || 0
    const loyaltyDiscount = loyalty.appliedDiscount || 0
    const discountedSubtotal = subtotal - loyaltyDiscount
    const vat = calculateSaudiVAT(discountedSubtotal)
    const standardShipping = discountedSubtotal >= 187.5 ? 0 : 37.5
    const expressShipping = 48.75
    const shipping = deliveryMethod === "express" ? expressShipping : standardShipping
    const codFee = paymentMethod === "cod" ? 7.5 : 0
    const total = discountedSubtotal + vat + shipping + codFee

    return {
      items,
      subtotal,
      loyaltyDiscount,
      discountedSubtotal,
      vat,
      shipping,
      codFee,
      total,
    }
  }, [cart.items, cart.total, loyalty.appliedDiscount, deliveryMethod, paymentMethod])

  // Optimized input handler
  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Optimized submit handler with loyalty processing
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsProcessing(true)

      try {
        // Handle different payment methods
        if (paymentMethod === "tabby" || paymentMethod === "tamara") {
          // Create BNPL payment
          const paymentData = {
            action: "create",
            amount: calculations.total,
            currency: "SAR",
            description: `SBTC Order - ${calculations.items.length} items`,
            orderId: `ORD-${Date.now()}`,
            items: calculations.items,
            customer: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
            },
            shippingAddress: {
              address: formData.shippingAddress,
              city: formData.shippingCity,
              zip: formData.shippingZip,
            },
            billingAddress: {
              address: formData.shippingAddress,
              city: formData.shippingCity,
              zip: formData.shippingZip,
            },
          }

          const response = await fetch(`/api/payment/${paymentMethod}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          })

          const result = await response.json()

          if (result.success && result.checkout_url) {
            // Redirect to BNPL checkout
            window.location.href = result.checkout_url
            return
          } else {
            throw new Error(result.error || "Payment creation failed")
          }
        } else {
          // Handle other payment methods (existing logic)
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }

        // Process loyalty points and rewards
        const orderData = {
          orderId: `ORD-${Date.now()}`,
          total: calculations.total,
          subtotal: calculations.subtotal,
          loyaltyDiscount: calculations.loyaltyDiscount,
          items: calculations.items,
          customerEmail: formData.email,
        }

        // Award loyalty points and process redemptions
        await loyalty.processOrder(orderData)

        // Clear cart and redirect
        cart.clearCart()
        router.push(`/order-success?orderId=${orderData.orderId}&loyaltyPoints=${loyalty.pointsEarned}`)
      } catch (error) {
        console.error("Checkout error:", error)
        setIsProcessing(false)
      }
    },
    [cart, loyalty, router, calculations, formData, paymentMethod],
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </div>
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        required
                        autoComplete="organization"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="retail">Retail Store</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="taxId">Tax ID / Business Registration Number</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange("taxId", e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </div>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress">Street Address *</Label>
                    <Input
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange("shippingAddress", e.target.value)}
                      required
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="shippingCity">City *</Label>
                      <Input
                        id="shippingCity"
                        value={formData.shippingCity}
                        onChange={(e) => handleInputChange("shippingCity", e.target.value)}
                        required
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingState">State *</Label>
                      <Input
                        id="shippingState"
                        value={formData.shippingState}
                        onChange={(e) => handleInputChange("shippingState", e.target.value)}
                        required
                        autoComplete="address-level1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingZip">ZIP Code *</Label>
                      <Input
                        id="shippingZip"
                        value={formData.shippingZip}
                        onChange={(e) => handleInputChange("shippingZip", e.target.value)}
                        required
                        autoComplete="postal-code"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      4
                    </div>
                    Delivery Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-4">
                    <div
                      className={`flex items-start space-x-3 border rounded-lg p-4 transition-colors ${
                        deliveryMethod === "standard" ? "border-gray-900 bg-gray-50" : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem value="standard" id="standard" className="mt-1" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-5 w-5 text-gray-600" />
                              <span className="font-medium">SBTC Standard Delivery</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                FREE
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Delivered by our trusted SBTC delivery team</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>24-48 hours</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Shield className="h-4 w-4" />
                                <span>Tracking included</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">FREE</p>
                            <p className="text-xs text-gray-500">Orders over {formatSAR(187.5)}</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div
                      className={`flex items-start space-x-3 border rounded-lg p-4 transition-colors ${
                        deliveryMethod === "express" ? "border-gray-900 bg-gray-50" : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem value="express" id="express" className="mt-1" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-5 w-5 text-blue-600" />
                              <span className="font-medium">Express Delivery</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                FAST
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Delivered by our premium delivery partners</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>3-7 hours</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Shield className="h-4 w-4" />
                                <span>Real-time tracking</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Truck className="h-4 w-4" />
                                <span>Priority handling</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{formatSAR(calculations.shipping)}</p>
                            <p className="text-xs text-gray-500">Same day delivery</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Loyalty Rewards Section */}
              <CheckoutLoyaltySection subtotal={calculations.subtotal} />

              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      5
                    </div>
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                    amount={calculations.total}
                    currency="SAR"
                    customerPhone={formData.phone}
                    onEligibilityCheck={(method, eligible) => {
                      console.log(`${method} eligibility:`, eligible)
                    }}
                  />
                </CardContent>
              </Card>

              {/* Credit Card Information - Only shown when credit card is selected */}
              {paymentMethod === "credit-card" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Card Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange("cardName", e.target.value)}
                        required={paymentMethod === "credit-card"}
                        autoComplete="cc-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        required={paymentMethod === "credit-card"}
                        autoComplete="cc-number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          required={paymentMethod === "credit-card"}
                          autoComplete="cc-exp"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                          required={paymentMethod === "credit-card"}
                          autoComplete="cc-csc"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Any special delivery instructions or notes..."
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => handleInputChange("newsletter", checked as boolean)}
                    />
                    <Label htmlFor="newsletter">Subscribe to our newsletter for updates and special offers</Label>
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
                  <div className="space-y-3">
                    {calculations.items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">{formatSAR(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatSAR(calculations.subtotal)}</span>
                    </div>
                    {calculations.loyaltyDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Loyalty Discount</span>
                        <span>-{formatSAR(calculations.loyaltyDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>
                        {deliveryMethod === "express" ? "Express Delivery" : "Standard Delivery"}
                        {deliveryMethod === "standard" && calculations.discountedSubtotal >= 187.5 && " (Free)"}
                      </span>
                      <span>{calculations.shipping === 0 ? "Free" : formatSAR(calculations.shipping)}</span>
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="flex justify-between">
                        <span>COD Fee</span>
                        <span>{formatSAR(calculations.codFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>VAT (15%)</span>
                      <span>{formatSAR(calculations.vat)}</span>
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatSAR(calculations.total)}</span>
                  </div>

                  {/* Points to be earned */}
                  {calculations.total > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700 font-medium">Points to earn:</span>
                        <span className="text-blue-900 font-bold">{Math.floor(calculations.total * 0.1)} points</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">Earn 1 point for every {formatSAR(10)} spent</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 transition-colors"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        {paymentMethod === "credit-card" && <CreditCardIcon className="mr-2 h-4 w-4" />}
                        {paymentMethod === "cod" && <Banknote className="mr-2 h-4 w-4" />}
                        {paymentMethod === "credit-card"
                          ? "Complete Payment"
                          : paymentMethod === "cod"
                            ? "Place COD Order"
                            : "Place Order"}
                      </>
                    )}
                  </Button>

                  <div className="pt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Secure SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>Free shipping on orders over {formatSAR(187.5)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}