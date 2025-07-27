"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const brands = [
  {
    name: "Indofood",
    description: "Seasoning, Sauce",
    productCount: 5,
    color: "from-blue-500 to-blue-600",
    image: {
      url: "/images/soy-sauce-140ml.jpg",
      classes: "w-16 h-20"
    }
  },
  {
    name: "Indomie",
    description: "Instant Noodles",
    productCount: 30,
    color: "from-orange-500 to-orange-600",
    image: {
      url: "/images/indomie-vegetable.jpg",
      classes: "w-20 h-24"
    }
  },
  {
    name: "Siwak-F",
    description: "Toothpaste",
    productCount: 2,
    color: "from-pink-500 to-pink-600",
    image: {
      url: "/images/siwakf-toothpaste.png",
      classes: "w-16 h-20"
    }
  },
  {
    name: "Ajinomoto",
    description: "Seasoning",
    productCount: 1,
    color: "from-green-500 to-green-600",
    image: {
      url: "/images/aji-no-moto.jpg",
      classes: "w-16 h-20"
    }
  },
  {
    name: "Steviana",
    description: "Seasoning, Sweetener",
    productCount: 1,
    color: "from-purple-500 to-purple-600",
    image: {
      url: "/images/steviana-sweetener.png",
      classes: "w-16 h-20"
    }
  },
]

export default function Brands() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop by Brand</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of FMCG brands organized by brand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {brands.map((brand, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200"
            >
              <CardContent className="p-6">
                <div
                  className={`w-full h-32 bg-gradient-to-r ${brand.color} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}
                >
                  <img
                    src={brand.image.url}
                    alt={brand.name}
                    className={`${brand.image.classes} object-contain`}
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-gray-600 mb-3">{brand.description}</p>
                <p className="text-sm font-medium text-gray-500 mb-4">{brand.productCount} products</p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-gray-900 group-hover:text-white transition-colors"
                >
                  Browse Brand
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8">
            View All Brands
          </Button>
        </div>
      </div>
    </section>
  )
}