import { useEffect, useRef } from "react"
import { animate } from "animejs"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface DeleteDeviceDialogProps {
  deviceName: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteDeviceDialog({ deviceName, isOpen, onClose, onConfirm }: DeleteDeviceDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Animate dialog on open/close
  useEffect(() => {
    if (isOpen && dialogRef.current && overlayRef.current) {
      // Entrance animation
      animate(overlayRef.current, {
        opacity: [0, 1],
        duration: 300,
        easing: "easeOutExpo",
      })

      animate(dialogRef.current, {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 500,
        easing: "easeOutElastic(1, .8)",
        delay: 100,
      })
    }
  }, [isOpen])

  // Handle close with animation
  const handleClose = () => {
    if (dialogRef.current && overlayRef.current) {
      animate(dialogRef.current, {
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

  const handleConfirm = () => {
    onConfirm()
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <Card ref={dialogRef} className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Device
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{deviceName}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" className="flex-1" onClick={handleConfirm}>
                Delete Device
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
