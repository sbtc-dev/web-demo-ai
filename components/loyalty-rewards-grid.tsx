"use client"

import { useState } from "react"
import { useLoyalty } from "@/contexts/loyalty-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Percent, CreditCard, Truck, AlertCircle } from "lucide-react"

export default function LoyaltyRewardsGrid() {
  const loyalty = useLoyalty()
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Group rewards by type
  const percentageRewards = loyalty.availableRewards.filter((r) => r.discountType === "percentage")
  const fixedRewards = loyalty.availableRewards.filter((r) => r.discountType === "fixed")
  const shippingRewards = loyalty.availableRewards.filter((r) => r.discountType === "shipping")

  // All rewards for "All" tab
  const allRewards = loyalty.availableRewards

  // Unavailable rewards (for display)
  const unavailableRewards = [
    ...loyalty.availableRewards.filter((r) => !r.isActive),
    ...AVAILABLE_REWARDS.filter((r) => !loyalty.availableRewards.some((ar) => ar.id === r.id)),
  ]

  const handleRewardClick = (reward: any) => {
    setSelectedReward(reward)
    setIsDialogOpen(true)
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-5 w-5 text-green-500" />
      case "fixed":
        return <CreditCard className="h-5 w-5 text-blue-500" />
      case "shipping":
        return <Truck className="h-5 w-5 text-purple-500" />
      default:
        return <Gift className="h-5 w-5 text-gray-500" />
    }
  }

  const renderRewardCard = (reward: any) => (
    <Card
      key={reward.id}
      className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${!reward.isActive && "opacity-60"}`}
      onClick={() => reward.isActive && handleRewardClick(reward)}
    >
      <div
        className="h-2"
        style={{
          background:
            reward.discountType === "percentage"
              ? "linear-gradient(to right, #10b981, #34d399)"
              : reward.discountType === "fixed"
                ? "linear-gradient(to right, #3b82f6, #60a5fa)"
                : "linear-gradient(to right, #8b5cf6, #a78bfa)",
        }}
      ></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            {getRewardIcon(reward.discountType)}
            {reward.name}
          </CardTitle>
          <Badge variant="outline">{reward.pointsCost} pts</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500">{reward.description}</p>
        {reward.minOrderValue && <p className="text-xs text-gray-400 mt-1">Min. order: SAR {reward.minOrderValue}</p>}
        {reward.maxDiscount && <p className="text-xs text-gray-400">Max discount: SAR {reward.maxDiscount}</p>}
      </CardContent>
      <CardFooter>
        <Button
          variant={reward.isActive ? "default" : "outline"}
          size="sm"
          className="w-full"
          disabled={!reward.isActive}
        >
          {reward.isActive ? "View Reward" : "Not Available"}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="percentage">Percentage</TabsTrigger>
          <TabsTrigger value="fixed">Fixed Amount</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {allRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRewards.map(renderRewardCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No rewards available yet</h3>
              <p className="text-gray-500 mt-2">Earn more points to unlock rewards!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="percentage">
          {percentageRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {percentageRewards.map(renderRewardCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Percent className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No percentage discounts available yet</h3>
              <p className="text-gray-500 mt-2">Earn more points to unlock percentage discounts!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="fixed">
          {fixedRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fixedRewards.map(renderRewardCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No fixed amount discounts available yet</h3>
              <p className="text-gray-500 mt-2">Earn more points to unlock fixed amount discounts!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="shipping">
          {shippingRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shippingRewards.map(renderRewardCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No shipping rewards available yet</h3>
              <p className="text-gray-500 mt-2">Earn more points to unlock shipping rewards!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Unavailable rewards section */}
      {unavailableRewards.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700">Locked Rewards</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {unavailableRewards.slice(0, 3).map(renderRewardCard)}
          </div>
        </div>
      )}

      {/* Reward Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedReward && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getRewardIcon(selectedReward.discountType)}
                {selectedReward.name}
              </DialogTitle>
              <DialogDescription>{selectedReward.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Point Cost</div>
                    <div className="font-medium">{selectedReward.pointsCost} points</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Discount Type</div>
                    <div className="font-medium capitalize">{selectedReward.discountType}</div>
                  </div>
                  {selectedReward.minOrderValue && (
                    <div>
                      <div className="text-sm text-gray-500">Minimum Order</div>
                      <div className="font-medium">SAR {selectedReward.minOrderValue}</div>
                    </div>
                  )}
                  {selectedReward.maxDiscount && (
                    <div>
                      <div className="text-sm text-gray-500">Maximum Discount</div>
                      <div className="font-medium">SAR {selectedReward.maxDiscount}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">How to Redeem</h4>
                <ol className="list-decimal pl-5 text-sm space-y-1 text-gray-600">
                  <li>Add products to your cart</li>
                  <li>Proceed to checkout</li>
                  <li>Select this reward in the loyalty rewards section</li>
                  <li>The discount will be applied to your order</li>
                </ol>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                <p>
                  <strong>Note:</strong> This reward will be available during checkout when your cart meets the
                  requirements.
                </p>
              </div>
            </div>

            <DialogFooter className="flex sm:justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Got it</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

// Import from context to avoid circular dependency
const AVAILABLE_REWARDS = [
  {
    id: "discount-5",
    name: "5% Discount",
    description: "Get 5% off your entire order",
    pointsCost: 500,
    discountValue: 5,
    discountType: "percentage",
    maxDiscount: 100,
    isActive: true,
  },
  {
    id: "discount-10",
    name: "10% Discount",
    description: "Get 10% off your entire order",
    pointsCost: 1000,
    discountValue: 10,
    discountType: "percentage",
    maxDiscount: 200,
    isActive: true,
  },
  {
    id: "discount-15",
    name: "15% Discount",
    description: "Get 15% off your entire order (Gold+ only)",
    pointsCost: 1500,
    discountValue: 15,
    discountType: "percentage",
    maxDiscount: 300,
    isActive: true,
  },
  {
    id: "fixed-25",
    name: "SAR 25 Off",
    description: "Get SAR 25 off your order",
    pointsCost: 400,
    discountValue: 25,
    discountType: "fixed",
    minOrderValue: 100,
    isActive: true,
  },
  {
    id: "fixed-50",
    name: "SAR 50 Off",
    description: "Get SAR 50 off your order",
    pointsCost: 750,
    discountValue: 50,
    discountType: "fixed",
    minOrderValue: 200,
    isActive: true,
  },
  {
    id: "fixed-100",
    name: "SAR 100 Off",
    description: "Get SAR 100 off your order",
    pointsCost: 1500,
    discountValue: 100,
    discountType: "fixed",
    minOrderValue: 400,
    isActive: true,
  },
  {
    id: "fixed-200",
    name: "SAR 200 Off",
    description: "Get SAR 200 off your order (Platinum only)",
    pointsCost: 2500,
    discountValue: 200,
    discountType: "fixed",
    minOrderValue: 800,
    isActive: true,
  },
  {
    id: "free-shipping",
    name: "Free Express Shipping",
    description: "Get free express shipping on your order",
    pointsCost: 300,
    discountValue: 48.75,
    discountType: "shipping",
    isActive: true,
  },
]