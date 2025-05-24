// Device type definition
export interface Device {
  id: string
  name: string
  type: string
  status: "online" | "offline" | "warning"
  temperature: number
  humidity: number
  batteryLevel: number
  lastUpdated: string
}
