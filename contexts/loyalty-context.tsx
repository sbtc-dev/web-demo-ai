"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { calculateLoyaltyPoints, calculateRewardDiscount, validateRewardEligibility } from "@/lib/loyalty-utils"

// Define loyalty tier structure
export type LoyaltyTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"

export interface LoyaltyTierInfo {
  name: LoyaltyTier
  minPoints: number
  multiplier: number
  benefits: string[]
  color: string
}

// Define loyalty tiers with enhanced benefits
export const LOYALTY_TIERS: Record<LoyaltyTier, LoyaltyTierInfo> = {
  BRONZE: {
    name: "BRONZE",
    minPoints: 0,
    multiplier: 1.0,
    benefits: ["Basic rewards", "Standard support"],
    color: "#CD7F32",
  },
  SILVER: {
    name: "SILVER",
    minPoints: 1000,
    multiplier: 1.2,
    benefits: ["Priority support", "Early access", "Birthday bonus"],
    color: "#C0C0C0",
  },
  GOLD: {
    name: "GOLD",
    minPoints: 5000,
    multiplier: 1.5,
    benefits: ["Free shipping", "Exclusive products", "Extended returns"],
    color: "#FFD700",
  },
  PLATINUM: {
    name: "PLATINUM",
    minPoints: 15000,
    multiplier: 2.0,
    benefits: ["Personal shopper", "VIP events", "Premium support"],
    color: "#E5E4E2",
  },
}

// Define reward structure with enhanced options
export interface LoyaltyReward {
  id: string
  name: string
  description: string
  pointsCost: number
  discountValue: number
  discountType: "percentage" | "fixed" | "shipping" | "product"
  minOrderValue?: number
  maxDiscount?: number
  category?: string
  expiryDays?: number
  isActive: boolean
}

// Define transaction history
export interface LoyaltyTransaction {
  id: string
  type: "EARNED" | "REDEEMED" | "EXPIRED" | "BONUS"
  points: number
  description: string
  orderId?: string
  timestamp: Date
  expiryDate?: Date
}

// Enhanced available rewards
export const AVAILABLE_REWARDS: LoyaltyReward[] = [
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

// Define loyalty context type
interface LoyaltyContextType {
  // Core state
  points: number
  tier: LoyaltyTierInfo
  transactions: LoyaltyTransaction[]
  isLoading: boolean
  error: string | null

  // Rewards
  availableRewards: LoyaltyReward[]
  appliedReward: LoyaltyReward | null
  appliedDiscount: number

  // Calculations
  pointsEarned: number
  nextTier: LoyaltyTierInfo | null
  pointsToNextTier: number
  tierProgress: number

  // Actions
  applyReward: (rewardId: string, orderValue: number) => boolean
  removeReward: () => void
  processOrder: (orderData: any) => Promise<boolean>
  addBonusPoints: (points: number, description: string) => void
  getTransactionHistory: () => LoyaltyTransaction[]
  calculateEarningPreview: (orderValue: number) => number
  validateReward: (rewardId: string, orderValue: number) => { valid: boolean; reason?: string }

  // Utilities
  refreshLoyaltyData: () => Promise<void>
  exportLoyaltyData: () => string
}

// Create context with default values
const LoyaltyContext = createContext<LoyaltyContextType>({
  points: 0,
  tier: LOYALTY_TIERS.BRONZE,
  transactions: [],
  isLoading: false,
  error: null,
  availableRewards: [],
  appliedReward: null,
  appliedDiscount: 0,
  pointsEarned: 0,
  nextTier: null,
  pointsToNextTier: 0,
  tierProgress: 0,
  applyReward: () => false,
  removeReward: () => {},
  processOrder: async () => false,
  addBonusPoints: () => {},
  getTransactionHistory: () => [],
  calculateEarningPreview: () => 0,
  validateReward: () => ({ valid: false }),
  refreshLoyaltyData: async () => {},
  exportLoyaltyData: () => "",
})

// Custom hook to use loyalty context
export const useLoyalty = () => useContext(LoyaltyContext)

// Provider component
export const LoyaltyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState(0)
  const [tier, setTier] = useState<LoyaltyTierInfo>(LOYALTY_TIERS.BRONZE)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [appliedReward, setAppliedReward] = useState<LoyaltyReward | null>(null)
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate next tier and progress
  const { nextTier, pointsToNextTier, tierProgress } = useMemo(() => {
    const tierKeys = Object.keys(LOYALTY_TIERS) as LoyaltyTier[]
    const currentTierIndex = tierKeys.findIndex((key) => LOYALTY_TIERS[key].name === tier.name)
    const next = currentTierIndex < tierKeys.length - 1 ? LOYALTY_TIERS[tierKeys[currentTierIndex + 1]] : null

    const pointsToNext = next ? Math.max(0, next.minPoints - points) : 0
    const progress = next ? Math.min(100, ((points - tier.minPoints) / (next.minPoints - tier.minPoints)) * 100) : 100

    return {
      nextTier: next,
      pointsToNextTier: pointsToNext,
      tierProgress: progress,
    }
  }, [tier, points])

  // Filter available rewards based on points balance and tier
  const availableRewards = useMemo(() => {
    return AVAILABLE_REWARDS.filter((reward) => {
      if (!reward.isActive) return false
      if (points < reward.pointsCost) return false

      // Special tier restrictions
      if (reward.id === "discount-15" && tier.name === "BRONZE") return false
      if (reward.id === "fixed-200" && tier.name !== "PLATINUM") return false

      return true
    })
  }, [points, tier])

  // Load loyalty data from localStorage on mount
  useEffect(() => {
    const loadLoyaltyData = async () => {
      setIsLoading(true)
      try {
        // Load points
        const savedPoints = localStorage.getItem("loyaltyPoints")
        if (savedPoints) {
          const pointsValue = Number.parseInt(savedPoints, 10)
          setPoints(pointsValue)

          // Calculate tier based on points
          const tierKeys = Object.keys(LOYALTY_TIERS) as LoyaltyTier[]
          const userTier = tierKeys
            .map((key) => LOYALTY_TIERS[key])
            .reverse()
            .find((t) => pointsValue >= t.minPoints)

          if (userTier) {
            setTier(userTier)
          }
        }

        // Load transaction history
        const savedTransactions = localStorage.getItem("loyaltyTransactions")
        if (savedTransactions) {
          const parsedTransactions = JSON.parse(savedTransactions).map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp),
            expiryDate: t.expiryDate ? new Date(t.expiryDate) : undefined,
          }))
          setTransactions(parsedTransactions)
        }

        setError(null)
      } catch (error) {
        console.error("Error loading loyalty data:", error)
        setError("Failed to load loyalty data")
      } finally {
        setIsLoading(false)
      }
    }

    loadLoyaltyData()
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("loyaltyPoints", points.toString())
    } catch (error) {
      console.error("Error saving loyalty points:", error)
    }
  }, [points])

  useEffect(() => {
    try {
      localStorage.setItem("loyaltyTransactions", JSON.stringify(transactions))
    } catch (error) {
      console.error("Error saving loyalty transactions:", error)
    }
  }, [transactions])

  // Calculate earning preview
  const calculateEarningPreview = useCallback(
    (orderValue: number) => {
      return calculateLoyaltyPoints(orderValue, tier.multiplier)
    },
    [tier],
  )

  // Validate reward eligibility
  const validateReward = useCallback(
    (rewardId: string, orderValue: number) => {
      const reward = AVAILABLE_REWARDS.find((r) => r.id === rewardId)
      if (!reward) return { valid: false, reason: "Reward not found" }

      return validateRewardEligibility(reward, points, orderValue, tier.name)
    },
    [points, tier],
  )

  // Apply a reward
  const applyReward = useCallback(
    (rewardId: string, orderValue: number) => {
      const validation = validateReward(rewardId, orderValue)
      if (!validation.valid) {
        setError(validation.reason || "Invalid reward")
        return false
      }

      const reward = AVAILABLE_REWARDS.find((r) => r.id === rewardId)
      if (!reward) return false

      setAppliedReward(reward)

      // Calculate discount
      const discount = calculateRewardDiscount(reward, orderValue)
      setAppliedDiscount(discount)
      setError(null)

      return true
    },
    [validateReward],
  )

  // Remove applied reward
  const removeReward = useCallback(() => {
    setAppliedReward(null)
    setAppliedDiscount(0)
    setError(null)
  }, [])

  // Add bonus points
  const addBonusPoints = useCallback((bonusPoints: number, description: string) => {
    const transaction: LoyaltyTransaction = {
      id: `bonus-${Date.now()}`,
      type: "BONUS",
      points: bonusPoints,
      description,
      timestamp: new Date(),
    }

    setTransactions((prev) => [transaction, ...prev])
    setPoints((prev) => prev + bonusPoints)
  }, [])

  // Process order - comprehensive loyalty processing
  const processOrder = useCallback(
    async (orderData: any) => {
      setIsLoading(true)
      try {
        let updatedPoints = points
        const orderTransactions: LoyaltyTransaction[] = []

        // Deduct points if reward was applied
        if (appliedReward) {
          const redeemTransaction: LoyaltyTransaction = {
            id: `redeem-${Date.now()}`,
            type: "REDEEMED",
            points: -appliedReward.pointsCost,
            description: `Redeemed: ${appliedReward.name}`,
            orderId: orderData.orderId,
            timestamp: new Date(),
          }
          orderTransactions.push(redeemTransaction)
          updatedPoints -= appliedReward.pointsCost
        }

        // Calculate and award points for purchase
        const earnedPoints = calculateLoyaltyPoints(orderData.subtotal, tier.multiplier)
        setPointsEarned(earnedPoints)

        if (earnedPoints > 0) {
          const earnTransaction: LoyaltyTransaction = {
            id: `earn-${Date.now()}`,
            type: "EARNED",
            points: earnedPoints,
            description: `Purchase: Order ${orderData.orderId}`,
            orderId: orderData.orderId,
            timestamp: new Date(),
            expiryDate: new Date(Date.now() + 24 * 30 * 12 * 60 * 60 * 1000), // 1 year expiry
          }
          orderTransactions.push(earnTransaction)
          updatedPoints += earnedPoints
        }

        // Update points balance
        setPoints(updatedPoints)

        // Update transaction history
        setTransactions((prev) => [...orderTransactions, ...prev])

        // Check for tier upgrade
        const tierKeys = Object.keys(LOYALTY_TIERS) as LoyaltyTier[]
        const newTier = tierKeys
          .map((key) => LOYALTY_TIERS[key])
          .reverse()
          .find((t) => updatedPoints >= t.minPoints)

        if (newTier && newTier.name !== tier.name) {
          setTier(newTier)

          // Add tier upgrade bonus
          const tierBonus = newTier.minPoints * 0.1 // 10% of tier threshold as bonus
          const bonusTransaction: LoyaltyTransaction = {
            id: `tier-bonus-${Date.now()}`,
            type: "BONUS",
            points: Math.floor(tierBonus),
            description: `Tier Upgrade Bonus: Welcome to ${newTier.name}!`,
            timestamp: new Date(),
          }
          setTransactions((prev) => [bonusTransaction, ...prev])
          setPoints((prev) => prev + Math.floor(tierBonus))
        }

        // Reset applied reward
        setAppliedReward(null)
        setAppliedDiscount(0)
        setError(null)

        return true
      } catch (error) {
        console.error("Error processing loyalty for order:", error)
        setError("Failed to process loyalty rewards")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [points, appliedReward, tier],
  )

  // Get transaction history with filtering
  const getTransactionHistory = useCallback(() => {
    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [transactions])

  // Refresh loyalty data
  const refreshLoyaltyData = useCallback(async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from API
      // For now, we'll just recalculate from stored data
      const savedPoints = localStorage.getItem("loyaltyPoints")
      if (savedPoints) {
        const pointsValue = Number.parseInt(savedPoints, 10)
        setPoints(pointsValue)

        const tierKeys = Object.keys(LOYALTY_TIERS) as LoyaltyTier[]
        const userTier = tierKeys
          .map((key) => LOYALTY_TIERS[key])
          .reverse()
          .find((t) => pointsValue >= t.minPoints)

        if (userTier) {
          setTier(userTier)
        }
      }
      setError(null)
    } catch (error) {
      setError("Failed to refresh loyalty data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Export loyalty data
  const exportLoyaltyData = useCallback(() => {
    const data = {
      points,
      tier: tier.name,
      transactions,
      exportDate: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }, [points, tier, transactions])

  const value = {
    // Core state
    points,
    tier,
    transactions,
    isLoading,
    error,

    // Rewards
    availableRewards,
    appliedReward,
    appliedDiscount,

    // Calculations
    pointsEarned,
    nextTier,
    pointsToNextTier,
    tierProgress,

    // Actions
    applyReward,
    removeReward,
    processOrder,
    addBonusPoints,
    getTransactionHistory,
    calculateEarningPreview,
    validateReward,

    // Utilities
    refreshLoyaltyData,
    exportLoyaltyData,
  }

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
}