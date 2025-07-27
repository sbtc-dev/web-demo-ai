"use client"

import type React from "react"
import { useCart } from "@/contexts/cart-context"

interface ProductDetailProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
  }
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product)
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} style={{ maxWidth: "300px" }} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  )
}

export default ProductDetail