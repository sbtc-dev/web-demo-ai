import { type NextRequest, NextResponse } from "next/server"
import { TamaraPaymentGateway } from "@/lib/payment-gateways"

export async function POST(request: NextRequest) {
  try {
    const { method, amount, currency, phone } = await request.json()

    let result = { eligible: false, installments: [] }

    switch (method) {
      case "tabby":
        // Tabby eligibility logic
        if (amount >= 50 && amount <= 10000 && currency === "SAR") {
          result = {
            eligible: true,
            installments: [{ count: 4, amount: amount / 4 }],
          }
        }
        break

      case "tamara":
        const tamara = new TamaraPaymentGateway()
        result = await tamara.checkEligibility(amount, currency, phone)
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Eligibility check error:", error)
    return NextResponse.json({ success: false, error: "Eligibility check failed" }, { status: 500 })
  }
}