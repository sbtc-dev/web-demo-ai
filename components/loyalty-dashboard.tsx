"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, History, Award, TrendingUp, HelpCircle, Share2 } from "lucide-react"
import { useLoyalty } from "@/contexts/loyalty-context"
import LoyaltyTierProgress from "@/components/loyalty-tier-progress"
import LoyaltyRewardsGrid from "@/components/loyalty-rewards-grid"
import LoyaltyTransactionHistory from "@/components/loyalty-transaction-history"

export default function LoyaltyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const loyalty = useLoyalty()

  if (loyalty.isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your loyalty information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">SBTC Rewards Program</h1>
            <p className="text-gray-300 mb-4 max-w-2xl">
              Earn points with every purchase and unlock exclusive rewards, discounts, and benefits as you progress
              through our loyalty tiers.
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-sm text-gray-300">Your Points Balance</div>
            <div className="text-4xl font-bold">{loyalty.points.toLocaleString()}</div>
            <Badge className="mt-2" style={{ backgroundColor: loyalty.tier.color, color: "#000" }}>
              {loyalty.tier.name} TIER
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span>Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>How It Works</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier Status Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Tier Status
                </CardTitle>
                <CardDescription>Track your progress and unlock more benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <LoyaltyTierProgress />
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
                <CardDescription>Your loyalty at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Points Balance</div>
                  <div className="text-2xl font-bold">{loyalty.points.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Current Tier</div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: loyalty.tier.color, color: "#000" }}>{loyalty.tier.name}</Badge>
                    <span className="text-lg font-medium">{loyalty.tier.name} Member</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Points to Next Tier</div>
                  <div className="text-lg font-medium">
                    {loyalty.nextTier
                      ? `${loyalty.pointsToNextTier.toLocaleString()} points to ${loyalty.nextTier.name}`
                      : "You've reached the highest tier!"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Available Rewards</div>
                  <div className="text-lg font-medium">{loyalty.availableRewards.length} rewards available</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("rewards")}>
                  <Gift className="h-4 w-4 mr-2" />
                  View Available Rewards
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Transactions Card */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Your recent point activity</CardDescription>
              </CardHeader>
              <CardContent>
                <LoyaltyTransactionHistory limit={5} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("history")}>
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Available Rewards
              </CardTitle>
              <CardDescription>Redeem your points for these exclusive rewards and discounts</CardDescription>
            </CardHeader>
            <CardContent>
              <LoyaltyRewardsGrid />
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>Complete record of your point activity</CardDescription>
            </CardHeader>
            <CardContent>
              <LoyaltyTransactionHistory />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                How the SBTC Rewards Program Works
              </CardTitle>
              <CardDescription>Everything you need to know about our loyalty program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* How to Earn Points */}
              <div>
                <h3 className="text-xl font-semibold mb-3">How to Earn Points</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-3">
                    Earning points is simple! For every SAR 10 you spend on eligible purchases, you'll earn:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Bronze Tier:</span> 1 point (standard rate)
                    </li>
                    <li>
                      <span className="font-medium">Silver Tier:</span> 1.2 points (20% bonus)
                    </li>
                    <li>
                      <span className="font-medium">Gold Tier:</span> 1.5 points (50% bonus)
                    </li>
                    <li>
                      <span className="font-medium">Platinum Tier:</span> 2 points (100% bonus)
                    </li>
                  </ul>
                  <p className="mt-3">
                    Points are automatically credited to your account after each purchase and are valid for 12 months
                    from the date of issue.
                  </p>
                </div>
              </div>

              {/* Loyalty Tiers */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Loyalty Tiers and Benefits</h3>
                <div className="space-y-4">
                  {/* Bronze Tier */}
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderLeftColor: "#CD7F32" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge style={{ backgroundColor: "#CD7F32", color: "#000" }}>BRONZE</Badge>
                      <span className="font-semibold">0+ points</span>
                    </div>
                    <p className="text-sm mb-2">Everyone starts at Bronze tier and enjoys:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Standard earning rate (1 point per SAR 10)</li>
                      <li>Access to basic rewards</li>
                      <li>Standard customer support</li>
                    </ul>
                  </div>

                  {/* Silver Tier */}
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderLeftColor: "#C0C0C0" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge style={{ backgroundColor: "#C0C0C0", color: "#000" }}>SILVER</Badge>
                      <span className="font-semibold">1,000+ points</span>
                    </div>
                    <p className="text-sm mb-2">Reach Silver tier to unlock:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>20% bonus points (1.2 points per SAR 10)</li>
                      <li>Priority customer support</li>
                      <li>Early access to new products</li>
                      <li>Special birthday bonus points</li>
                    </ul>
                  </div>

                  {/* Gold Tier */}
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderLeftColor: "#FFD700" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge style={{ backgroundColor: "#FFD700", color: "#000" }}>GOLD</Badge>
                      <span className="font-semibold">5,000+ points</span>
                    </div>
                    <p className="text-sm mb-2">Reach Gold tier to unlock:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>50% bonus points (1.5 points per SAR 10)</li>
                      <li>Free standard shipping on all orders</li>
                      <li>Access to exclusive products</li>
                      <li>Extended return period (30 days)</li>
                      <li>Dedicated account manager</li>
                    </ul>
                  </div>

                  {/* Platinum Tier */}
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderLeftColor: "#E5E4E2" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge style={{ backgroundColor: "#E5E4E2", color: "#000" }}>PLATINUM</Badge>
                      <span className="font-semibold">15,000+ points</span>
                    </div>
                    <p className="text-sm mb-2">Our most exclusive tier with premium benefits:</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>100% bonus points (2 points per SAR 10)</li>
                      <li>Free express shipping on all orders</li>
                      <li>Personal shopping assistant</li>
                      <li>Invitations to VIP events</li>
                      <li>Premium 24/7 support</li>
                      <li>Exclusive Platinum-only rewards</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Redeeming Points */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Redeeming Your Points</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-3">You can redeem your points for a variety of rewards during checkout:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Percentage Discounts:</span> 5%, 10%, or 15% off your order
                    </li>
                    <li>
                      <span className="font-medium">Fixed Amount Discounts:</span> SAR 25, 50, 100, or 200 off your
                      order
                    </li>
                    <li>
                      <span className="font-medium">Free Shipping:</span> Get free express shipping on your order
                    </li>
                  </ul>
                  <p className="mt-3">
                    Simply select the reward you want to apply during checkout. Some rewards have minimum order values
                    or are exclusive to certain tiers.
                  </p>
                </div>
              </div>

              {/* Tips & Strategies */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Tips to Maximize Your Rewards</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Bulk Orders:</span> Larger orders earn more points at once, helping
                      you reach higher tiers faster
                    </li>
                    <li>
                      <span className="font-medium">Watch for Promotions:</span> We occasionally offer double or triple
                      points on certain products or categories
                    </li>
                    <li>
                      <span className="font-medium">Tier Strategy:</span> Once you reach a higher tier, you'll earn
                      points faster, so it's worth investing in reaching the next level
                    </li>
                    <li>
                      <span className="font-medium">Point Expiration:</span> Points expire after 12 months, so remember
                      to use them before they expire
                    </li>
                  </ul>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How do I join the rewards program?</h4>
                    <p>
                      You're automatically enrolled when you create an account with SBTC. There are no additional steps
                      required!
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">When do my points expire?</h4>
                    <p>
                      Points are valid for 12 months from the date they were earned. Expiring points will be marked in
                      your transaction history.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">What happens if I return an item?</h4>
                    <p>
                      If you return an item, the points earned from that purchase will be deducted from your account. If
                      you've already used those points, your point balance may go negative until you earn more points.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Can I transfer my points to someone else?</h4>
                    <p>
                      Currently, points cannot be transferred between accounts. Each business account earns and redeems
                      its own points.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("overview")}>
                Back to Overview
              </Button>
              <Button variant="default" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share Program
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}