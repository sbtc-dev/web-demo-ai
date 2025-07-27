import Header from "@/components/header"
import ProductShowcase from "@/components/product-showcase"
import Footer from "@/components/footer"

export default function ProductsShowcasePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ProductShowcase />
      <Footer />
    </div>
  )
}