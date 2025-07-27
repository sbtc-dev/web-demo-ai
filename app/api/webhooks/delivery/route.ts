import { type NextRequest, NextResponse } from "next/server"
import { handleDeliveryWebhook } from "@/lib/delivery-apis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const partnerId = request.nextUrl.searchParams.get("partner")

    if (!partnerId) {
      return NextResponse.json({ error: "Missing partner ID" }, { status: 400 })
    }

    // Verify webhook signature (implementation depends on delivery partner)
    const signature = request.headers.get("x-webhook-signature")
    if (!verifyWebhookSignature(body, signature, partnerId)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Process the webhook
    await handleDeliveryWebhook(body, partnerId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function verifyWebhookSignature(body: any, signature: string | null, partnerId: string): boolean {
  // Implement signature verification based on delivery partner requirements
  // This is a simplified example
  return true // In production, implement proper signature verification
}