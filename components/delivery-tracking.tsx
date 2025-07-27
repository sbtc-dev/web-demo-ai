"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Package, MapPin, Phone, CheckCircle } from "lucide-react"

interface DeliveryTrackingProps {
  orderNumber: string
  deliveryMethod: "standard" | "express"
}

export default function DeliveryTracking({ orderNumber, deliveryMethod }: DeliveryTrackingProps) {
  const trackingSteps = [
    {
      id: 1,
      title: "Order Confirmed",
      description: "Your order has been received and is being prepared",
      time: "2 hours ago",
      completed: true,
    },
    {
      id: 2,
      title: "Order Packed",
      description: "Your items have been carefully packed and labeled",
      time: "1 hour ago",
      completed: true,
    },
    {
      id: 3,
      title: "Out for Delivery",
      description: "Your order is on its way to your delivery address",
      time: "30 minutes ago",
      completed: deliveryMethod === "express",
    },
    {
      id: 4,
      title: "Delivered",
      description: "Your order has been successfully delivered",
      time: "",
      completed: false,
    },
  ]

  const estimatedDelivery = deliveryMethod === "express" ? "Today, 2:30 PM - 6:30 PM" : "Tomorrow, 9:00 AM - 6:00 PM"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Delivery Tracking</span>
            <Badge variant={deliveryMethod === "express" ? "default" : "secondary"}>
              {deliveryMethod === "express" ? "Express Delivery" : "Standard Delivery"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-medium">{orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="font-medium">{estimatedDelivery}</p>
            </div>
          </div>

          {deliveryMethod === "express" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Live Tracking Available</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">Your delivery partner is Ahmed (Driver ID: #DRV-2024-001)</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-blue-200">
                  <MapPin className="h-4 w-4 mr-1" />
                  Track Live
                </Button>
                <Button size="sm" variant="outline" className="border-blue-200">
                  <Phone className="h-4 w-4 mr-1" />
                  Call Driver
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : index === trackingSteps.findIndex((s) => !s.completed)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${step.completed ? "bg-green-500" : "bg-gray-200"}`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {step.time && <p className="text-xs text-gray-500 mt-1">{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Delivery Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Please ring the doorbell upon arrival</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Leave package at front door if no answer</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Contact customer before delivery</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h5 className="font-medium text-gray-900 mb-2">Need to change delivery details?</h5>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Reschedule Delivery
              </Button>
              <Button variant="outline" size="sm">
                Change Address
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}