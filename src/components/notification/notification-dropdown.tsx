"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bell, Check, ArrowRight } from "lucide-react"
import { useNotificationStore } from "../../stores/notification-store"
import { Button } from "../ui/button"
import { NotificationItem } from "./notification-item"
import { useNavigate } from "react-router-dom"

export function NotificationDropdown() {
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<"right" | "left">("right")

  // Determine dropdown position based on available space
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const spaceOnRight = window.innerWidth - buttonRect.right
      const spaceOnLeft = buttonRect.left
      const isMobile = window.innerWidth < 768 // md breakpoint

      // На мобильных устройствах всегда позиционируем справа, но с отступом
      if (isMobile) {
        setDropdownPosition("right")
      } else {
        // На десктопе используем старую логику
        if (spaceOnLeft > spaceOnRight && spaceOnRight < 320) {
          setDropdownPosition("left")
        } else {
          setDropdownPosition("right")
        }
      }
    }
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAllAsRead()
  }

  const viewAllNotifications = () => {
    navigate("/notifications")
    closeDropdown()
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative flex-shrink-0"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-destructive text-destructive-foreground text-xs flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeDropdown} aria-hidden="true"></div>
          <div
            ref={dropdownRef}
            className={`absolute mt-2 bg-background rounded-md shadow-lg border z-50 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200 ${
              dropdownPosition === "left"
                ? "right-auto left-0 sm:left-auto sm:right-0 w-80 max-w-[calc(100vw-2rem)]"
                : "left-auto right-0 w-80 max-w-[calc(100vw-2rem)] sm:max-w-80"
            } ${window.innerWidth < 768 ? "right-2" : ""}`}
          >
            <div className="p-3 border-b flex items-center justify-between">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs flex items-center"
                    onClick={handleMarkAllAsRead}
                  >
                    <Check className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">Mark all read</span>
                  </Button>
                )}
                {/* Header button to navigate to notifications page */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex items-center justify-center"
                  onClick={viewAllNotifications}
                  aria-label="View all notifications"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications
                  .slice(0, 5)
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} onClose={closeDropdown} />
                  ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
              )}
            </div>
            {notifications.length > 5 && (
              <div className="p-2 border-t">
                <Button variant="outline" className="w-full text-sm" onClick={viewAllNotifications}>
                  <span className="truncate">View all notifications</span>
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
