import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Check, Trash2 } from "lucide-react"
import { useNotificationStore } from "../stores/notification-store"
import { useAuthStore } from "../stores/auth-store"
import { Header } from "../components/header"
import { NotificationItem } from "../components/notification/notification-item"
import { Button } from "../components/ui/button"
import { animate } from "animejs"

export default function NotificationsPage() {
  const { isAuthenticated } = useAuthStore()
  const { notifications, markAllAsRead, clearNotifications } = useNotificationStore()
  const navigate = useNavigate()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  // Animate notifications on mount
  useEffect(() => {
    animate(".notification-item", {
      opacity: [0, 1],
      translateY: [10, 0],
      delay: (el, i) => i * 50,
      easing: "easeOutExpo",
    })
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-4 pt-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            <span className="truncate">Notifications</span>
          </h1>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => markAllAsRead()}>
              <Check className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Mark all as read</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => clearNotifications()}>
              <Trash2 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Clear all</span>
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <NotificationItem notification={notification} />
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
