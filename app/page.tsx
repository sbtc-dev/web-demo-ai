import Hero from "@/components/hero"
import Brands from "@/components/brands"
import FeaturedProducts from "@/components/featured-products"
import BusinessFeatures from "@/components/business-features"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Brands />
      <FeaturedProducts />
      <BusinessFeatures />
    </div>
  )
}