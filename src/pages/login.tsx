"use client"

import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { animate } from "animejs"
import { useAuthStore } from "../stores/auth-store"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { FormControl, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { useToast } from "../hooks/use-toast"
import { ThemeToggle } from "../components/theme/theme-toggle"

// Form validation schema
const loginSchema = yup
  .object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  })
  .required()

type LoginFormData = yup.InferType<typeof loginSchema>

export default function LoginPage() {
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Initialize form with validation
  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Animate the login card on mount
  useEffect(() => {
    animate(".login-card", {
      opacity: [0, 1],
      translateY: [20, 0],
      ease: "outExpo",
      duration: 800,
      delay: 300,
    })
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      toast({
        title: "Login successful",
        description: "Welcome to IoT Device Monitoring",
      })
      navigate("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }
  }

  // Handle guest login
  const loginAsGuest = async () => {
    try {
      await login("guest@example.com", "guest123")
      toast({
        title: "Guest login successful",
        description: "Welcome to IoT Device Monitoring",
      })
      navigate("/dashboard")
    } catch (error) {
      toast({
        title: "Guest login failed",
        description: "Unable to login as guest",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md login-card opacity-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center">IoT Device Monitoring</CardTitle>
          <CardDescription className="text-center">Login to access your devices</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...form.register("email")} />
              </FormControl>
              {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
            </FormItem>
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...form.register("password")} />
              </FormControl>
              {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
            </FormItem>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={loginAsGuest}>
            Continue as Guest
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Use owner@example.com / password123 for owner access
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
