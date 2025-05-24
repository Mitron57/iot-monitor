"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MoreVertical, Edit, Trash2, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"
import type { Device } from "../../types/device"

interface DeviceMenuProps {
  device: Device
  isOwner: boolean
  onEdit: (device: Device) => void
  onDelete: (deviceId: string) => void
  onRefresh: (deviceId: string) => void
  isRefreshing?: boolean
}

export function DeviceMenu({ device, isOwner, onEdit, onDelete, onRefresh, isRefreshing = false }: DeviceMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    onEdit(device)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    onDelete(device.id)
  }

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    onRefresh(device.id)
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="ghost" size="icon" onClick={toggleMenu} disabled={isRefreshing} data-testid="device-menu-button">
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-background rounded-md shadow-lg border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>

            {isOwner && (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors duration-150 flex items-center gap-2"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                  Edit Device
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors duration-150 flex items-center gap-2 text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Device
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
