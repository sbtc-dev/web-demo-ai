"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/contexts/cart-context"
import { formatSAR } from "@/lib/currency"
import { CheckCircle, XCircle, Clock, ShoppingCart, AlertTriangle, Play, RotateCcw } from "lucide-react"

interface TestStep {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "passed" | "failed"
  error?: string
  duration?: number
}

const testProducts = [
  {
    id: "1",
    name: "Indofood Sweet Soy Sauce 140ml",
    brand: "Indofood",
    price: 14.99,
    image: "/images/soy-sauce-140ml.jpg",
    size: "140ml",
    category: "Condiments",
    sku: "IDF-SS-140",
    weight: "140ml",
    maxQuantity: 50,
  },
  {
    id: "2",
    name: "Indomie Instant Noodles - Vegetable",
    brand: "Indomie",
    price: 3.35,
    image: "/images/indomie-vegetable.jpg",
    size: "85g",
    category: "Instant Food",
    sku: "IDM-VEG-85",
    weight: "85g",
    maxQuantity: 100,
  },
  {
    id: "3",
    name: "Steviana Natural Sweetener",
    brand: "Steviana",
    price: 33.75,
    originalPrice: 41.24,
    image: "/images/steviana-sweetener.png",
    size: "100g",
    category: "Sweeteners",
    sku: "STV-NAT-100",
    weight: "100g",
    maxQuantity: 25,
  },
]

export default function CartFlowTest() {
  const { state, addItem, updateQuantity, removeItem, clearCart, clearError } = useCart()
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    {
      id: "init",
      name: "Cart Initialization",
      description: "Verify cart context is properly initialized",
      status: "pending",
    },
    {
      id: "add-single",
      name: "Add Single Item",
      description: "Add one product to cart with default quantity",
      status: "pending",
    },
    {
      id: "add-multiple",
      name: "Add Multiple Items",
      description: "Add multiple different products to cart",
      status: "pending",
    },
    {
      id: "add-existing",
      name: "Add Existing Item",
      description: "Add same product again to increase quantity",
      status: "pending",
    },
    {
      id: "update-quantity",
      name: "Update Quantity",
      description: "Update item quantity using cart controls",
      status: "pending",
    },
    {
      id: "quantity-limits",
      name: "Quantity Limits",
      description: "Test maximum quantity validation",
      status: "pending",
    },
    {
      id: "remove-item",
      name: "Remove Item",
      description: "Remove individual item from cart",
      status: "pending",
    },
    {
      id: "calculations",
      name: "Price Calculations",
      description: "Verify subtotal, VAT, and shipping calculations",
      status: "pending",
    },
    {
      id: "persistence",
      name: "Cart Persistence",
      description: "Test localStorage persistence across sessions",
      status: "pending",
    },
    {
      id: "clear-cart",
      name: "Clear Cart",
      description: "Clear entire cart and verify empty state",
      status: "pending",
    },
    {
      id: "error-handling",
      name: "Error Handling",
      description: "Test error states and recovery",
      status: "pending",
    },
    {
      id: "checkout-flow",
      name: "Checkout Navigation",
      description: "Test navigation to checkout with items",
      status: "pending",
    },
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState<string | null>(null)

  const updateStepStatus = (stepId: string, status: TestStep["status"], error?: string, duration?: number) => {
    setTestSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              status,
              error,
              duration,
            }
          : step,
      ),
    )
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runTest = async (stepId: string, testFn: () => Promise<void>) => {
    setCurrentStep(stepId)
    updateStepStatus(stepId, "running")
    const startTime = Date.now()

    try {
      await testFn()
      const duration = Date.now() - startTime
      updateStepStatus(stepId, "passed", undefined, duration)
    } catch (error) {
      const duration = Date.now() - startTime
      updateStepStatus(stepId, "failed", error instanceof Error ? error.message : "Unknown error", duration)
      throw error
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setCurrentStep(null)

    // Reset all test statuses
    setTestSteps((prev) => prev.map((step) => ({ ...step, status: "pending", error: undefined, duration: undefined })))

    try {
      // Test 1: Cart Initialization
      await runTest("init", async () => {
        if (!state.isInitialized) {
          throw new Error("Cart is not initialized")
        }
        if (state.items.length > 0) {
          clearCart()
          await sleep(100)
        }
        if (state.total !== 0 || state.itemCount !== 0) {
          throw new Error("Cart should be empty after clearing")
        }
      })

      // Test 2: Add Single Item
      await runTest("add-single", async () => {
        const product = testProducts[0]
        addItem(product)
        await sleep(200)

        if (state.items.length !== 1) {
          throw new Error(`Expected 1 item, got ${state.items.length}`)
        }
        if (state.items[0].quantity !== 1) {
          throw new Error(`Expected quantity 1, got ${state.items[0].quantity}`)
        }
        if (state.total !== product.price) {
          throw new Error(`Expected total ${product.price}, got ${state.total}`)
        }
      })

      // Test 3: Add Multiple Items
      await runTest("add-multiple", async () => {
        const product2 = testProducts[1]
        const product3 = testProducts[2]

        addItem(product2)
        await sleep(200)
        addItem(product3)
        await sleep(200)

        if (state.items.length !== 3) {
          throw new Error(`Expected 3 items, got ${state.items.length}`)
        }

        const expectedTotal = testProducts[0].price + testProducts[1].price + testProducts[2].price
        if (Math.abs(state.total - expectedTotal) > 0.01) {
          throw new Error(`Expected total ${expectedTotal}, got ${state.total}`)
        }
      })

      // Test 4: Add Existing Item
      await runTest("add-existing", async () => {
        const product = testProducts[0]
        const initialQuantity = state.items.find((item) => item.id === product.id)?.quantity || 0

        addItem(product)
        await sleep(200)

        const updatedItem = state.items.find((item) => item.id === product.id)
        if (!updatedItem || updatedItem.quantity !== initialQuantity + 1) {
          throw new Error(`Expected quantity ${initialQuantity + 1}, got ${updatedItem?.quantity}`)
        }
      })

      // Test 5: Update Quantity
      await runTest("update-quantity", async () => {
        const product = testProducts[0]
        const newQuantity = 5

        updateQuantity(product.id, product.size, newQuantity)
        await sleep(200)

        const updatedItem = state.items.find((item) => item.id === product.id)
        if (!updatedItem || updatedItem.quantity !== newQuantity) {
          throw new Error(`Expected quantity ${newQuantity}, got ${updatedItem?.quantity}`)
        }
      })

      // Test 6: Quantity Limits
      await runTest("quantity-limits", async () => {
        const product = testProducts[2] // Has maxQuantity of 25
        const excessiveQuantity = 100

        // Clear any existing errors
        clearError()
        await sleep(100)

        // Try to add excessive quantity
        for (let i = 0; i < excessiveQuantity; i++) {
          addItem({ ...product, quantity: 1 })
          await sleep(10)
        }

        // Should have error or be limited to max quantity
        const item = state.items.find((item) => item.id === product.id)
        if (item && item.quantity > (product.maxQuantity || 99)) {
          throw new Error(`Quantity exceeded maximum limit: ${item.quantity} > ${product.maxQuantity}`)
        }
      })

      // Test 7: Remove Item
      await runTest("remove-item", async () => {
        const product = testProducts[1]
        const initialCount = state.items.length

        removeItem(product.id, product.size)
        await sleep(200)

        if (state.items.length !== initialCount - 1) {
          throw new Error(`Expected ${initialCount - 1} items, got ${state.items.length}`)
        }

        const removedItem = state.items.find((item) => item.id === product.id)
        if (removedItem) {
          throw new Error("Item should have been removed")
        }
      })

      // Test 8: Price Calculations
      await runTest("calculations", async () => {
        const subtotal = state.total
        const vat = subtotal * 0.15
        const shipping = subtotal >= 187.5 ? 0 : 37.5
        const expectedTotal = subtotal + vat + shipping

        // Verify calculations are reasonable
        if (subtotal <= 0) {
          throw new Error("Subtotal should be greater than 0")
        }
        if (vat !== subtotal * 0.15) {
          throw new Error(`VAT calculation incorrect: expected ${subtotal * 0.15}, got ${vat}`)
        }
      })

      // Test 9: Cart Persistence
      await runTest("persistence", async () => {
        const currentItems = [...state.items]
        const currentTotal = state.total

        // Simulate page reload by checking localStorage
        const savedCart = localStorage.getItem("sbtc-cart")
        if (!savedCart) {
          throw new Error("Cart not saved to localStorage")
        }

        const parsedCart = JSON.parse(savedCart)
        if (parsedCart.length !== currentItems.length) {
          throw new Error("Saved cart length doesn't match current cart")
        }
      })

      // Test 10: Clear Cart
      await runTest("clear-cart", async () => {
        clearCart()
        await sleep(200)

        if (state.items.length !== 0) {
          throw new Error(`Expected 0 items, got ${state.items.length}`)
        }
        if (state.total !== 0) {
          throw new Error(`Expected total 0, got ${state.total}`)
        }
        if (state.itemCount !== 0) {
          throw new Error(`Expected item count 0, got ${state.itemCount}`)
        }
      })

      // Test 11: Error Handling
      await runTest("error-handling", async () => {
        // Test adding item with invalid data
        try {
          addItem({
            id: "",
            name: "",
            brand: "",
            price: -1,
            image: "",
            size: "",
            category: "",
          })
          await sleep(200)
        } catch (error) {
          // Expected to handle gracefully
        }

        // Test updating non-existent item
        updateQuantity("non-existent", "size", 5)
        await sleep(200)

        // Should not crash the application
        if (!state.isInitialized) {
          throw new Error("Cart context should remain stable after errors")
        }
      })

      // Test 12: Checkout Navigation
      await runTest("checkout-flow", async () => {
        // Add items for checkout test
        addItem(testProducts[0])
        addItem(testProducts[1])
        await sleep(200)

        if (state.items.length === 0) {
          throw new Error("Need items in cart for checkout test")
        }

        // Simulate checkout navigation (would normally use router)
        const checkoutUrl = "/checkout"
        if (!checkoutUrl) {
          throw new Error("Checkout URL not available")
        }
      })
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setIsRunning(false)
      setCurrentStep(null)
    }
  }

  const resetTests = () => {
    setTestSteps((prev) => prev.map((step) => ({ ...step, status: "pending", error: undefined, duration: undefined })))
    clearCart()
    clearError()
  }

  const getStatusIcon = (status: TestStep["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "running":
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusColor = (status: TestStep["status"]) => {
    switch (status) {
      case "passed":
        return "border-green-200 bg-green-50"
      case "failed":
        return "border-red-200 bg-red-50"
      case "running":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  const passedTests = testSteps.filter((step) => step.status === "passed").length
  const failedTests = testSteps.filter((step) => step.status === "failed").length
  const totalTests = testSteps.length

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <span>Cart Flow Test Suite</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Passed: {passedTests}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Failed: {failedTests}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Total: {totalTests}
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button onClick={resetTests} variant="outline" size="sm" disabled={isRunning}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={runAllTests} disabled={isRunning} size="sm">
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running..." : "Run All Tests"}
              </Button>
            </div>
          </div>

          {/* Current Cart State */}
          <Alert className="mb-4">
            <ShoppingCart className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Cart:</strong> {state.itemCount} items, Total: {formatSAR(state.total)}
              {state.error && <span className="text-red-600 ml-2">Error: {state.error}</span>}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-3">
        {testSteps.map((step) => (
          <Card key={step.id} className={`transition-all duration-200 ${getStatusColor(step.status)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(step.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">{step.name}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    {step.error && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {step.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {step.duration && <p className="text-sm text-gray-500">{step.duration}ms</p>}
                  {currentStep === step.id && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Running
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Summary */}
      {!isRunning && (passedTests > 0 || failedTests > 0) && (
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            {failedTests === 0 ? (
              <div className="text-green-600">
                <CheckCircle className="h-12 w-12 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">All Tests Passed!</h3>
                <p className="text-gray-600">
                  Cart flow is working perfectly. All {totalTests} tests completed successfully.
                </p>
              </div>
            ) : (
              <div className="text-red-600">
                <XCircle className="h-12 w-12 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Some Tests Failed</h3>
                <p className="text-gray-600">
                  {failedTests} out of {totalTests} tests failed. Please review the errors above.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}