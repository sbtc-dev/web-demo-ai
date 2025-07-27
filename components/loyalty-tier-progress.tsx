"use client"

import { useLoyalty } from "@/contexts/loyalty-context"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function LoyaltyTierProgress() {
  const loyalty = useLoyalty()
  const { tier, nextTier, tierProgress, pointsToNextTier } = loyalty

  // Define all tiers for visualization
  const tiers = [
    { name: "BRONZE", color: "#CD7F32", minPoints: 0 },
    { name: "SILVER", color: "#C0C0C0", minPoints: 1000 },
    { name: "GOLD", color: "#FFD700", minPoints: 5000 },
    { name: "PLATINUM", color: "#E5E4E2", minPoints: 15000 },
  ]

  return (
    <div className="space-y-6">
      {/* Current tier info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Current Tier</div>
          <div className="flex items-center gap-2">
            <Badge className="text-sm" style={{ backgroundColor: tier.color, color: "#000" }}>
              {tier.name}
            </Badge>
            <span className="font-medium">{tier.name} Member</span>
          </div>
        </div>
        {nextTier ? (
          <div>
            <div className="text-sm text-gray-500 mb-1">Next Tier</div>
            <div className="flex items-center gap-2">
              <Badge className="text-sm" style={{ backgroundColor: nextTier.color, color: "#000" }}>
                {nextTier.name}
              </Badge>
              <span className="font-medium">{pointsToNextTier.toLocaleString()} points needed</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">MAX TIER</Badge>
              <span className="font-medium">You've reached the highest tier!</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{tier.name}</span>
          {nextTier ? <span>{nextTier.name}</span> : <span>MAX</span>}
        </div>
        <Progress value={tierProgress} className="h-2" />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{loyalty.points.toLocaleString()} points</span>
          {nextTier && <span>{nextTier.minPoints.toLocaleString()} points</span>}
        </div>
      </div>

      {/* All tiers visualization */}
      <div className="pt-6 border-t">
        <h4 className="text-sm font-medium mb-4">All Loyalty Tiers</h4>
        <div className="relative">
          {/* Progress bar background */}
          <div className="h-2 bg-gray-100 rounded-full"></div>

          {/* Tier markers */}
          {tiers.map((t, index) => (
            <div
              key={t.name}
              className="absolute top-0 transform -translate-y-1/2"
              style={{
                left: `${(t.minPoints / 15000) * 100}%`,
                minWidth: "1px",
                maxWidth: "100%",
              }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{
                  backgroundColor: t.color,
                  boxShadow: loyalty.tier.name === t.name ? "0 0 0 2px rgba(0,0,0,0.2)" : "none",
                }}
              ></div>
              <div
                className={`mt-2 text-xs font-medium ${
                  loyalty.tier.name === t.name ? "text-gray-900" : "text-gray-500"
                }`}
                style={{
                  transform:
                    index === 0
                      ? "translateX(0)"
                      : index === tiers.length - 1
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                }}
              >
                {t.name}
                <div className="text-gray-400">{t.minPoints.toLocaleString()}+</div>
              </div>
            </div>
          ))}

          {/* Current position marker */}
          <div
            className="absolute top-0 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${Math.min((loyalty.points / 15000) * 100, 100)}%`,
            }}
          >
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Tier benefits */}
      <div className="pt-6 border-t">
        <h4 className="text-sm font-medium mb-4">Your {tier.name} Benefits</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tier.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tier.color }}></div>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}