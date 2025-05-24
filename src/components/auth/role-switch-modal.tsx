"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { animate } from "animejs"
import { X, Lock } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form"
import { api } from "../../api/api"

// Form validation schema
const authSchema = yup
  .object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required()

type AuthFormData = yup.InferType<typeof authSchema>

interface RoleSwitchModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (ownerData: { user: any; token: string }) => void
}

export function RoleSwitchModal({ isOpen, onClose, onSuccess }: RoleSwitchModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Initialize form with validation
  const form = useForm<AuthFormData>({
    resolver: yupResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset()
      setError(null)
    }
  }, [isOpen, form])

  // Handle form submission
  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Try to authenticate as owner
      const response = await api.auth.login(data.email, data.password)

      // Check if the authenticated user is an owner
      if (response.user.role !== "owner") {
        setError("This account does not have owner privileges")
        setIsLoading(false)
        return
      }

      // Success - pass the owner data back
      onSuccess(response)
      handleClose()
    } catch (error) {
      setError("Invalid email or password")
      setIsLoading(false)
    }
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

  if (!isOpen) return null

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
              <Lock className="h-5 w-5" />
              Owner Authentication
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Please authenticate with owner credentials to switch to owner mode
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <FormItem>
              <FormLabel>Owner Email</FormLabel>
              <FormControl>
                <Input placeholder="owner@example.com" {...form.register("email")} disabled={isLoading} />
              </FormControl>
              {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
            </FormItem>

            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...form.register("password")} disabled={isLoading} />
              </FormControl>
              {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
            </FormItem>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Authenticate"}
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 rounded-md bg-muted/50">
            <p className="text-xs text-muted-foreground">
              <strong>Demo credentials:</strong>
              <br />
              Email: owner@example.com
              <br />
              Password: password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
