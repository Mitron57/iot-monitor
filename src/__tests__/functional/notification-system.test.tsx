"use client"

import type React from "react"

import { render, screen, fireEvent } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "../../components/theme/theme-provider"
import NotificationsPage from "../../pages/notifications"
import { useAuthStore } from "../../stores/auth-store"
import { useNotificationStore } from "../../stores/notification-store"

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

const mockNotifications = [
  {
    id: "notif-1",
    title: "Temperature Alert",
    message: "Living Room Sensor reported high temperature!",
    type: "warning" as const,
    isRead: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: "notif-2",
    title: "Device Offline",
    message: "Kitchen Sensor is offline",
    type: "error" as const,
    isRead: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: "notif-3",
    title: "System Update",
    message: "Update completed successfully",
    type: "success" as const,
    isRead: true,
    timestamp: new Date().toISOString(),
  },
]

describe("Notification System", () => {
  beforeEach(() => {
    // Set authenticated user
    useAuthStore.setState({
      user: { id: "1", name: "Owner", email: "owner@example.com", role: "owner" },
      token: "token",
      isAuthenticated: true,
    })

    // Reset notification store
    useNotificationStore.setState({
      notifications: mockNotifications,
      unreadCount: 2,
    })

    jest.clearAllMocks()
  })

  describe("Notifications Page", () => {
    it("should display all notifications", async () => {
      render(
        <TestWrapper>
          <NotificationsPage />
        </TestWrapper>,
      )

      // Check page title
      expect(screen.getByText("Notifications")).toBeInTheDocument()

      // Check all notifications are displayed
      expect(screen.getByText("Temperature Alert")).toBeInTheDocument()
      expect(screen.getByText("Device Offline")).toBeInTheDocument()
      expect(screen.getByText("System Update")).toBeInTheDocument()

      // Check notification messages
      expect(screen.getByText("Living Room Sensor reported high temperature!")).toBeInTheDocument()
      expect(screen.getByText("Kitchen Sensor is offline")).toBeInTheDocument()
      expect(screen.getByText("Update completed successfully")).toBeInTheDocument()
    })

    it("should mark all notifications as read", async () => {
      render(
        <TestWrapper>
          <NotificationsPage />
        </TestWrapper>,
      )

      // Click mark all as read button
      const markAllButton = screen.getByRole("button", { name: /mark all as read/i })
      fireEvent.click(markAllButton)

      // Check store state
      const state = useNotificationStore.getState()
      expect(state.unreadCount).toBe(0)
      expect(state.notifications.every((n) => n.isRead)).toBe(true)
    })

    it("should clear all notifications", async () => {
      render(
        <TestWrapper>
          <NotificationsPage />
        </TestWrapper>,
      )

      // Click clear all button
      const clearAllButton = screen.getByRole("button", { name: /clear all/i })
      fireEvent.click(clearAllButton)

      // Check store state
      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(0)
      expect(state.unreadCount).toBe(0)
    })

    it("should show empty state when no notifications", async () => {
      // Set empty notifications
      useNotificationStore.setState({
        notifications: [],
        unreadCount: 0,
      })

      render(
        <TestWrapper>
          <NotificationsPage />
        </TestWrapper>,
      )

      expect(screen.getByText("No notifications")).toBeInTheDocument()
      expect(screen.getByText("You're all caught up!")).toBeInTheDocument()
    })
  })

  describe("Notification Management", () => {
    it("should add new notification", () => {
      const { addNotification } = useNotificationStore.getState()

      addNotification({
        title: "New Alert",
        message: "This is a new notification",
        type: "info",
      })

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(4)
      expect(state.notifications[0].title).toBe("New Alert")
      expect(state.unreadCount).toBe(3)
    })

    it("should mark individual notification as read", () => {
      const { markAsRead } = useNotificationStore.getState()

      markAsRead("notif-1")

      const state = useNotificationStore.getState()
      const notification = state.notifications.find((n) => n.id === "notif-1")
      expect(notification?.isRead).toBe(true)
      expect(state.unreadCount).toBe(1)
    })

    it("should remove individual notification", () => {
      const { removeNotification } = useNotificationStore.getState()

      removeNotification("notif-1")

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(2)
      expect(state.notifications.find((n) => n.id === "notif-1")).toBeUndefined()
      expect(state.unreadCount).toBe(1)
    })
  })

  describe("Notification Types", () => {
    it("should handle different notification types correctly", () => {
      const { addNotification } = useNotificationStore.getState()

      // Add different types
      addNotification({ title: "Info", message: "Info message", type: "info" })
      addNotification({ title: "Warning", message: "Warning message", type: "warning" })
      addNotification({ title: "Error", message: "Error message", type: "error" })
      addNotification({ title: "Success", message: "Success message", type: "success" })

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(7) // 3 initial + 4 new

      // Check types are preserved
      const newNotifications = state.notifications.slice(0, 4)
      expect(newNotifications[0].type).toBe("success")
      expect(newNotifications[1].type).toBe("error")
      expect(newNotifications[2].type).toBe("warning")
      expect(newNotifications[3].type).toBe("info")
    })
  })
})
