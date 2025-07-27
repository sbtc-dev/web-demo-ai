import Header from "@/components/header"
import DeliveryTrackingEnhanced from "@/components/delivery-tracking-enhanced"
import Footer from "@/components/footer"

interface TrackOrderPageProps {
  params: {
    orderNumber: string
  }
}

export default function TrackOrderPage({ params }: TrackOrderPageProps) {
  // In a real app, you would fetch the order details from your database
  const trackingNumber = "DHL123456789" // This would come from your order data
  const deliveryPartnerId = "dhl" // This would come from your order data

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Monitor your delivery progress with real-time updates</p>
        </div>
        <DeliveryTrackingEnhanced
          orderNumber={params.orderNumber}
          trackingNumber={trackingNumber}
          deliveryPartnerId={deliveryPartnerId}
        />
      </div>
      <Footer />
    </div>
  )
}