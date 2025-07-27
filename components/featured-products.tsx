"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { formatSAR } from "@/lib/currency"
import { useState } from "react"

// Define product type for better type safety
interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice: number | null
  rating: number
  reviews: number
  badge: string
  image: string
  sizes: string[]
  category: string
  minQuantity: number
  quantityUnit: string
  unitsPerCarton: number
  cartonDescription: string
}

// Product data
const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Indofood Sweet Soy Sauce 140ml",
    brand: "Indofood",
    price: 14.99,
    originalPrice: 18.75,
    rating: 4.8,
    reviews: 156,
    badge: "Best Seller",
    image: "/images/soy-sauce-140ml.jpg",
    sizes: ["140ml", "340ml"],
    category: "Condiments & Sauces",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 12,
    cartonDescription: "12 bottles per carton",
  },
  {
    id: 2,
    name: "Indomie Instant Noodles - Vegetable",
    brand: "Indomie",
    price: 3.35,
    originalPrice: null,
    rating: 4.9,
    reviews: 289,
    badge: "Popular",
    image: "/images/indomie-vegetable.jpg",
    sizes: ["Single Pack", "5-Pack", "30-Pack"],
    category: "Instant Food",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 24,
    cartonDescription: "24 packs per carton",
  },
  {
    id: 3,
    name: "Steviana Natural Sweetener",
    brand: "Steviana",
    price: 33.75,
    originalPrice: 41.25,
    rating: 4.7,
    reviews: 134,
    badge: "Organic",
    image: "/images/steviana-sweetener.png",
    sizes: ["50 Sachets"],
    category: "Sweeteners",
    minQuantity: 1,
    quantityUnit: "box",
    unitsPerCarton: 6,
    cartonDescription: "6 units per box",
  },
  {
    id: 4,
    name: "SiwakF Junior Toothpaste",
    brand: "SiwakF",
    price: 18.75,
    originalPrice: null,
    rating: 4.6,
    reviews: 78,
    badge: "Kids",
    image: "/images/siwakf-toothpaste.png",
    sizes: ["50g"],
    category: "Personal Care",
    minQuantity: 1,
    quantityUnit: "case",
    unitsPerCarton: 18,
    cartonDescription: "18 tubes per case",
  },
  {
    id: 5,
    name: "Aji-No-Moto Flavor Enhancer",
    brand: "Aji-No-Moto",
    price: 59.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 203,
    badge: "Professional",
    image: "/images/aji-no-moto.jpg",
    sizes: ["1kg"],
    category: "Flavor Enhancers",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 20,
    cartonDescription: "20 packets per carton",
  },
  {
    id: 6,
    name: "Indomie Cup Noodles - Vegetable",
    brand: "Indomie",
    price: 5.6,
    originalPrice: null,
    rating: 4.7,
    reviews: 167,
    badge: "Convenient",
    image: "/images/indomie-cup.jpg",
    sizes: ["Single Cup", "12-Pack"],
    category: "Instant Food",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 12,
    cartonDescription: "12 cups per carton",
  },
]

export default function FeaturedProducts() {
  const { addItem, openCart, isLoading } = useCart()
  const [addingItemId, setAddingItemId] = useState<number | null>(null)

  const handleAddToCart = (product: Product) => {
    try {
      setAddingItemId(product.id)

      addItem({
        id: String(product.id),
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        size: product.sizes[0],
        category: product.category,
        minQuantity: product.minQuantity,
        quantityUnit: product.quantityUnit,
        unitsPerCarton: product.unitsPerCarton,
        cartonDescription: product.cartonDescription,
      })

      // Open cart after adding item
      openCart()

      // Reset adding state after a short delay
      setTimeout(() => {
        setAddingItemId(null)
      }, 500)
    } catch (error) {
      console.error("Error adding item to cart:", error)
      setAddingItemId(null)
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our top-rated FMCG products trusted by businesses worldwide
          </p>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
            <p className="text-sm text-blue-800 font-medium">
              <Package className="inline w-4 h-4 mr-2" />
              B2B Wholesale Only - All products require minimum 1 carton purchase
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 bg-white border-gray-200"
            >
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-32 sm:h-36 md:h-40 lg:h-32 xl:h-36 object-contain rounded-lg bg-gray-50 transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=144&width=144"
                    }}
                  />
                  <Badge className="absolute top-2 left-2 bg-white text-gray-900 hover:bg-white">{product.badge}</Badge>
                  {/* Minimum Quantity Badge */}
                  <Badge className="absolute bottom-2 left-2 bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    <Package className="w-3 h-3 mr-1" />
                    Min: 1 {product.quantityUnit}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{product.cartonDescription}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Prominent Minimum Order Information */}
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-900">Minimum Order</div>
                      <div className="text-lg font-bold text-blue-800">1 {product.quantityUnit}</div>
                      <div className="text-xs text-blue-600">({product.unitsPerCarton} individual units)</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">{formatSAR(product.price)}</span>
                      <div className="text-xs text-gray-500">per {product.quantityUnit}</div>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{formatSAR(product.originalPrice)}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 font-medium">
                        {formatSAR(product.price / product.unitsPerCarton)}
                      </div>
                      <div className="text-xs text-gray-500">per unit</div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => handleAddToCart(product)}
                    disabled={isLoading || addingItemId === product.id}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {addingItemId === product.id ? "Adding..." : `Add 1 ${product.quantityUnit}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}