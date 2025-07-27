"use client"

import Link from "next/link"
import { Award } from "lucide-react"
import { useLoyalty } from "@/contexts/loyalty-context"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

export default function LoyaltyPointsDisplay() {
  const loyalty = useLoyalty()

  if (loyalty.isLoading) {
    return (
      <div className="flex items-center gap-1 text-gray-300 animate-pulse">
        <Award className="h-4 w-4" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/loyalty" className="flex items-center gap-1 hover:text-gray-200 transition-colors">
            <Award className="h-4 w-4" />
            <span>{loyalty.points.toLocaleString()} points</span>
            <Badge className="ml-1 text-xs" style={{ backgroundColor: loyalty.tier.color, color: "#000" }}>
              {loyalty.tier.name}
            </Badge>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-0" side="bottom">
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Your Loyalty Status</div>
              <Badge className="text-xs" style={{ backgroundColor: loyalty.tier.color, color: "#000" }}>
                {loyalty.tier.name}
              </Badge>
            </div>
            <div className="text-sm text-gray-500 mb-3">{loyalty.points.toLocaleString()} points</div>

            {loyalty.nextTier ? (
              <>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{loyalty.tier.name}</span>
                  <span>{loyalty.nextTier.name}</span>
                </div>
                <Progress value={loyalty.tierProgress} className="h-1 mb-2" />
                <div className="text-xs text-gray-500">
                  {loyalty.pointsToNextTier.toLocaleString()} points to {loyalty.nextTier.name}
                </div>
              </>
            ) : (
              <div className="text-xs text-gray-500">You've reached the highest tier!</div>
            )}
          </div>
          <div className="border-t p-2">
            <Link
              href="/loyalty"
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors block text-center"
            >
              View Rewards Program
            </Link>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}