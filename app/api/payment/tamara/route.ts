import { type NextRequest, NextResponse } from "next/server"
import { TamaraPaymentGateway, type TamaraPaymentRequest } from "@/lib/payment-gateways"

const tamara = new TamaraPaymentGateway()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case "create":
        const paymentRequest: TamaraPaymentRequest = {
          total_amount: {
            amount: data.amount,
            currency: data.currency,
          },
          shipping_amount: {
            amount: data.shippingAmount || 0,
            currency: data.currency,
          },
          tax_amount: {
            amount: data.taxAmount || 0,
            currency: data.currency,
          },
          order_reference_id: data.orderId,
          order_number: data.orderNumber || data.orderId,
          description: data.description,
          country_code: "SA",
          payment_type: data.paymentType || "PAY_BY_INSTALMENTS",
          instalments: data.instalments || 3,
          locale: "en_US",
          items: data.items.map((item: any) => ({
            name: item.name,
            type: "Physical",
            reference_id: item.id,
            sku: item.sku || item.id,
            quantity: item.quantity,
            unit_price: {
              amount: item.price,
              currency: data.currency,
            },
            total_amount: {
              amount: item.price * item.quantity,
              currency: data.currency,
            },
          })),
          consumer: {
            first_name: data.customer.firstName,
            last_name: data.customer.lastName,
            phone_number: data.customer.phone,
            email: data.customer.email,
            date_of_birth: data.customer.dateOfBirth,
          },
          billing_address: {
            first_name: data.customer.firstName,
            last_name: data.customer.lastName,
            line1: data.billingAddress.address,
            city: data.billingAddress.city,
            country_code: "SA",
            phone_number: data.customer.phone,
          },
          shipping_address: {
            first_name: data.customer.firstName,
            last_name: data.customer.lastName,
            line1: data.shippingAddress.address,
            city: data.shippingAddress.city,
            country_code: "SA",
            phone_number: data.customer.phone,
          },
          merchant_url: {
            success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?method=tamara&orderId=${data.orderId}`,
            failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed?method=tamara&orderId=${data.orderId}`,
            cancel: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`,
            notification: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/tamara`,
          },
        }

        const result = await tamara.createPayment(paymentRequest)
        return NextResponse.json(result)

      case "capture":
        const captureResult = await tamara.capturePayment(data.orderId)
        return NextResponse.json(captureResult)

      case "refund":
        const refundResult = await tamara.refundPayment({
          payment_id: data.orderId,
          amount: data.amount,
          reason: data.reason,
          order_id: data.orderId,
        })
        return NextResponse.json(refundResult)

      case "status":
        const statusResult = await tamara.getPaymentStatus(data.orderId)
        return NextResponse.json(statusResult)

      case "check-eligibility":
        const eligibilityResult = await tamara.checkEligibility(data.amount, data.currency, data.phone)
        return NextResponse.json(eligibilityResult)

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Tamara API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}