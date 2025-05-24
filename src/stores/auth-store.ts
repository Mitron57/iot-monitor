"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "../api/api"
import type { User } from "../types/user"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: () => void
  switchToOwner: (ownerData: { user: User; token: string }) => void
  register: (name: string, email: string, password: string) => Promise<void>
  updateUser: (updatedUser: User) => void
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Login function
      login: async (email: string, password: string) => {
        try {
          // Call login API
          const response = await api.auth.login(email, password)

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Login failed"
          console.error("Login failed:", errorMessage)
          throw error
        }
      },

      // Logout function
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      // Switch role (only from owner to guest, guest to owner requires authentication)
      switchRole: () => {
        set((state) => {
          if (!state.user) return state

          // Only allow owner to guest switch without authentication
          if (state.user.role === "owner") {
            return {
              user: {
                ...state.user,
                role: "guest",
              },
            }
          }

          // For guest to owner, this should not be called directly
          // Use switchToOwner instead after authentication
          return state
        })
      },

      // Switch to owner after successful authentication
      switchToOwner: (ownerData: { user: User; token: string }) => {
        set({
          user: ownerData.user,
          token: ownerData.token,
          isAuthenticated: true,
        })
      },

      // Register function
      register: async (name: string, email: string, password: string) => {
        try {
          // Call register API
          const response = await api.auth.register(name, email, password)

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Registration failed"
          console.error("Registration failed:", errorMessage)
          throw error
        }
      },

      // Update user function
      updateUser: (updatedUser: User) => {
        set({
          user: updatedUser,
        })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
