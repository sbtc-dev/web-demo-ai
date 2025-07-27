import { Suspense } from "react"
import Header from "@/components/header"
import CartFlowTest from "@/components/cart-flow-test"
import Footer from "@/components/footer"

export const dynamic = "force-dynamic"

function TestPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestCartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<TestPageLoading />}>
          <CartFlowTest />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}