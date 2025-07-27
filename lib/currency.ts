/**
 * Format a number as Saudi Arabian Riyal (SAR)
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted SAR string
 */
export function formatSAR(
  amount: number,
  options?: {
    notation?: "standard" | "compact"
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  },
) {
  const { notation = "standard", minimumFractionDigits = 2, maximumFractionDigits = 2 } = options || {}

  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

/**
 * Calculate VAT amount (15% in Saudi Arabia)
 * @param amount - The base amount
 * @returns VAT amount
 */
export function calculateVAT(amount: number): number {
  return amount * 0.15
}

/**
 * Calculate Saudi VAT amount (15% in Saudi Arabia)
 * @param amount - The base amount
 * @returns VAT amount
 */
export function calculateSaudiVAT(amount: number): number {
  return amount * 0.15
}

/**
 * Calculate total amount including Saudi VAT
 * @param amount - The base amount
 * @returns Total amount with VAT included
 */
export function calculateTotalWithSaudiVAT(amount: number): number {
  return amount + calculateSaudiVAT(amount)
}

/**
 * Format a price range in SAR
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 */
export function formatSARRange(minPrice: number, maxPrice: number): string {
  return `${formatSAR(minPrice)} - ${formatSAR(maxPrice)}`
}

/**
 * Convert USD to SAR (fixed rate for demo)
 * @param usdAmount - Amount in USD
 * @returns Amount in SAR
 */
export function usdToSAR(usdAmount: number): number {
  const exchangeRate = 3.75 // 1 USD = 3.75 SAR
  return usdAmount * exchangeRate
}