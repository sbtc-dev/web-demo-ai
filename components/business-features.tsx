"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Shield, Users, BarChart3, Clock, Headphones } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery for orders placed before 2 PM in major cities",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "100% authentic products with quality assurance and return policy",
  },
  {
    icon: Users,
    title: "B2B Solutions",
    description: "Dedicated account managers and bulk pricing for business customers",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your orders, spending patterns, and inventory management",
  },
  {
    icon: Clock,
    title: "24/7 Ordering",
    description: "Place orders anytime through our platform or mobile app",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Dedicated support team available to help with your business needs",
  },
]

export default function BusinessFeatures() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose SBTC?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive business solutions tailored for your FMCG needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Start Your Business Journey?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust SBTC for their FMCG supply needs. Get started with our business
            solutions today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}