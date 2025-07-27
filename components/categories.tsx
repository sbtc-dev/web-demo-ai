"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Beverages",
    description: "Soft drinks, juices, water",
    products: "2,500+ products",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Food & Snacks",
    description: "Packaged foods, snacks, cereals",
    products: "3,200+ products",
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "Personal Care",
    description: "Hygiene, beauty, health",
    products: "1,800+ products",
    color: "from-pink-500 to-pink-600",
  },
  {
    name: "Household",
    description: "Cleaning, laundry, kitchen",
    products: "1,500+ products",
    color: "from-green-500 to-green-600",
  },
  {
    name: "Baby Care",
    description: "Diapers, formula, baby food",
    products: "800+ products",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Pet Care",
    description: "Pet food, accessories, toys",
    products: "600+ products",
    color: "from-indigo-500 to-indigo-600",
  },
]

export default function Categories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of FMCG products organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200"
            >
              <CardContent className="p-6">
                <div
                  className={`w-full h-32 bg-gradient-to-r ${category.color} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Display actual product images for each category */}
                  {category.name === "Food & Snacks" && (
                    <img
                      src="/images/indomie-vegetable.jpg"
                      alt="Indomie Noodles"
                      className="w-20 h-24 object-contain"
                      loading="lazy"
                    />
                  )}
                  {category.name === "Personal Care" && (
                    <img
                      src="/images/siwakf-toothpaste.png"
                      alt="SiwakF Toothpaste"
                      className="w-16 h-20 object-contain"
                      loading="lazy"
                    />
                  )}
                  {category.name === "Beverages" && (
                    <img
                      src="/images/soy-sauce-140ml.jpg"
                      alt="Soy Sauce"
                      className="w-16 h-20 object-contain"
                      loading="lazy"
                    />
                  )}
                  {category.name === "Household" && (
                    <img
                      src="/images/aji-no-moto.jpg"
                      alt="Aji-No-Moto"
                      className="w-16 h-20 object-contain"
                      loading="lazy"
                    />
                  )}
                  {category.name === "Baby Care" && (
                    <img
                      src="/images/steviana-sweetener.png"
                      alt="Steviana Sweetener"
                      className="w-16 h-20 object-contain"
                      loading="lazy"
                    />
                  )}
                  {category.name === "Pet Care" && (
                    <img
                      src="/images/indomie-cup.jpg"
                      alt="Indomie Cup"
                      className="w-16 h-20 object-contain"
                      loading="lazy"
                    />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <p className="text-sm font-medium text-gray-500 mb-4">{category.products}</p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-gray-900 group-hover:text-white transition-colors"
                >
                  Browse Category
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  )
}