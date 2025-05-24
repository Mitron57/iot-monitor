import { useDeviceStore } from "../device-store"
import { api } from "../../api/api"
import { jest } from "@jest/globals"

// Mock API
jest.mock("../../api/api")
const mockApi = api as jest.Mocked<typeof api>

const mockDevices = [
  {
    id: "device-1",
    name: "Living Room Sensor",
    type: "Temperature",
    status: "online" as const,
    temperature: 22.5,
    humidity: 45,
    batteryLevel: 78,
    lastUpdated: "10 min ago",
  },
  {
    id: "device-2",
    name: "Kitchen Sensor",
    type: "Humidity",
    status: "online" as const,
    temperature: 24.1,
    humidity: 52,
    batteryLevel: 92,
    lastUpdated: "5 min ago",
  },
]

describe("DeviceStore", () => {
  beforeEach(() => {
    // Reset store state
    useDeviceStore.setState({
      devices: [],
      loading: false,
      error: null,
    })
    jest.clearAllMocks()
  })

  describe("fetchDevices", () => {
    it("should fetch devices successfully", async () => {
      mockApi.devices.getAll.mockResolvedValue(mockDevices)

      const { fetchDevices } = useDeviceStore.getState()
      await fetchDevices()

      const state = useDeviceStore.getState()
      expect(state.devices).toEqual(mockDevices)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })

    it("should handle fetch error", async () => {
      mockApi.devices.getAll.mockRejectedValue(new Error("Network error"))

      const { fetchDevices } = useDeviceStore.getState()
      await fetchDevices()

      const state = useDeviceStore.getState()
      expect(state.devices).toEqual([])
      expect(state.loading).toBe(false)
      expect(state.error).toBe("Failed to fetch devices")
    })
  })

  describe("addDevice", () => {
    it("should add device successfully", async () => {
      const newDevice = {
        id: "device-3",
        name: "New Sensor",
        type: "Combined",
        status: "online" as const,
        temperature: 20.0,
        humidity: 40,
        batteryLevel: 85,
        lastUpdated: "just now",
      }

      mockApi.devices.add.mockResolvedValue(newDevice)

      useDeviceStore.setState({ devices: mockDevices })

      const { addDevice } = useDeviceStore.getState()
      await addDevice({ name: "New Sensor", type: "Combined", serialNumber: "SN123" })

      const state = useDeviceStore.getState()
      expect(state.devices).toHaveLength(3)
      expect(state.devices[2]).toEqual(newDevice)
    })
  })

  describe("updateDevice", () => {
    it("should update device optimistically", async () => {
      useDeviceStore.setState({ devices: mockDevices })

      mockApi.devices.update.mockResolvedValue({
        ...mockDevices[0],
        name: "Updated Sensor",
        type: "Combined",
      })

      const { updateDevice } = useDeviceStore.getState()
      await updateDevice("device-1", { name: "Updated Sensor", type: "Combined" })

      const state = useDeviceStore.getState()
      expect(state.devices[0].name).toBe("Updated Sensor")
      expect(state.devices[0].type).toBe("Combined")
    })
  })

  describe("deleteDevice", () => {
    it("should delete device optimistically", async () => {
      useDeviceStore.setState({ devices: mockDevices })

      mockApi.devices.delete.mockResolvedValue()

      const { deleteDevice } = useDeviceStore.getState()
      await deleteDevice("device-1")

      const state = useDeviceStore.getState()
      expect(state.devices).toHaveLength(1)
      expect(state.devices[0].id).toBe("device-2")
    })
  })

  describe("getDeviceHistoricalData", () => {
    it("should generate historical data for 24h", () => {
      useDeviceStore.setState({ devices: mockDevices })

      const { getDeviceHistoricalData } = useDeviceStore.getState()
      const data = getDeviceHistoricalData("device-1", "24h")

      expect(data).toHaveLength(24)
      expect(data[0]).toHaveProperty("time")
      expect(data[0]).toHaveProperty("temperature")
      expect(data[0]).toHaveProperty("humidity")
    })

    it("should return empty array for non-existent device", () => {
      const { getDeviceHistoricalData } = useDeviceStore.getState()
      const data = getDeviceHistoricalData("non-existent", "24h")

      expect(data).toEqual([])
    })
  })
})
