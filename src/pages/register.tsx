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
const registerSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required()

type RegisterFormData = yup.InferType<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Initialize form with validation
  const form = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Animate the register card on mount
  useEffect(() => {
    animate(".register-card", {
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
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password)
      toast({
        title: "Registration successful",
        description: "Welcome to IoT Device Monitoring",
      })
      navigate("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email may already be in use",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md register-card opacity-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">Sign up to access IoT Device Monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...form.register("name")} />
              </FormControl>
              {form.formState.errors.name && <FormMessage>{form.formState.errors.name.message}</FormMessage>}
            </FormItem>
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
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...form.register("confirmPassword")} />
              </FormControl>
              {form.formState.errors.confirmPassword && (
                <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>
              )}
            </FormItem>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
