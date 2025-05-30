import { useState } from "react"
import { Thermometer, Droplets, Wifi, WifiOff, Battery, BatteryLow, BatteryWarning } from "lucide-react"
import type { Device } from "../../types/device"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { useToast } from "../../hooks/use-toast"
import { DeviceMenu } from "./device-menu"

interface DeviceCardProps {
  device: Device
  isSelected: boolean
  onSelect: () => void
  isOwner: boolean
  onEdit: (device: Device) => void
  onDelete: (deviceId: string) => void
}

export function DeviceCard({ device, isSelected, onSelect, isOwner, onEdit, onDelete }: DeviceCardProps) {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle device refresh
  const handleRefresh = (deviceId: string) => {
    setIsRefreshing(true)

    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Device refreshed",
        description: `${device.name} data has been updated`,
      })
    }, 1500)
  }

  // Get status badge variant
  const getStatusVariant = () => {
    switch (device.status) {
      case "online":
        return "default"
      case "offline":
        return "destructive"
      case "warning":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Get battery icon based on level
  const getBatteryIcon = () => {
    if (device.batteryLevel < 20) {
      return <BatteryWarning className="h-4 w-4 text-destructive" />
    } else if (device.batteryLevel < 50) {
      return <BatteryLow className="h-4 w-4 text-secondary" />
    } else {
      return <Battery className="h-4 w-4 text-primary" />
    }
  }

  return (
    <Card
      className={`device-card cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""} ${
        isRefreshing ? "opacity-60 pointer-events-none bg-muted/50 dark:bg-muted/20" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader className={`pb-2 ${isRefreshing ? "animate-pulse" : ""}`}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{device.name}</CardTitle>
          <DeviceMenu
            device={device}
            isOwner={isOwner}
            onEdit={onEdit}
            onDelete={onDelete}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant()}>
            {device.status === "online" ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
            {device.status}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {device.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={isRefreshing ? "animate-pulse" : ""}>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span className="text-sm">{device.temperature}°C</span>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{device.humidity}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Last updated: {device.lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1">
          {getBatteryIcon()}
          <span className="text-xs">{device.batteryLevel}%</span>
        </div>
      </CardFooter>
    </Card>
  )
}
