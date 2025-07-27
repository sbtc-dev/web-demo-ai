"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Check, ChevronDown, ChevronUp, X } from "lucide-react"
import { useLoyalty } from "@/contexts/loyalty-context"
import { formatSAR } from "@/lib/currency"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CheckoutLoyaltySectionProps {
  subtotal: number
}

export default function CheckoutLoyaltySection({ subtotal }: CheckoutLoyaltySectionProps) {
  const { points, availableRewards, appliedReward, applyReward, removeReward, tier, calculateEarningPreview } =
    useLoyalty()
  const [isOpen, setIsOpen] = useState(false)

  // Filter rewards that are applicable to the current order
  const applicableRewards = availableRewards.filter((reward) => {
    if (reward.minOrderValue && subtotal < reward.minOrderValue) {
      return false
    }
    return true
  })

  // Calculate points to be earned
  const pointsToEarn = calculateEarningPreview(subtotal)

  // If user has no points or no applicable rewards, show simplified view
  if (points === 0 || applicableRewards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              <Award className="h-4 w-4" />
            </div>
            Loyalty Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            {points === 0 ? (
              <div className="text-center">
                <p className="text-sm font-medium text-yellow-800">Join our loyalty program!</p>
                <p className="text-xs text-yellow-700 mt-1">You'll earn {pointsToEarn} points with this purchase.</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium text-yellow-800">
                  You have {points} points, but no applicable rewards for this order.
                </p>
                <p className="text-xs text-yellow-700 mt-1">You'll earn {pointsToEarn} points with this purchase.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            <Award className="h-4 w-4" />
          </div>
          Loyalty Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appliedReward ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{appliedReward.name} Applied</p>
                  <p className="text-xs text-green-700">{appliedReward.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeReward} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Remove reward</span>
              </Button>
            </div>
          </div>
        ) : (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">You have {points} points available</p>
                <p className="text-sm text-gray-500">Select a reward to apply to this order</p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  <span className="sr-only">Toggle rewards</span>
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-4 space-y-3">
              {applicableRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{reward.name}</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {reward.pointsCost} pts
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{reward.description}</p>
                  </div>
                  <Button size="sm" onClick={() => applyReward(reward.id, subtotal)}>
                    Apply
                  </Button>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">Points to earn:</span>
            <span className="text-blue-900 font-bold">{pointsToEarn} points</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {tier.name} members earn {tier.multiplier}x points ({tier.multiplier} point per {formatSAR(10)} spent)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}