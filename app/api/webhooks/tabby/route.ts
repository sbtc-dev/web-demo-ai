import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const headersList = headers()

    // Verify webhook signature (implement based on Tabby's documentation)
    const signature = headersList.get("x-tabby-signature")

    // Process webhook based on event type
    const { id, status, order } = body

    switch (status) {
      case "AUTHORIZED":
        // Payment authorized, capture if auto-capture is enabled
        console.log(`Tabby payment ${id} authorized for order ${order.reference_id}`)

        // Update order status in your database
        // await updateOrderStatus(order.reference_id, 'payment_authorized')

        break

      case "CLOSED":
        // Payment completed successfully
        console.log(`Tabby payment ${id} completed for order ${order.reference_id}`)

        // Update order status and fulfill order
        // await updateOrderStatus(order.reference_id, 'paid')
        // await fulfillOrder(order.reference_id)

        break

      case "EXPIRED":
      case "REJECTED":
        // Payment failed or expired
        console.log(`Tabby payment ${id} failed with status ${status}`)

        // Update order status
        // await updateOrderStatus(order.reference_id, 'payment_failed')

        break

      default:
        console.log(`Unhandled Tabby webhook status: ${status}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Tabby webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}