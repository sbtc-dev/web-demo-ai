import { type NextRequest, NextResponse } from "next/server"
import { TabbyPaymentGateway, type TabbyPaymentRequest } from "@/lib/payment-gateways"

const tabby = new TabbyPaymentGateway()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case "create":
        const paymentRequest: TabbyPaymentRequest = {
          amount: data.amount,
          currency: data.currency,
          description: data.description,
          order: {
            reference_id: data.orderId,
            items: data.items.map((item: any) => ({
              title: item.name,
              description: item.description || item.name,
              quantity: item.quantity,
              unit_price: item.price,
              category: item.category,
            })),
          },
          buyer: {
            phone: data.customer.phone,
            email: data.customer.email,
            name: `${data.customer.firstName} ${data.customer.lastName}`,
            dob: data.customer.dateOfBirth,
          },
          buyer_history: data.customer.loyaltyLevel
            ? {
                registered_since: data.customer.registeredSince || new Date().toISOString(),
                loyalty_level: data.customer.loyaltyLevel,
              }
            : undefined,
          order_history: data.customer.orderHistory || [],
          shipping_address: {
            city: data.shippingAddress.city,
            address: data.shippingAddress.address,
            zip: data.shippingAddress.zip,
          },
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?method=tabby&orderId=${data.orderId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`,
          failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed?method=tabby&orderId=${data.orderId}`,
        }

        const result = await tabby.createPayment(paymentRequest)
        return NextResponse.json(result)

      case "capture":
        const captureResult = await tabby.capturePayment(data.paymentId, data.amount)
        return NextResponse.json(captureResult)

      case "refund":
        const refundResult = await tabby.refundPayment({
          payment_id: data.paymentId,
          amount: data.amount,
          reason: data.reason,
          order_id: data.orderId,
        })
        return NextResponse.json(refundResult)

      case "status":
        const statusResult = await tabby.getPaymentStatus(data.paymentId)
        return NextResponse.json(statusResult)

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Tabby API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}