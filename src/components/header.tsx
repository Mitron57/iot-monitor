"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X, Settings, LogOut } from "lucide-react"
import { useAuthStore } from "../stores/auth-store"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme/theme-toggle"
import { Badge } from "./ui/badge"
import { NotificationDropdown } from "./notification/notification-dropdown"
import { Avatar } from "./ui/avatar"
import { RoleSwitchModal } from "./auth/role-switch-modal"
import { useToast } from "../hooks/use-toast"
import { animate } from "animejs"

export function Header() {
  const { user, logout, switchRole, switchToOwner } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showRoleSwitchModal, setShowRoleSwitchModal] = useState(false)

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Добавить анимацию для мобильного меню
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (mobileMenuOpen) {
        // Анимация появления
        animate(mobileMenuRef.current, {
          opacity: [0, 1],
          translateY: [-20, 0],
          easing: "easeOutExpo",
          duration: 300,
        })
      }
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleSwitchRole = () => {
    if (user?.role === "owner") {
      // Owner to guest - direct switch
      switchRole()
      toast({
        title: "Switched to Guest",
        description: "You are now in guest mode",
      })
    } else {
      // Guest to owner - require authentication
      setShowRoleSwitchModal(true)
    }
  }

  const handleOwnerAuthSuccess = (ownerData: { user: any; token: string }) => {
    switchToOwner(ownerData)
    toast({
      title: "Switched to Owner",
      description: "You are now in owner mode with full access",
    })
  }

  const handleSettings = () => {
    navigate("/settings")
  }

  const handleMobileMenuToggle = () => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      // Анимация исчезновения
      animate(mobileMenuRef.current, {
        opacity: [1, 0],
        translateY: [0, -20],
        easing: "easeInExpo",
        duration: 200,
        complete: () => setMobileMenuOpen(false),
      })
    } else {
      setMobileMenuOpen(true)
    }
  }

  return (
    <>
      <header className="fixed w-full bg-background/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/dashboard")}>
              IoT Monitor
            </div>
            {user?.role === "owner" && <Badge className="ml-2">Owner</Badge>}
            {user?.role === "guest" && (
              <Badge variant="outline" className="ml-2">
                Guest
              </Badge>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <NotificationDropdown />

            {/* Settings button - consistently visible on desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettings}
              aria-label="Settings"
              className="flex-shrink-0"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-2 p-1">
                <Avatar user={user} />
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </div>
              </Button>

              {/* Dropdown menu with improved hover behavior and animation */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform group-hover:translate-y-0 translate-y-[-10px] z-50">
                <div className="w-48 bg-background rounded-md shadow-lg border overflow-hidden">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                      onClick={handleSwitchRole}
                    >
                      <span className="truncate block">
                        Switch to {user?.role === "owner" ? "Guest" : "Owner"}
                        {user?.role === "guest" && " 🔒"}
                      </span>
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                      onClick={handleLogout}
                    >
                      <span className="truncate block">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-1 md:hidden">
            {/* Settings button - consistently visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettings}
              aria-label="Settings"
              className="flex-shrink-0"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <NotificationDropdown />

            <Button variant="ghost" size="icon" onClick={handleMobileMenuToggle}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden bg-background border-b opacity-0">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar user={user} />
                  <div>
                    <p className="font-medium truncate max-w-[150px]">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              <Button variant="outline" className="w-full justify-start" onClick={handleSwitchRole}>
                <span className="truncate">
                  Switch to {user?.role === "owner" ? "Guest" : "Owner"}
                  {user?.role === "guest" && " 🔒"}
                </span>
              </Button>

              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Logout</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Role Switch Modal */}
      <RoleSwitchModal
        isOpen={showRoleSwitchModal}
        onClose={() => setShowRoleSwitchModal(false)}
        onSuccess={handleOwnerAuthSuccess}
      />
    </>
  )
}
