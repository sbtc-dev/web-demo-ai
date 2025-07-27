"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Package, MapPin, Phone, CheckCircle, AlertCircle } from "lucide-react"
import { DeliveryServiceManager, type TrackingResponse } from "@/lib/delivery-apis"
import LiveTrackingMap from "@/components/live-tracking-map"

interface DeliveryTrackingEnhancedProps {
  orderNumber: string
  trackingNumber: string
  deliveryPartnerId: string
}

export default function DeliveryTrackingEnhanced({
  orderNumber,
  trackingNumber,
  deliveryPartnerId,
}: DeliveryTrackingEnhancedProps) {
  const [trackingData, setTrackingData] = useState<TrackingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deliveryManager] = useState(new DeliveryServiceManager())

  const fetchTrackingData = async () => {
    try {
      setLoading(true)
      const data = await deliveryManager.trackShipment(trackingNumber, deliveryPartnerId)
      setTrackingData(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch tracking information")
      console.error("Tracking error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrackingData()
  }, [trackingNumber, deliveryPartnerId])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading tracking information...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !trackingData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tracking Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchTrackingData}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500"
      case "out_for_delivery":
        return "bg-blue-500"
      case "in_transit":
        return "bg-yellow-500"
      case "picked_up":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={trackingData.deliveryPartner.logo || "/placeholder.svg"}
                alt={trackingData.deliveryPartner.name}
                className="w-8 h-8 object-contain"
              />
              <span>Tracking: {trackingData.trackingNumber}</span>
            </div>
            <Badge className={getStatusColor(trackingData.status)}>
              {trackingData.status.replace("_", " ").toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-medium">{orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Partner</p>
              <p className="font-medium">{trackingData.deliveryPartner.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="font-medium">{new Date(trackingData.estimatedDelivery).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Tabs */}
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">Live Tracking</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          {trackingData.status === "out_for_delivery" || trackingData.status === "in_transit" ? (
            <LiveTrackingMap trackingData={trackingData} onRefresh={fetchTrackingData} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live Tracking Not Available</h3>
                <p className="text-gray-600">Live tracking will be available once your package is out for delivery.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingData.events.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      {index < trackingData.events.length - 1 && <div className="w-0.5 h-12 mt-2 bg-blue-500" />}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{event.description}</h4>
                        <span className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      {event.coordinates && (
                        <p className="text-xs text-blue-600 mt-1">
                          Coordinates: {event.coordinates.lat.toFixed(4)}, {event.coordinates.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Partner Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Delivery Partner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={trackingData.deliveryPartner.logo || "/placeholder.svg"}
                    alt={trackingData.deliveryPartner.name}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h4 className="font-medium">{trackingData.deliveryPartner.name}</h4>
                    <p className="text-sm text-gray-600">Express Delivery Service</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tracking URL:</span>
                    <a
                      href={`${trackingData.deliveryPartner.trackingUrl}?trackingNumber=${trackingData.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Track on Partner Site
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service Type:</span>
                    <span className="text-sm font-medium">Express Delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            {trackingData.driverInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Driver Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={trackingData.driverInfo.photo || "/placeholder.svg"}
                      alt={trackingData.driverInfo.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{trackingData.driverInfo.name}</h4>
                      <p className="text-sm text-gray-600">{trackingData.driverInfo.vehicleInfo}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Driver: {trackingData.driverInfo.phone}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Please ring the doorbell upon arrival</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Contact customer before delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Signature required for delivery</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}