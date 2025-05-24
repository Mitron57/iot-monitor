"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { animate } from "animejs"
import { Plus } from "lucide-react"
import { useAuthStore } from "../stores/auth-store"
import { useDeviceStore } from "../stores/device-store"
import { Header } from "../components/header"
import { DeviceCard } from "../components/device/device-card"
import { DeviceCardSkeleton } from "../components/device/device-card-skeleton"
import { DeviceChart } from "../components/device/device-chart"
import { NotificationPopup } from "../components/notification/notification-popup"
import { AddDeviceForm } from "../components/device/add-device-form"
import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast"
import { EditDeviceForm } from "../components/device/edit-device-form"
import { DeleteDeviceDialog } from "../components/device/delete-device-dialog"
import type { Device } from "../types/device"

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore()
  const { devices, fetchDevices, loading, updateDevice, deleteDevice } = useDeviceStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showNotification, setShowNotification] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  // Fetch devices on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDevices()

      // Show welcome notification
      setTimeout(() => {
        toast({
          title: `Welcome ${user?.role === "owner" ? "Owner" : "Guest"}!`,
          description: "You can monitor your IoT devices here",
        })
      }, 1000)

      // Show a demo notification after 3 seconds
      setTimeout(() => {
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 5000)
      }, 3000)
    }
  }, [isAuthenticated, fetchDevices, toast, user?.role])

  // Animate device cards when they load - при каждом заходе на страницу
  useEffect(() => {
    if (!loading && devices.length > 0) {
      animate(".device-card", {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: 0, // Все анимируются одновременно
        duration: 800,
        easing: "easeOutExpo",
      })
    }
  }, [loading, devices])

  // Handle device selection for chart view
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId === selectedDevice ? null : deviceId)
  }

  // Handle device edit
  const handleEditDevice = (device: Device) => {
    setEditingDevice(device)
    setShowEditForm(true)
  }

  // Handle device delete
  const handleDeleteDevice = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId)
    if (device) {
      setDeletingDevice(device)
      setShowDeleteDialog(true)
    }
  }

  // Handle save device changes
  const handleSaveDevice = async (deviceId: string, data: { name: string; type: string }) => {
    try {
      await updateDevice(deviceId, data)
      toast({
        title: "Device updated",
        description: "Device has been updated successfully",
      })
      setShowEditForm(false)
      setEditingDevice(null)
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update device",
        variant: "destructive",
      })
    }
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingDevice) return

    try {
      await deleteDevice(deletingDevice.id)
      toast({
        title: "Device deleted",
        description: `${deletingDevice.name} has been deleted`,
      })
      setShowDeleteDialog(false)
      setDeletingDevice(null)
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete device",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-4 pt-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Device Dashboard</h1>

          {/* Add Device Button - Only for owners */}
          {user?.role === "owner" && (
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Device
            </Button>
          )}
        </div>

        {/* Device Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {loading
            ? // Show skeletons while loading
              Array.from({ length: 4 }).map((_, index) => <DeviceCardSkeleton key={index} />)
            : // Show device cards
              devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  isSelected={device.id === selectedDevice}
                  onSelect={() => handleDeviceSelect(device.id)}
                  isOwner={user?.role === "owner"}
                  onEdit={handleEditDevice}
                  onDelete={handleDeleteDevice}
                />
              ))}
        </div>

        {/* Charts Section */}
        {selectedDevice && (
          <div className="bg-card rounded-lg p-4 shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Device Statistics: {devices.find((d) => d.id === selectedDevice)?.name}
            </h2>
            <DeviceChart deviceId={selectedDevice} />
          </div>
        )}

        {/* Edit Device Form Modal */}
        <EditDeviceForm
          device={editingDevice}
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false)
            setEditingDevice(null)
          }}
          onSave={handleSaveDevice}
        />

        {/* Delete Device Dialog */}
        <DeleteDeviceDialog
          deviceName={deletingDevice?.name || ""}
          isOpen={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false)
            setDeletingDevice(null)
          }}
          onConfirm={handleConfirmDelete}
        />
      </main>

      {/* Add Device Form Modal */}
      <AddDeviceForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} />

      {/* Notification Popup */}
      {showNotification && (
        <NotificationPopup
          title="Temperature Alert"
          message="Device 'Living Room Sensor' reported high temperature!"
          type="warning"
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  )
}
