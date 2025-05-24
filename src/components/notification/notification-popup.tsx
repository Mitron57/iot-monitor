"use client"

import { useEffect, useRef } from "react"
import { animate } from "animejs"
import { X, AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Button } from "../ui/button"

interface NotificationPopupProps {
  title: string
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose: () => void
}

export function NotificationPopup({ title, message, type, onClose }: NotificationPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" data-testid="success-icon" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" data-testid="error-icon" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" data-testid="warning-icon" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" data-testid="info-icon" />
    }
  }

  // Get background color based on type
  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
      case "error":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      case "warning":
        return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
      case "info":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
    }
  }

  // Animate notification on mount and unmount
  useEffect(() => {
    if (popupRef.current) {
      // Entrance animation
      animate(popupRef.current, {
        translateX: [300, 0],
        opacity: [0, 1],
        ease: "outElastic(1, .8)",
        duration: 800,
      })

      // Set up exit animation
      return () => {
        if (popupRef.current) {
          animate(popupRef.current, {
            translateX: [0, 300],
            opacity: [1, 0],
            ease: "inExpo",
            duration: 500,
          })
        }
      }
    }
  }, [])

  return (
    <div ref={popupRef} className={`fixed top-20 right-4 z-50 w-80 p-4 rounded-lg shadow-lg border ${getBgColor()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-foreground/80 mt-1">{message}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
