"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Calendar, Clock, Shield, Info, CheckCircle } from "lucide-react"
import { PAYMENT_METHODS, isPaymentMethodAvailable, calculatePaymentFees } from "@/lib/payment-gateways"
import { formatSAR } from "@/lib/currency"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  amount: number
  currency: string
  customerPhone?: string
  onEligibilityCheck?: (method: string, eligible: boolean) => void
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  amount,
  currency,
  customerPhone,
  onEligibilityCheck,
}: PaymentMethodSelectorProps) {
  const [eligibilityStatus, setEligibilityStatus] = useState<Record<string, boolean>>({})
  const [installmentOptions, setInstallmentOptions] = useState<Record<string, any>>({})
  const [checkingEligibility, setCheckingEligibility] = useState<Record<string, boolean>>({})

  // Check BNPL eligibility when amount or phone changes
  useEffect(() => {
    if (customerPhone && amount > 0) {
      checkBNPLEligibility()
    }
  }, [amount, customerPhone])

  const checkBNPLEligibility = async () => {
    const bnplMethods = ["tabby", "tamara"]

    for (const methodId of bnplMethods) {
      if (!isPaymentMethodAvailable(methodId, amount, currency)) continue

      setCheckingEligibility((prev) => ({ ...prev, [methodId]: true }))

      try {
        // Simulate eligibility check - replace with actual API calls
        const response = await fetch("/api/payment/check-eligibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: methodId,
            amount,
            currency,
            phone: customerPhone,
          }),
        })

        const data = await response.json()

        setEligibilityStatus((prev) => ({ ...prev, [methodId]: data.eligible }))
        if (data.installments) {
          setInstallmentOptions((prev) => ({ ...prev, [methodId]: data.installments }))
        }

        onEligibilityCheck?.(methodId, data.eligible)
      } catch (error) {
        console.error(`Eligibility check failed for ${methodId}:`, error)
        setEligibilityStatus((prev) => ({ ...prev, [methodId]: false }))
      } finally {
        setCheckingEligibility((prev) => ({ ...prev, [methodId]: false }))
      }
    }
  }

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case "credit-card":
        return <CreditCard className="h-5 w-5" />
      case "tabby":
      case "tamara":
        return <Calendar className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getInstallmentDisplay = (methodId: string) => {
    const installments = installmentOptions[methodId]
    if (!installments || installments.length === 0) return null

    return (
      <div className="mt-2 space-y-1">
        {installments.map((option: any, index: number) => (
          <div key={index} className="text-xs text-gray-600 flex items-center space-x-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>
              {option.count} payments of {formatSAR(option.amount)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5 text-green-500" />
        <span className="text-sm font-medium">Secure Payment Methods</span>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={onMethodChange} className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const isAvailable = isPaymentMethodAvailable(method.id, amount, currency)
          const fees = calculatePaymentFees(method.id, amount)
          const isEligible = eligibilityStatus[method.id] !== false
          const isChecking = checkingEligibility[method.id]
          const showEligibilityInfo = ["tabby", "tamara"].includes(method.id)

          return (
            <Card
              key={method.id}
              className={`transition-all duration-200 ${
                selectedMethod === method.id
                  ? "border-gray-900 bg-gray-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              } ${!isAvailable || (!isEligible && showEligibilityInfo) ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    disabled={!isAvailable || (!isEligible && showEligibilityInfo)}
                    className="mt-1"
                  />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          {getMethodIcon(method.id)}
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{method.name}</span>
                            {method.type === "bnpl" && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                Buy Now Pay Later
                              </Badge>
                            )}
                            {fees > 0 && (
                              <Badge variant="outline" className="text-xs">
                                +{formatSAR(fees)} fee
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600">{method.description}</p>

                        {/* Tabby specific information */}
                        {method.id === "tabby" && isAvailable && (
                          <div className="space-y-2">
                            {isChecking ? (
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                                <span>Checking eligibility...</span>
                              </div>
                            ) : eligibilityStatus[method.id] === false ? (
                              <Alert className="border-orange-200 bg-orange-50">
                                <Info className="h-4 w-4 text-orange-500" />
                                <AlertDescription className="text-xs text-orange-700">
                                  Not eligible for Tabby at this time. Try a different payment method.
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm font-medium text-blue-900">Split into 4 payments</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-xs">
                                  <div className="text-center">
                                    <div className="font-medium text-blue-900">Today</div>
                                    <div className="text-blue-700">{formatSAR(amount / 4)}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-blue-900">2 weeks</div>
                                    <div className="text-blue-700">{formatSAR(amount / 4)}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-blue-900">4 weeks</div>
                                    <div className="text-blue-700">{formatSAR(amount / 4)}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-blue-900">6 weeks</div>
                                    <div className="text-blue-700">{formatSAR(amount / 4)}</div>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-blue-600">
                                  ✓ No interest ✓ No fees ✓ Shariah compliant
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tamara specific information */}
                        {method.id === "tamara" && isAvailable && (
                          <div className="space-y-2">
                            {isChecking ? (
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-500"></div>
                                <span>Checking eligibility...</span>
                              </div>
                            ) : eligibilityStatus[method.id] === false ? (
                              <Alert className="border-orange-200 bg-orange-50">
                                <Info className="h-4 w-4 text-orange-500" />
                                <AlertDescription className="text-xs text-orange-700">
                                  Not eligible for Tamara at this time. Try a different payment method.
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm font-medium text-green-900">Flexible payment options</span>
                                </div>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-green-700">Pay in 3 months:</span>
                                    <span className="font-medium text-green-900">{formatSAR(amount / 3)}/month</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-700">Pay in 6 months:</span>
                                    <span className="font-medium text-green-900">{formatSAR(amount / 6)}/month</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-700">Pay in 12 months:</span>
                                    <span className="font-medium text-green-900">{formatSAR(amount / 12)}/month</span>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-green-600">
                                  ✓ No hidden fees ✓ Instant approval ✓ Shariah compliant
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Credit card information */}
                        {method.id === "credit-card" && (
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex space-x-1">
                              <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                VISA
                              </div>
                              <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                                MC
                              </div>
                              <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                MADA
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">Secure SSL encryption</span>
                          </div>
                        )}

                        {/* Availability restrictions */}
                        {!isAvailable && (
                          <Alert className="border-red-200 bg-red-50">
                            <Info className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-xs text-red-700">
                              {amount < (method.minAmount || 0)
                                ? `Minimum amount: ${formatSAR(method.minAmount || 0)}`
                                : amount > (method.maxAmount || Number.POSITIVE_INFINITY)
                                  ? `Maximum amount: ${formatSAR(method.maxAmount || 0)}`
                                  : "Not available for this currency"}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{method.processingTime}</span>
                        </div>
                        {method.refundSupport && (
                          <div className="flex items-center space-x-1 text-xs text-green-600 mt-1">
                            <Shield className="h-3 w-3" />
                            <span>Refund supported</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </RadioGroup>

      {/* Re-check eligibility button for BNPL methods */}
      {customerPhone && (
        <Button variant="outline" size="sm" onClick={checkBNPLEligibility} className="w-full">
          Re-check Payment Eligibility
        </Button>
      )}
    </div>
  )
}