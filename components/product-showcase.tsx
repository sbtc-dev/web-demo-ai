"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Star, Search, Filter, Package, Eye } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { formatSAR } from "@/lib/currency"

const allProducts = [
  {
    id: "1",
    name: "Premium Soy Sauce 140ml",
    brand: "Kikkoman",
    price: 18.75,
    originalPrice: 22.5,
    image: "/images/soy-sauce-140ml.jpg",
    category: "Condiments",
    rating: 4.8,
    reviews: 124,
    sizes: ["140ml", "340ml"],
    sku: "KIK-SOY-140",
    weight: "140ml",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 12,
    cartonDescription: "12 bottles per carton",
  },
  {
    id: "2",
    name: "Premium Soy Sauce 340ml",
    brand: "Kikkoman",
    price: 33.75,
    originalPrice: 41.25,
    image: "/images/soy-sauce-340ml.jpg",
    category: "Condiments",
    rating: 4.8,
    reviews: 98,
    sizes: ["340ml"],
    sku: "KIK-SOY-340",
    weight: "340ml",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 8,
    cartonDescription: "8 bottles per carton",
  },
  {
    id: "3",
    name: "Instant Noodles - Vegetable",
    brand: "Indomie",
    price: 3.75,
    originalPrice: 4.5,
    image: "/images/indomie-vegetable.jpg",
    category: "Instant Food",
    rating: 4.6,
    reviews: 289,
    sizes: ["Single Pack", "5-Pack"],
    sku: "IND-VEG-001",
    weight: "80g",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 24,
    cartonDescription: "24 packs per carton",
  },
  {
    id: "4",
    name: "Instant Noodles - Chicken",
    brand: "Indomie",
    price: 4.12,
    originalPrice: null,
    image: "/images/indomie-chicken.jpg",
    category: "Instant Food",
    rating: 4.7,
    reviews: 156,
    sizes: ["Single Pack", "5-Pack"],
    sku: "IND-CHK-001",
    weight: "85g",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 24,
    cartonDescription: "24 packs per carton",
  },
  {
    id: "5",
    name: "Instant Noodles - Chicken Curry",
    brand: "Indomie",
    price: 4.5,
    originalPrice: 5.25,
    image: "/images/indomie-chicken-curry.jpg",
    category: "Instant Food",
    rating: 4.6,
    reviews: 92,
    sizes: ["Single Pack", "5-Pack"],
    sku: "IND-CUR-001",
    weight: "80g",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 24,
    cartonDescription: "24 packs per carton",
  },
  {
    id: "6",
    name: "Instant Noodles - Fried",
    brand: "Indomie",
    price: 4.12,
    originalPrice: 4.87,
    image: "/images/indomie-fried.jpg",
    category: "Instant Food",
    rating: 4.7,
    reviews: 145,
    sizes: ["Single Pack", "5-Pack"],
    sku: "IND-FRD-001",
    weight: "85g",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 24,
    cartonDescription: "24 packs per carton",
  },
  {
    id: "7",
    name: "Cup Noodles - Vegetable",
    brand: "Indomie",
    price: 5.62,
    originalPrice: 6.75,
    image: "/images/indomie-cup.jpg",
    category: "Instant Food",
    rating: 4.4,
    reviews: 167,
    sizes: ["Cup", "Bowl"],
    sku: "IND-CUP-VEG",
    weight: "75g",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 12,
    cartonDescription: "12 cups per carton",
  },
  {
    id: "8",
    name: "Natural Sweetener",
    brand: "Steviana",
    price: 28.12,
    originalPrice: 33.75,
    image: "/images/steviana-sweetener.png",
    category: "Sweeteners",
    rating: 4.7,
    reviews: 134,
    sizes: ["100g", "250g"],
    sku: "STV-NAT-100",
    weight: "100g",
    minQuantity: 1,
    quantityUnit: "box",
    unitsPerCarton: 6,
    cartonDescription: "6 units per box",
  },
  {
    id: "9",
    name: "Herbal Toothpaste",
    brand: "Siwak F",
    price: 15.0,
    originalPrice: 18.75,
    image: "/images/siwakf-toothpaste.png",
    category: "Personal Care",
    rating: 4.5,
    reviews: 78,
    sizes: ["75ml", "150ml"],
    sku: "SWK-HRB-75",
    weight: "75ml",
    minQuantity: 1,
    quantityUnit: "case",
    unitsPerCarton: 18,
    cartonDescription: "18 tubes per case",
  },
  {
    id: "10",
    name: "MSG Seasoning",
    brand: "Aji-no-moto",
    price: 11.25,
    originalPrice: 13.5,
    image: "/images/aji-no-moto.jpg",
    category: "Seasonings",
    rating: 4.9,
    reviews: 203,
    sizes: ["100g", "250g"],
    sku: "AJI-MSG-100",
    weight: "100g",
    minQuantity: 1,
    quantityUnit: "carton",
    unitsPerCarton: 20,
    cartonDescription: "20 packets per carton",
  },
]

export default function ProductShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const { addItem, openCart } = useCart()

  const categories = ["All", ...Array.from(new Set(allProducts.map((p) => p.category)))]

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }))
  }

  const handleAddToCart = (product: any) => {
    const selectedSize = selectedSizes[product.id] || product.sizes[0]

    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: selectedSize,
      category: product.category,
      sku: product.sku,
      weight: product.weight,
      minQuantity: product.minQuantity,
      quantityUnit: product.quantityUnit,
      unitsPerCarton: product.unitsPerCarton,
      cartonDescription: product.cartonDescription,
    })

    openCart()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Catalog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Browse our complete selection of premium FMCG products for your business needs
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
            <p className="text-sm text-blue-800 font-medium">
              <Package className="inline w-4 h-4 mr-2" />
              B2B Wholesale Only - All products require minimum 1 carton purchase
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products or brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
                {/* Minimum Quantity Badge */}
                <Badge className="absolute bottom-2 left-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Package className="w-3 h-3 mr-1" />
                  Min: 1 {product.quantityUnit}
                </Badge>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/product/${product.id}`}>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-gray-500 font-medium">{product.cartonDescription}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                  </div>
                </div>

                {/* Prominent Minimum Order Information */}
                <div className="mb-3 p-2 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Minimum Order:</span>
                    <span className="text-gray-900 font-semibold">
                      1 {product.quantityUnit} ({product.unitsPerCarton} units)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{formatSAR(product.price)}</div>
                    <div className="text-xs text-gray-500">per {product.quantityUnit}</div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">{formatSAR(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{formatSAR(product.price / product.unitsPerCarton)}</div>
                    <div className="text-xs text-gray-500">per unit</div>
                  </div>
                </div>

                <div className="mb-3">
                  <Select
                    value={selectedSizes[product.id] || product.sizes[0]}
                    onValueChange={(value) => handleSizeChange(product.id, value)}
                  >
                    <SelectTrigger className="w-full h-8 text-sm">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size} className="text-sm">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add 1 {product.quantityUnit} to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}