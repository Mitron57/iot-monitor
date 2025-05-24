// API client for interacting with the backend
import type { User } from "@/types/user"
import type { Device } from "@/types/device"

// Mock data for devices
const mockDevices: Device[] = [
  {
    id: "device-1",
    name: "Living Room Sensor",
    type: "Temperature",
    status: "online",
    temperature: 22.5,
    humidity: 45,
    batteryLevel: 78,
    lastUpdated: "10 min ago",
  },
  {
    id: "device-2",
    name: "Kitchen Sensor",
    type: "Humidity",
    status: "online",
    temperature: 24.1,
    humidity: 52,
    batteryLevel: 92,
    lastUpdated: "5 min ago",
  },
  {
    id: "device-3",
    name: "Bedroom Sensor",
    type: "Combined",
    status: "warning",
    temperature: 19.8,
    humidity: 38,
    batteryLevel: 15,
    lastUpdated: "2 hours ago",
  },
  {
    id: "device-4",
    name: "Garage Sensor",
    type: "Motion",
    status: "offline",
    temperature: 18.2,
    humidity: 60,
    batteryLevel: 0,
    lastUpdated: "1 day ago",
  },
]

// Mock user data
const mockUsers = {
  owner: {
    id: "user-1",
    name: "John Doe",
    email: "owner@example.com",
    role: "owner",
    avatar: "",
  },
  guest: {
    id: "user-2",
    name: "Guest User",
    email: "guest@example.com",
    role: "guest",
    avatar: "",
  },
}

// API client
export const api = {
  // Auth endpoints
  auth: {
    // Login endpoint
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check credentials (mock)
      if (email === "owner@example.com" && password === "password123") {
        return {
          user: mockUsers.owner,
          token: "mock-jwt-token-owner",
        }
      } else if (email === "guest@example.com" && password === "guest123") {
        return {
          user: mockUsers.guest,
          token: "mock-jwt-token-guest",
        }
      } else {
        throw new Error("Invalid credentials")
      }
    },

    // Get user profile
    getProfile: async (): Promise<User> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Return mock user
      return mockUsers.owner
    },
  },

  // Devices endpoints
  devices: {
    // Get all devices
    getAll: async (): Promise<Device[]> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Return mock devices
      return mockDevices
    },

    // Get device by ID
    getById: async (id: string): Promise<Device | undefined> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find device by ID
      return mockDevices.find((device) => device.id === id)
    },
  },
}
