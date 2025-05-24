// API client for interacting with the backend
import type { User } from "../types/user"
import type { Device } from "../types/device"

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

    // Register endpoint
    register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would check if the email is already in use
      // For now, we'll just create a new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: "owner", // New users are owners by default
        avatar: "",
      }

      return {
        user: newUser,
        token: `mock-jwt-token-${newUser.id}`,
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
      await new Promise((resolve) => setTimeout(resolve, 100))

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

    // Add new device
    add: async (deviceData: { name: string; type: string; serialNumber: string }): Promise<Device> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new device with generated ID and mock sensor data
      const newDevice: Device = {
        id: `device-${Date.now()}`,
        name: deviceData.name,
        type: deviceData.type,
        status: "online",
        // Mock sensor data - in real app this would come from API
        temperature: +(Math.random() * 15 + 15).toFixed(1), // 15-30°C
        humidity: Math.round(Math.random() * 40 + 30), // 30-70%
        batteryLevel: Math.round(Math.random() * 30 + 70), // 70-100%
        lastUpdated: "just now",
      }

      // Add to mock devices array
      mockDevices.push(newDevice)

      return newDevice
    },

    // Update device
    update: async (deviceId: string, data: { name: string; type: string }): Promise<Device> => {
      // Уменьшаем задержку для лучшего UX
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Find and update device
      const deviceIndex = mockDevices.findIndex((device) => device.id === deviceId)
      if (deviceIndex === -1) {
        throw new Error("Device not found")
      }

      const updatedDevice = {
        ...mockDevices[deviceIndex],
        name: data.name,
        type: data.type,
        lastUpdated: "just now",
      }

      mockDevices[deviceIndex] = updatedDevice
      return updatedDevice
    },

    // Delete device
    delete: async (deviceId: string): Promise<void> => {
      // Уменьшаем задержку для лучшего UX
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Find and remove device
      const deviceIndex = mockDevices.findIndex((device) => device.id === deviceId)
      if (deviceIndex === -1) {
        throw new Error("Device not found")
      }

      mockDevices.splice(deviceIndex, 1)
    },
  },
}
