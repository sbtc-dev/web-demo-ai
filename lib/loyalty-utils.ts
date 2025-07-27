import type { LoyaltyReward, LoyaltyTier } from "@/contexts/loyalty-context"

// Constants
export const POINTS_PER_SAR = 0.1 // 1 point per SAR 10

// Calculate loyalty points based on order value and tier multiplier
export function calculateLoyaltyPoints(orderValue: number, multiplier = 1.0): number {
  if (orderValue <= 0) return 0

  // Base points (1 point per SAR 10)
  const basePoints = Math.floor(orderValue * POINTS_PER_SAR)

  // Apply tier multiplier
  const bonusPoints = Math.floor(basePoints * (multiplier - 1))

  return basePoints + bonusPoints
}

// Calculate discount based on reward type and order value
export function calculateRewardDiscount(reward: LoyaltyReward, orderValue: number): number {
  if (!reward) return 0

  switch (reward.discountType) {
    case "percentage":
      // Calculate percentage discount
      const percentageDiscount = (orderValue * reward.discountValue) / 100
      // Apply maximum discount cap if exists
      return reward.maxDiscount ? Math.min(percentageDiscount, reward.maxDiscount) : percentageDiscount

    case "fixed":
      // Fixed amount discount
      return reward.discountValue

    case "shipping":
      // Shipping discount
      return reward.discountValue

    default:
      return 0
  }
}

// Validate if a reward can be applied
export function validateRewardEligibility(
  reward: LoyaltyReward,
  userPoints: number,
  orderValue: number,
  userTier: LoyaltyTier,
): { valid: boolean; reason?: string } {
  // Check if reward is active
  if (!reward.isActive) {
    return { valid: false, reason: "This reward is not currently available" }
  }

  // Check if user has enough points
  if (userPoints < reward.pointsCost) {
    return {
      valid: false,
      reason: `You need ${reward.pointsCost - userPoints} more points for this reward`,
    }
  }

  // Check minimum order value if applicable
  if (reward.minOrderValue && orderValue < reward.minOrderValue) {
    return {
      valid: false,
      reason: `This reward requires a minimum order of SAR ${reward.minOrderValue}`,
    }
  }

  // Check tier restrictions
  if (reward.id === "discount-15" && userTier === "BRONZE") {
    return { valid: false, reason: "This reward requires Silver tier or higher" }
  }

  if (reward.id === "fixed-200" && userTier !== "PLATINUM") {
    return { valid: false, reason: "This reward is exclusive to Platinum tier members" }
  }

  // All checks passed
  return { valid: true }
}

// Calculate tier from points
export function calculateTierFromPoints(points: number): LoyaltyTier {
  if (points >= 15000) return "PLATINUM"
  if (points >= 5000) return "GOLD"
  if (points >= 1000) return "SILVER"
  return "BRONZE"
}

// Calculate progress within current tier
export function calculateTierProgress(currentPoints: number, currentTier: LoyaltyTier): number {
  const tierThresholds = {
    BRONZE: { min: 0, max: 1000 },
    SILVER: { min: 1000, max: 5000 },
    GOLD: { min: 5000, max: 15000 },
    PLATINUM: { min: 15000, max: 15000 }, // Max tier
  }

  const { min, max } = tierThresholds[currentTier]

  // If at max tier, return 100%
  if (currentTier === "PLATINUM") return 100

  // Calculate percentage progress to next tier
  const progress = ((currentPoints - min) / (max - min)) * 100
  return Math.min(Math.max(progress, 0), 100) // Clamp between 0-100
}

// Calculate points needed for next tier
export function calculatePointsToNextTier(currentPoints: number, currentTier: LoyaltyTier): number {
  const nextTierThreshold = {
    BRONZE: 1000,
    SILVER: 5000,
    GOLD: 15000,
    PLATINUM: null, // No next tier
  }

  const threshold = nextTierThreshold[currentTier]
  if (threshold === null) return 0 // Already at max tier

  return Math.max(0, threshold - currentPoints)
}

// Calculate bonus points for special events
export function calculateBonusPoints(basePoints: number, eventType: string): number {
  const bonusMultipliers = {
    birthday: 2.0,
    anniversary: 1.5,
    promotion: 1.25,
    referral: 1.0,
  }

  const multiplier = bonusMultipliers[eventType as keyof typeof bonusMultipliers] || 1.0
  return Math.floor(basePoints * multiplier)
}

// Calculate points expiry date
export function calculatePointsExpiry(earnedDate: Date, monthsValid = 12): Date {
  const expiryDate = new Date(earnedDate)
  expiryDate.setMonth(expiryDate.getMonth() + monthsValid)
  return expiryDate
}

// Validate loyalty transaction
export function validateLoyaltyTransaction(
  type: string,
  points: number,
  currentBalance: number,
): { valid: boolean; reason?: string } {
  // Validate redemption
  if (type === "REDEEMED" && Math.abs(points) > currentBalance) {
    return { valid: false, reason: "Insufficient points balance for redemption" }
  }

  // Validate earned points
  if (type === "EARNED" && points <= 0) {
    return { valid: false, reason: "Earned points must be greater than zero" }
  }

  // All checks passed
  return { valid: true }
}