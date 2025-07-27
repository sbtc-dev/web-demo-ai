"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, MessageCircle, Navigation, Clock, Truck } from "lucide-react"
import type { TrackingResponse } from "@/lib/delivery-apis"

interface LiveTrackingMapProps {
  trackingData: TrackingResponse
  onRefresh: () => void
}

export default function LiveTrackingMap({ trackingData, onRefresh }: LiveTrackingMapProps) {
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (isLive && trackingData.status === "out_for_delivery") {
      const interval = setInterval(() => {
        onRefresh()
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [isLive, trackingData.status, onRefresh])

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered"
      case "out_for_delivery":
        return "Out for Delivery"
      case "in_transit":
        return "In Transit"
      case "picked_up":
        return "Picked Up"
      default:
        return "Pending"
    }
  }

  return (
    <div className="space-y-6">
      {/* Live Map Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Live Tracking</span>
              <Badge className={getStatusColor(trackingData.status)}>{getStatusText(trackingData.status)}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              {isLive && trackingData.status === "out_for_delivery" && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600">Live</span>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={onRefresh}>
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mock Map Display */}
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Mock map with delivery route */}
              <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
                <p className="text-xs font-medium">Delivery Route</p>
              </div>

              {/* Current location marker */}
              {trackingData.currentLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                      Current Location
                    </div>
                  </div>
                </div>
              )}

              {/* Destination marker */}
              <div className="absolute bottom-8 right-8">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                    Destination
                  </div>
                </div>
              </div>

              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 50% 50% Q 75% 25% 87.5% 87.5%"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>

          {/* Location Info */}
          {trackingData.currentLocation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Current Location</span>
              </div>
              <p className="text-sm text-blue-700">{trackingData.currentLocation.address}</p>
              <p className="text-xs text-blue-600 mt-1">Last updated: {lastUpdate.toLocaleTimeString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Driver Information */}
      {trackingData.driverInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Driver Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <img
                src={trackingData.driverInfo.photo || "/placeholder.svg"}
                alt={trackingData.driverInfo.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{trackingData.driverInfo.name}</h4>
                <p className="text-sm text-gray-600">{trackingData.driverInfo.vehicleInfo}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estimated Delivery */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Estimated Delivery</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {new Date(trackingData.estimatedDelivery).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}