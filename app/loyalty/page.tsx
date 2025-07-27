import type { Metadata } from "next"
import LoyaltyDashboard from "@/components/loyalty-dashboard"

export const metadata: Metadata = {
  title: "SBTC Rewards | Loyalty Program",
  description: "Earn points on every purchase and redeem them for exclusive rewards and discounts.",
}

export default function LoyaltyPage() {
  return <LoyaltyDashboard />
}