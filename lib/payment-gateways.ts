export interface PaymentMethod {
  id: string
  name: string
  type: "bnpl" | "card" | "cash" | "wallet"
  logo: string
  description: string
  fees?: number
  minAmount?: number
  maxAmount?: number
  supportedCurrencies: string[]
  processingTime: string
  refundSupport: boolean
}

export interface TabbyPaymentRequest {
  amount: number
  currency: string
  description: string
  order: {
    reference_id: string
    items: Array<{
      title: string
      description: string
      quantity: number
      unit_price: number
      category: string
    }>
  }
  buyer: {
    phone: string
    email: string
    name: string
    dob?: string
  }
  buyer_history?: {
    registered_since: string
    loyalty_level: number
  }
  order_history?: Array<{
    purchased_at: string
    amount: number
    status: string
  }>
  shipping_address: {
    city: string
    address: string
    zip: string
  }
  success_url: string
  cancel_url: string
  failure_url: string
}

export interface TamaraPaymentRequest {
  total_amount: {
    amount: number
    currency: string
  }
  shipping_amount: {
    amount: number
    currency: string
  }
  tax_amount: {
    amount: number
    currency: string
  }
  order_reference_id: string
  order_number: string
  description: string
  country_code: string
  payment_type: "PAY_BY_INSTALMENTS" | "PAY_BY_LATER" | "PAY_NOW"
  instalments?: number
  locale: string
  items: Array<{
    name: string
    type: string
    reference_id: string
    sku: string
    quantity: number
    unit_price: {
      amount: number
      currency: string
    }
    total_amount: {
      amount: number
      currency: string
    }
  }>
  consumer: {
    first_name: string
    last_name: string
    phone_number: string
    email: string
    date_of_birth?: string
  }
  billing_address: {
    first_name: string
    last_name: string
    line1: string
    city: string
    country_code: string
    phone_number: string
  }
  shipping_address: {
    first_name: string
    last_name: string
    line1: string
    city: string
    country_code: string
    phone_number: string
  }
  merchant_url: {
    success: string
    failure: string
    cancel: string
    notification: string
  }
}

export interface PaymentResponse {
  success: boolean
  payment_id?: string
  checkout_url?: string
  status?: string
  error?: string
  transaction_id?: string
}

export interface RefundRequest {
  payment_id: string
  amount: number
  reason: string
  order_id: string
}

export interface RefundResponse {
  success: boolean
  refund_id?: string
  status?: string
  error?: string
  amount_refunded?: number
}

// Tabby Payment Gateway
export class TabbyPaymentGateway {
  private apiKey: string
  private baseUrl: string
  private environment: "sandbox" | "production"

  constructor() {
    this.apiKey = process.env.TABBY_SECRET_KEY || ""
    this.environment = process.env.NODE_ENV === "production" ? "production" : "sandbox"
    this.baseUrl = this.environment === "production" ? "https://api.tabby.ai" : "https://api.tabby.dev"
  }

  async createPayment(request: TabbyPaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v2/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          payment: {
            amount: request.amount.toString(),
            currency: request.currency,
            description: request.description,
            buyer: request.buyer,
            buyer_history: request.buyer_history,
            order: request.order,
            order_history: request.order_history,
            shipping_address: request.shipping_address,
            meta: {
              order_id: request.order.reference_id,
              customer: request.buyer.name,
            },
          },
          lang: "en",
          merchant_code: process.env.TABBY_MERCHANT_CODE,
          merchant_urls: {
            success: request.success_url,
            cancel: request.cancel_url,
            failure: request.failure_url,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Payment creation failed",
        }
      }

      return {
        success: true,
        payment_id: data.payment.id,
        checkout_url: data.web_url,
        status: data.status,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async capturePayment(paymentId: string, amount: number): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v2/payments/${paymentId}/captures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: amount.toString(),
        }),
      })

      const data = await response.json()

      return {
        success: response.ok,
        payment_id: paymentId,
        status: data.status,
        error: response.ok ? undefined : data.error,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Capture failed",
      }
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v2/payments/${request.payment_id}/refunds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: request.amount.toString(),
          reason: request.reason,
          comment: `Refund for order ${request.order_id}`,
        }),
      })

      const data = await response.json()

      return {
        success: response.ok,
        refund_id: data.id,
        status: data.status,
        amount_refunded: data.amount,
        error: response.ok ? undefined : data.error,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      }
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v2/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      const data = await response.json()

      return {
        success: response.ok,
        payment_id: paymentId,
        status: data.status,
        error: response.ok ? undefined : data.error,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Status check failed",
      }
    }
  }
}

// Tamara Payment Gateway
export class TamaraPaymentGateway {
  private apiKey: string
  private apiToken: string
  private baseUrl: string
  private environment: "sandbox" | "production"

  constructor() {
    this.apiKey = process.env.TAMARA_API_KEY || ""
    this.apiToken = process.env.TAMARA_API_TOKEN || ""
    this.environment = process.env.NODE_ENV === "production" ? "production" : "sandbox"
    this.baseUrl = this.environment === "production" ? "https://api.tamara.co" : "https://api-sandbox.tamara.co"
  }

  private async getAuthToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/merchants/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: process.env.TAMARA_MERCHANT_EMAIL,
          password: process.env.TAMARA_MERCHANT_PASSWORD,
        }),
      })

      const data = await response.json()
      return data.access_token
    } catch (error) {
      throw new Error("Failed to authenticate with Tamara")
    }
  }

  async createPayment(request: TamaraPaymentRequest): Promise<PaymentResponse> {
    try {
      const token = await this.getAuthToken()

      const response = await fetch(`${this.baseUrl}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Payment creation failed",
        }
      }

      return {
        success: true,
        payment_id: data.order_id,
        checkout_url: data.checkout_url,
        status: "created",
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async capturePayment(orderId: string): Promise<PaymentResponse> {
    try {
      const token = await this.getAuthToken()

      const response = await fetch(`${this.baseUrl}/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      return {
        success: response.ok,
        payment_id: orderId,
        status: data.status,
        error: response.ok ? undefined : data.message,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Capture failed",
      }
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const token = await this.getAuthToken()

      const response = await fetch(`${this.baseUrl}/orders/${request.payment_id}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          total_amount: {
            amount: request.amount,
            currency: "SAR",
          },
          comment: request.reason,
        }),
      })

      const data = await response.json()

      return {
        success: response.ok,
        refund_id: data.refund_id,
        status: data.status,
        amount_refunded: request.amount,
        error: response.ok ? undefined : data.message,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      }
    }
  }

  async getPaymentStatus(orderId: string): Promise<PaymentResponse> {
    try {
      const token = await this.getAuthToken()

      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      return {
        success: response.ok,
        payment_id: orderId,
        status: data.status,
        error: response.ok ? undefined : data.message,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Status check failed",
      }
    }
  }

  async checkEligibility(
    amount: number,
    currency: string,
    phone: string,
  ): Promise<{
    eligible: boolean
    installments?: Array<{ count: number; amount: number }>
  }> {
    try {
      const token = await this.getAuthToken()

      const response = await fetch(`${this.baseUrl}/checkout/payment-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          total_amount: {
            amount,
            currency,
          },
          country_code: "SA",
          phone_number: phone,
        }),
      })

      const data = await response.json()

      return {
        eligible: data.has_available_payment_types,
        installments: data.available_payment_types?.map((type: any) => ({
          count: type.installments_count,
          amount: type.installment_amount?.amount,
        })),
      }
    } catch (error) {
      return { eligible: false }
    }
  }
}

// Payment method configurations
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "credit-card",
    name: "Credit / Debit Card",
    type: "card",
    logo: "/images/payment-cards.png",
    description: "Pay securely with your credit or debit card",
    supportedCurrencies: ["SAR", "USD", "EUR"],
    processingTime: "Instant",
    refundSupport: true,
  },
  {
    id: "tabby",
    name: "Tabby",
    type: "bnpl",
    logo: "/images/tabby-logo.png",
    description: "Split your purchase into 4 interest-free payments",
    minAmount: 50,
    maxAmount: 10000,
    supportedCurrencies: ["SAR"],
    processingTime: "Instant approval",
    refundSupport: true,
  },
  {
    id: "tamara",
    name: "Tamara",
    type: "bnpl",
    logo: "/images/tamara-logo.png",
    description: "Buy now, pay later with flexible payment plans",
    minAmount: 100,
    maxAmount: 15000,
    supportedCurrencies: ["SAR"],
    processingTime: "Instant approval",
    refundSupport: true,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    type: "cash",
    logo: "/images/cod-icon.png",
    description: "Pay when you receive your order",
    fees: 7.5,
    supportedCurrencies: ["SAR"],
    processingTime: "On delivery",
    refundSupport: false,
  },
]

// Utility functions
export function getPaymentMethod(id: string): PaymentMethod | undefined {
  return PAYMENT_METHODS.find((method) => method.id === id)
}

export function isPaymentMethodAvailable(methodId: string, amount: number, currency: string): boolean {
  const method = getPaymentMethod(methodId)
  if (!method) return false

  if (!method.supportedCurrencies.includes(currency)) return false
  if (method.minAmount && amount < method.minAmount) return false
  if (method.maxAmount && amount > method.maxAmount) return false

  return true
}

export function calculatePaymentFees(methodId: string, amount: number): number {
  const method = getPaymentMethod(methodId)
  return method?.fees || 0
}