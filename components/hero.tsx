"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Premium FMCG Products
            <br />
            <span className="text-gray-600">for Your Business</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our comprehensive range of fast-moving consumer goods. From beverages to household essentials, we
            supply quality products for your business needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3">
              Explore Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Business Solutions
            </Button>
          </div>

          <p className="text-sm text-gray-500">Trusted by 10,000+ businesses worldwide</p>
        </div>

        {/* Hero Product Showcase */}
        <div className="mt-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-full h-48 rounded-xl mb-4 flex items-center justify-center bg-gray-50">
                <img
                  src="/images/soy-sauce-140ml.jpg"
                  alt="Indofood Soy Sauce 140ml"
                  className="w-auto h-40 object-contain"
                  loading="eager"
                  style={{ imageRendering: "crisp-edges" }}
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Condiments</h3>
              <p className="text-gray-600 text-sm">Authentic Asian flavors for your kitchen</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-full h-48 rounded-xl mb-4 flex items-center justify-center bg-gray-50">
                <img
                  src="/images/indomie-vegetable.jpg"
                  alt="Indomie Instant Noodles Vegetable"
                  className="w-auto h-40 object-contain"
                  loading="eager"
                  style={{ imageRendering: "crisp-edges" }}
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Foods</h3>
              <p className="text-gray-600 text-sm">Quick and delicious meal solutions</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-full h-48 rounded-xl mb-4 flex items-center justify-center bg-gray-50">
                <img
                  src="/images/siwakf-toothpaste.png"
                  alt="SiwakF Junior Toothpaste"
                  className="w-auto h-40 object-contain"
                  loading="eager"
                  style={{ imageRendering: "crisp-edges" }}
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Personal Care</h3>
              <p className="text-gray-600 text-sm">Quality hygiene products for families</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}