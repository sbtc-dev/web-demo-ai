import Hero from "@/components/hero"
import Categories from "@/components/categories"
import FeaturedProducts from "@/components/featured-products"
import BusinessFeatures from "@/components/business-features"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <BusinessFeatures />
    </div>
  )
}