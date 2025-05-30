import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { animate } from "animejs"
import { User, UserCog, Lock, ImageIcon } from "lucide-react"
import { useAuthStore } from "../stores/auth-store"
import { Header } from "../components/header"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { FormControl, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { useToast } from "../hooks/use-toast"
import { Avatar } from "../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

// Form validation schema for profile
const profileSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
  })
  .required()

// Form validation schema for password
const passwordSchema = yup
  .object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup.string().required("New password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required()

type ProfileFormData = yup.InferType<typeof profileSchema>
type PasswordFormData = yup.InferType<typeof passwordSchema>

export default function SettingsPage() {
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Initialize profile form with validation
  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  // Initialize password form with validation
  const passwordForm = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  // Update form values when user changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
      })
      setAvatarPreview(user.avatar || null)
    }
  }, [user, profileForm])

  // Animate the settings cards on mount
  useEffect(() => {
    animate(".settings-card", {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: (el, i) => i * 100,
      easing: "easeOutExpo",
    })
  }, [])

  // Handle profile form submission
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      // In a real app, you would call an API here
      // For now, we'll just update the user in the store
      const updatedUser = {
        ...user!,
        name: data.name,
        email: data.email,
      }

      // If there's a new avatar, process it
      if (avatarFile) {
        // In a real app, you would upload the file to a server
        // For now, we'll just use a data URL
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            updateUser({
              ...updatedUser,
              avatar: e.target.result as string,
            })

            toast({
              title: "Profile updated",
              description: "Your profile has been updated successfully",
            })
          }
        }
        reader.readAsDataURL(avatarFile)
      } else {
        updateUser(updatedUser)

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update profile",
      })
    }
  }

  // Handle password form submission
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      // In a real app, you would call an API here
      // For now, we'll just show a success message

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      })

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update password",
      })
    }
  }

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-4 pt-24">
        <div className="flex items-center gap-3 mb-6">
          <UserCog className="h-7 w-7" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="settings-card">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="mb-4">
                    <Avatar user={{ ...user, avatar: avatarPreview || undefined }} size="lg" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="avatar-upload" className="block w-full">
                      <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
                        <div className="flex flex-col items-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                        </div>
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card className="settings-card">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...profileForm.register("name")} />
                      </FormControl>
                      {profileForm.formState.errors.name && (
                        <FormMessage>{profileForm.formState.errors.name.message}</FormMessage>
                      )}
                    </FormItem>
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...profileForm.register("email")} />
                      </FormControl>
                      {profileForm.formState.errors.email && (
                        <FormMessage>{profileForm.formState.errors.email.message}</FormMessage>
                      )}
                    </FormItem>
                    <Button type="submit" className="w-full">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <Card className="settings-card max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...passwordForm.register("currentPassword")} />
                    </FormControl>
                    {passwordForm.formState.errors.currentPassword && (
                      <FormMessage>{passwordForm.formState.errors.currentPassword.message}</FormMessage>
                    )}
                  </FormItem>
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...passwordForm.register("newPassword")} />
                    </FormControl>
                    {passwordForm.formState.errors.newPassword && (
                      <FormMessage>{passwordForm.formState.errors.newPassword.message}</FormMessage>
                    )}
                  </FormItem>
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...passwordForm.register("confirmPassword")} />
                    </FormControl>
                    {passwordForm.formState.errors.confirmPassword && (
                      <FormMessage>{passwordForm.formState.errors.confirmPassword.message}</FormMessage>
                    )}
                  </FormItem>
                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
