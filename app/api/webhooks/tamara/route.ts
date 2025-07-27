import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const headersList = headers()

    // Verify webhook signature (implement based on Tamara's documentation)
    const signature = headersList.get("x-tamara-signature")

    // Process webhook based on event type
    const { order_id, order_status, event_type } = body

    switch (event_type) {
      case "order_approved":
        // Order approved by Tamara
        console.log(`Tamara order ${order_id} approved`)

        // Update order status in your database
        // await updateOrderStatus(order_id, 'payment_approved')

        break

      case "order_declined":
        // Order declined by Tamara
        console.log(`Tamara order ${order_id} declined`)

        // Update order status
        // await updateOrderStatus(order_id, 'payment_declined')

        break

      case "order_expired":
        // Order expired
        console.log(`Tamara order ${order_id} expired`)

        // Update order status
        // await updateOrderStatus(order_id, 'payment_expired')

        break

      case "order_canceled":
        // Order canceled
        console.log(`Tamara order ${order_id} canceled`)

        // Update order status
        // await updateOrderStatus(order_id, 'payment_canceled')

        break

      default:
        console.log(`Unhandled Tamara webhook event: ${event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Tamara webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}