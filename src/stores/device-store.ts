import { create } from "zustand"
import { api } from "../api/api"
import type { Device } from "../types/device"

interface DeviceState {
  devices: Device[]
  loading: boolean
  error: string | null
  fetchDevices: () => Promise<void>
  getDeviceHistoricalData: (deviceId: string, timeRange: string) => any[]
  addDevice: (deviceData: { name: string; type: string; serialNumber: string }) => Promise<void>
  updateDevice: (deviceId: string, data: { name: string; type: string }) => Promise<void>
  deleteDevice: (deviceId: string) => Promise<void>
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: [],
  loading: false,
  error: null,

  // Fetch devices from API
  fetchDevices: async () => {
    try {
      set({ loading: true, error: null })

      // Call devices API
      const devices = await api.devices.getAll()

      set({
        devices,
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch devices"
      console.error("Failed to fetch devices:", errorMessage)
      set({
        loading: false,
        error: "Failed to fetch devices",
      })
    }
  },

  // Get historical data for a device (mock data)
  getDeviceHistoricalData: (deviceId: string, timeRange: string) => {
    // Generate mock historical data based on time range
    const dataPoints = timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30
    const device = get().devices.find((d) => d.id === deviceId)

    if (!device) return []

    return Array.from({ length: dataPoints }).map((_, i) => {
      const baseTemp = device.temperature
      const baseHumidity = device.humidity

      // Add some random variation
      const tempVariation = Math.random() * 4 - 2
      const humidityVariation = Math.random() * 10 - 5

      let timeLabel = ""
      if (timeRange === "24h") {
        timeLabel = `${i}:00`
      } else if (timeRange === "7d") {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        timeLabel = days[i % 7]
      } else {
        timeLabel = `Day ${i + 1}`
      }

      return {
        time: timeLabel,
        temperature: +(baseTemp + tempVariation).toFixed(1),
        humidity: Math.max(0, Math.min(100, Math.round(baseHumidity + humidityVariation))),
      }
    })
  },

  // Add new device
  addDevice: async (deviceData: { name: string; type: string; serialNumber: string }) => {
    try {
      set({ loading: true, error: null })

      // Call add device API
      const newDevice = await api.devices.add(deviceData)

      set((state) => ({
        devices: [...state.devices, newDevice],
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add device"
      console.error("Failed to add device:", errorMessage)
      set({
        loading: false,
        error: "Failed to add device",
      })
      throw error
    }
  },

  // Update device - оптимизированное обновление без перерендера
  updateDevice: async (deviceId: string, data: { name: string; type: string }) => {
    try {
      // Оптимистичное обновление - сначала обновляем UI
      set((state) => ({
        devices: state.devices.map((device) =>
          device.id === deviceId ? { ...device, name: data.name, type: data.type, lastUpdated: "just now" } : device,
        ),
      }))

      // Затем вызываем API
      await api.devices.update(deviceId, data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update device"
      console.error("Failed to update device:", errorMessage)
      // В случае ошибки откатываем изменения
      const devices = await api.devices.getAll()
      set({ devices })
      throw error
    }
  },

  // Delete device - оптимизированное удаление без перерендера
  deleteDevice: async (deviceId: string) => {
    try {
      // Оптимистичное удаление - сначала убираем из UI
      set((state) => ({
        devices: state.devices.filter((device) => device.id !== deviceId),
      }))

      // Затем вызываем API
      await api.devices.delete(deviceId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete device"
      console.error("Failed to delete device:", errorMessage)
      // В случае ошибки восстанавливаем список
      const devices = await api.devices.getAll()
      set({ devices })
      throw error
    }
  },
}))
