import { CartPageSkeleton } from "@/components/cart-page-skeleton"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartPageSkeleton />
      <Footer />
    </div>
  )
}