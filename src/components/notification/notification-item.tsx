import type React from "react"

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Notification } from "../../types/notification"
import { useNotificationStore } from "../../stores/notification-store"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

interface NotificationItemProps {
  notification: Notification
  onClose?: () => void
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { markAsRead, removeNotification } = useNotificationStore()
  const navigate = useNavigate()

  const handleClick = () => {
    markAsRead(notification.id)
    if (notification.link) {
      navigate(notification.link)
    }
    if (onClose) {
      onClose()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeNotification(notification.id)
  }

  const getIcon = () => {
    switch (notification.type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
    }
  }

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })
    } catch (e) {
      return "some time ago"
    }
  }

  return (
    <div
      className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-accent/50 transition-colors ${
        !notification.isRead ? "bg-accent/20" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{notification.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{getTimeAgo()}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0 opacity-60 hover:opacity-100"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  )
}
