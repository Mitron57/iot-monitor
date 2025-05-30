import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose: () => void
}

export function Toast({ id, title, description, variant = "default", onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-full max-w-md rounded-lg border p-4 shadow-md",
        variant === "default" && "bg-background text-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground",
      )}
    >
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h3 className="font-medium">{title}</h3>}
          {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
        </div>
        <button onClick={onClose} className="ml-4 rounded-md p-1 text-foreground/50 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
