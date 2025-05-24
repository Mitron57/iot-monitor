export type NotificationType = "info" | "warning" | "error" | "success"

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  timestamp: string
  link?: string
}
