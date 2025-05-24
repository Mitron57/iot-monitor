"use client"

import type { User } from "../../types/user"
import { useState } from "react"

interface AvatarProps {
  user?: User | null
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Avatar({ user, size = "md", className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  }

  const classes = `rounded-full flex items-center justify-center text-primary-foreground bg-primary ${sizeClasses[size]} ${className}`

  // If user has an avatar and no image error occurred, show the image
  if (user?.avatar && !imageError) {
    return (
      <div className={classes} style={{ padding: 0 }}>
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={`${user.name}'s avatar`}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageError(true)}
        />
      </div>
    )
  }

  // Otherwise show the first letter of the user's name
  return <div className={classes}>{user?.name?.charAt(0) || "U"}</div>
}
