import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useDeviceStore } from "../../stores/device-store"

interface DeviceChartProps {
  deviceId: string
}

// Кастомный компонент для tooltip с поддержкой темной темы
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="text-foreground font-medium">{`Time: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-foreground" style={{ color: entry.color }}>
            {`${entry.dataKey === "temperature" ? "Temperature" : "Humidity"}: ${entry.value}${entry.dataKey === "temperature" ? "°C" : "%"}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DeviceChart({ deviceId }: DeviceChartProps) {
  const { getDeviceHistoricalData } = useDeviceStore()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("24h")

  // Fetch historical data
  useEffect(() => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const historicalData = getDeviceHistoricalData(deviceId, timeRange)
      setData(historicalData)
      setLoading(false)
    }, 1000)
  }, [deviceId, timeRange, getDeviceHistoricalData])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-10 w-40 bg-muted rounded mb-4"></div>
        <div className="h-[300px] w-full bg-muted/30 rounded"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-3 py-1 rounded-md transition-colors ${
            timeRange === "24h"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          onClick={() => setTimeRange("24h")}
        >
          24 Hours
        </button>
        <button
          className={`px-3 py-1 rounded-md transition-colors ${
            timeRange === "7d"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          onClick={() => setTimeRange("7d")}
        >
          7 Days
        </button>
        <button
          className={`px-3 py-1 rounded-md transition-colors ${
            timeRange === "30d"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          onClick={() => setTimeRange("30d")}
        >
          30 Days
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature Chart */}
        <div className="bg-card rounded-lg p-4 shadow-sm border">
          <h3 className="text-lg font-medium mb-2 text-foreground">Temperature</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="bg-card rounded-lg p-4 shadow-sm border">
          <h3 className="text-lg font-medium mb-2 text-foreground">Humidity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                <Line type="monotone" dataKey="humidity" stroke="#10b981" activeDot={{ r: 8 }} name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
