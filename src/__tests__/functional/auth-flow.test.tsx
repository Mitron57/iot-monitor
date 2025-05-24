"use client"

import type React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "../../components/theme/theme-provider"
import LoginPage from "../../pages/login"
import { useAuthStore } from "../../stores/auth-store"
import { api } from "../../api/api"

// Mock API
jest.mock("../../api/api")
const mockApi = api as jest.Mocked<typeof api>

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

describe("Authentication Flow", () => {
  beforeEach(() => {
    // Reset auth store
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    jest.clearAllMocks()
  })

  describe("Login Flow", () => {
    it("should complete full login flow successfully", async () => {
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: "owner@example.com",
        role: "owner" as const,
      }

      mockApi.auth.login.mockResolvedValue({
        user: mockUser,
        token: "mock-token",
      })

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      // Check initial state
      expect(screen.getByText("IoT Device Monitoring")).toBeInTheDocument()
      expect(screen.getByText("Login to access your devices")).toBeInTheDocument()

      // Fill login form
      const emailInput = screen.getByPlaceholderText("your@email.com")
      const passwordInput = screen.getByPlaceholderText("••••••••")
      const loginButton = screen.getByRole("button", { name: "Login" })

      fireEvent.change(emailInput, { target: { value: "owner@example.com" } })
      fireEvent.change(passwordInput, { target: { value: "password123" } })

      // Submit form
      fireEvent.click(loginButton)

      // Wait for API call
      await waitFor(() => {
        expect(mockApi.auth.login).toHaveBeenCalledWith("owner@example.com", "password123")
      })

      // Check auth store state
      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(true)
      expect(authState.user).toEqual(mockUser)
    })

    it("should handle login error gracefully", async () => {
      mockApi.auth.login.mockRejectedValue(new Error("Invalid credentials"))

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      // Fill form with wrong credentials
      const emailInput = screen.getByPlaceholderText("your@email.com")
      const passwordInput = screen.getByPlaceholderText("••••••••")
      const loginButton = screen.getByRole("button", { name: "Login" })

      fireEvent.change(emailInput, { target: { value: "wrong@email.com" } })
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })
      fireEvent.click(loginButton)

      // Wait for error handling
      await waitFor(() => {
        expect(mockApi.auth.login).toHaveBeenCalled()
      })

      // Check that user is still not authenticated
      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
      expect(authState.user).toBeNull()
    })

    it("should allow guest login", async () => {
      const mockGuestUser = {
        id: "2",
        name: "Guest User",
        email: "guest@example.com",
        role: "guest" as const,
      }

      mockApi.auth.login.mockResolvedValue({
        user: mockGuestUser,
        token: "guest-token",
      })

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      // Click guest login button
      const guestButton = screen.getByRole("button", { name: "Continue as Guest" })
      fireEvent.click(guestButton)

      await waitFor(() => {
        expect(mockApi.auth.login).toHaveBeenCalledWith("guest@example.com", "guest123")
      })

      // Check guest is logged in
      const authState = useAuthStore.getState()
      expect(authState.user?.role).toBe("guest")
    })
  })

  describe("Role Switching", () => {
    it("should switch from owner to guest directly", () => {
      // Set initial owner state
      useAuthStore.setState({
        user: { id: "1", name: "Owner", email: "owner@example.com", role: "owner" },
        token: "token",
        isAuthenticated: true,
      })

      const { switchRole } = useAuthStore.getState()
      switchRole()

      const state = useAuthStore.getState()
      expect(state.user?.role).toBe("guest")
    })

    it("should require authentication when switching from guest to owner", () => {
      // Set initial guest state
      useAuthStore.setState({
        user: { id: "2", name: "Guest", email: "guest@example.com", role: "guest" },
        token: "token",
        isAuthenticated: true,
      })

      const { switchRole } = useAuthStore.getState()
      switchRole()

      // Should remain guest (no direct switch allowed)
      const state = useAuthStore.getState()
      expect(state.user?.role).toBe("guest")
    })
  })
})
