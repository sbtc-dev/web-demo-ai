import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { LoyaltyProvider } from "@/contexts/loyalty-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CartSidebar from "@/components/cart-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SBTC - Premium FMCG B2B Platform",
  description:
    "Your trusted partner for premium FMCG products. Streamlined ordering, competitive pricing, and reliable delivery for businesses across Saudi Arabia.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <LoyaltyProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <CartSidebar />
          </LoyaltyProvider>
        </CartProvider>
      </body>
    </html>
  )
}