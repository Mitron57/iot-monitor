import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Notification } from "../types/notification"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  removeNotification: (id: string) => void
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Temperature Alert",
    message: "Living Room Sensor reported high temperature!",
    type: "warning",
    isRead: false,
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "notif-2",
    title: "Device Offline",
    message: "Garage Sensor is offline for more than 24 hours.",
    type: "error",
    isRead: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
  },
  {
    id: "notif-3",
    title: "Battery Low",
    message: "Bedroom Sensor battery level is below 20%.",
    type: "warning",
    isRead: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
  {
    id: "notif-4",
    title: "System Update",
    message: "A new system update is available for your devices.",
    type: "info",
    isRead: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
  },
]

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.isRead).length,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString(),
          isRead: false,
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification,
          )

          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
        }))
      },

      clearNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        })
      },

      removeNotification: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter((notification) => notification.id !== id)

          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.isRead).length,
          }
        })
      },
    }),
    {
      name: "notification-storage",
    },
  ),
)
