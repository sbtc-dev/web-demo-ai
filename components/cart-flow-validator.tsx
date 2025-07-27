"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export default function CartFlowValidator() {
  const { state } = useCart()
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  })

  useEffect(() => {
    validateCartState()
  }, [state])

  const validateCartState = () => {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate cart initialization
    if (!state.isInitialized) {
      errors.push("Cart is not properly initialized")
    }

    // Validate item consistency
    state.items.forEach((item, index) => {
      if (!item.id) {
        errors.push(`Item ${index + 1}: Missing ID`)
      }
      if (!item.name) {
        errors.push(`Item ${index + 1}: Missing name`)
      }
      if (item.price <= 0) {
        errors.push(`Item ${index + 1}: Invalid price (${item.price})`)
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Invalid quantity (${item.quantity})`)
      }
      if (item.maxQuantity && item.quantity > item.maxQuantity) {
        errors.push(`Item ${index + 1}: Quantity exceeds maximum (${item.quantity} > ${item.maxQuantity})`)
      }
    })

    // Validate calculations
    const calculatedTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const calculatedItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

    if (Math.abs(state.total - calculatedTotal) > 0.01) {
      errors.push(`Total calculation mismatch: ${state.total} vs ${calculatedTotal}`)
    }

    if (state.itemCount !== calculatedItemCount) {
      errors.push(`Item count mismatch: ${state.itemCount} vs ${calculatedItemCount}`)
    }

    // Validate duplicates
    const itemKeys = state.items.map((item) => `${item.id}-${item.size}`)
    const uniqueKeys = new Set(itemKeys)
    if (itemKeys.length !== uniqueKeys.size) {
      errors.push("Duplicate items found in cart")
    }

    // Warnings
    if (state.items.length > 20) {
      warnings.push("Large number of items in cart may affect performance")
    }

    if (state.total > 10000) {
      warnings.push("Very high cart total - consider order limits")
    }

    state.items.forEach((item) => {
      if (item.quantity > 50) {
        warnings.push(`High quantity for ${item.name}: ${item.quantity}`)
      }
    })

    setValidation({
      isValid: errors.length === 0,
      errors,
      warnings,
    })
  }

  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span>Cart state is valid</span>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              ✓ Validated
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-2">
      {validation.errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-1">
              <div className="font-medium">Cart Validation Errors:</div>
              {validation.errors.map((error, index) => (
                <div key={index} className="text-sm">
                  • {error}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {validation.warnings.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-1">
              <div className="font-medium">Cart Validation Warnings:</div>
              {validation.warnings.map((warning, index) => (
                <div key={index} className="text-sm">
                  • {warning}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}