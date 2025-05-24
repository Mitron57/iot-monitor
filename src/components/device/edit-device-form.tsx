"use client"

import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { animate } from "animejs"
import { X, Edit } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form"
import type { Device } from "../../types/device"

// Form validation schema
const editDeviceSchema = yup
  .object({
    name: yup.string().required("Device name is required").min(3, "Name must be at least 3 characters"),
    type: yup.string().required("Device type is required"),
  })
  .required()

type EditDeviceFormData = yup.InferType<typeof editDeviceSchema>

interface EditDeviceFormProps {
  device: Device | null
  isOpen: boolean
  onClose: () => void
  onSave: (deviceId: string, data: EditDeviceFormData) => void
}

export function EditDeviceForm({ device, isOpen, onClose, onSave }: EditDeviceFormProps) {
  const formRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Initialize form with validation
  const form = useForm<EditDeviceFormData>({
    resolver: yupResolver(editDeviceSchema),
    defaultValues: {
      name: device?.name || "",
      type: device?.type || "Temperature",
    },
  })

  // Update form when device changes
  useEffect(() => {
    if (device) {
      form.reset({
        name: device.name,
        type: device.type,
      })
    }
  }, [device, form])

  // Animate form on open/close
  useEffect(() => {
    if (isOpen && formRef.current && overlayRef.current) {
      // Entrance animation
      animate(overlayRef.current, {
        opacity: [0, 1],
        duration: 300,
        easing: "easeOutExpo",
      })

      animate(formRef.current, {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 500,
        easing: "easeOutElastic(1, .8)",
        delay: 100,
      })
    }
  }, [isOpen])

  // Handle form submission
  const onSubmit = async (data: EditDeviceFormData) => {
    if (!device) return

    onSave(device.id, data)
    onClose()
  }

  // Handle close with animation
  const handleClose = () => {
    if (formRef.current && overlayRef.current) {
      animate(formRef.current, {
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 300,
        easing: "easeInExpo",
      })

      animate(overlayRef.current, {
        opacity: [1, 0],
        duration: 300,
        easing: "easeInExpo",
        complete: onClose,
      })
    } else {
      onClose()
    }
  }

  if (!isOpen || !device) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <Card ref={formRef} className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Device
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Device Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Living Room Sensor" {...form.register("name")} />
              </FormControl>
              {form.formState.errors.name && <FormMessage>{form.formState.errors.name.message}</FormMessage>}
            </FormItem>

            <FormItem>
              <FormLabel>Device Type</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...form.register("type")}
                >
                  <option value="Temperature">Temperature</option>
                  <option value="Humidity">Humidity</option>
                  <option value="Combined">Combined</option>
                  <option value="Motion">Motion</option>
                  <option value="Light">Light</option>
                  <option value="Air Quality">Air Quality</option>
                </select>
              </FormControl>
              {form.formState.errors.type && <FormMessage>{form.formState.errors.type.message}</FormMessage>}
            </FormItem>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
