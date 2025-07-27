"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Truck, Package, CheckCircle, Clock } from "lucide-react"

interface DeliveryNotification {
  id: string
  type: "status_update" | "delivery_attempt" | "delivered" | "delayed"
  title: string
  message: string
  timestamp: Date
  orderId: string
  trackingNumber: string
  read: boolean
}

export default function DeliveryNotifications() {
  const [notifications, setNotifications] = useState<DeliveryNotification[]>([
    {
      id: "1",
      type: "status_update",
      title: "Package Out for Delivery",
      message: "Your order #SBTC-ABC123 is out for delivery and will arrive within 2 hours.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      orderId: "SBTC-ABC123",
      trackingNumber: "DHL123456789",
      read: false,
    },
    {
      id: "2",
      type: "delivered",
      title: "Package Delivered",
      message: "Your order #SBTC-XYZ789 has been successfully delivered.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      orderId: "SBTC-XYZ789",
      trackingNumber: "FDX987654321",
      read: true,
    },
  ])

  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "status_update":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "delivery_attempt":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "delayed":
        return <Package className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new notification
      if (Math.random() > 0.95) {
        // 5% chance every 5 seconds
        const newNotification: DeliveryNotification = {
          id: Date.now().toString(),
          type: "status_update",
          title: "Location Update",
          message: "Your package is 5 minutes away from delivery address.",
          timestamp: new Date(),
          orderId: "SBTC-ABC123",
          trackingNumber: "DHL123456789",
          read: false,
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Delivery Notifications</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">{notification.timestamp.toLocaleTimeString()}</p>
                        <p className="text-xs text-blue-600">{notification.orderId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setNotifications([])}>
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}