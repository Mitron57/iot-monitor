"use client"

import type React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "../../components/theme/theme-provider"
import DashboardPage from "../../pages/dashboard"
import LoginPage from "../../pages/login"
import { useAuthStore } from "../../stores/auth-store"
import { useDeviceStore } from "../../stores/device-store"
import { api } from "../../api/api"

// Mock API
jest.mock("../../api/api")
const mockApi = api as jest.Mocked<typeof api>

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

describe("Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Authentication Errors", () => {
    it("should handle network errors during login", async () => {
      mockApi.auth.login.mockRejectedValue(new Error("Network error"))

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      // Fill and submit login form
      const emailInput = screen.getByPlaceholderText("your@email.com")
      const passwordInput = screen.getByPlaceholderText("••••••••")
      const loginButton = screen.getByRole("button", { name: "Login" })

      fireEvent.change(emailInput, { target: { value: "test@example.com" } })
      fireEvent.change(passwordInput, { target: { value: "password" } })
      fireEvent.click(loginButton)

      // Should handle error gracefully
      await waitFor(() => {
        expect(mockApi.auth.login).toHaveBeenCalled()
      })

      // User should remain unauthenticated
      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
    })

    it("should handle invalid credentials", async () => {
      mockApi.auth.login.mockRejectedValue(new Error("Invalid credentials"))

      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      const emailInput = screen.getByPlaceholderText("your@email.com")
      const passwordInput = screen.getByPlaceholderText("••••••••")
      const loginButton = screen.getByRole("button", { name: "Login" })

      fireEvent.change(emailInput, { target: { value: "wrong@example.com" } })
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(mockApi.auth.login).toHaveBeenCalled()
      })

      // Should show error state
      const authState = useAuthStore.getState()
      expect(authState.isAuthenticated).toBe(false)
      expect(authState.user).toBeNull()
    })
  })

  describe("Device Loading Errors", () => {
    it("should handle device fetch errors", async () => {
      // Set authenticated state
      useAuthStore.setState({
        user: { id: "1", name: "Owner", email: "owner@example.com", role: "owner" },
        token: "token",
        isAuthenticated: true,
      })

      mockApi.devices.getAll.mockRejectedValue(new Error("Failed to fetch devices"))

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      // Wait for error to be handled
      await waitFor(() => {
        expect(mockApi.devices.getAll).toHaveBeenCalled()
      })

      // Check error state in store
      const deviceState = useDeviceStore.getState()
      expect(deviceState.error).toBe("Failed to fetch devices")
      expect(deviceState.loading).toBe(false)
      expect(deviceState.devices).toEqual([])
    })

    it("should handle device add errors", async () => {
      useAuthStore.setState({
        user: { id: "1", name: "Owner", email: "owner@example.com", role: "owner" },
        token: "token",
        isAuthenticated: true,
      })

      mockApi.devices.getAll.mockResolvedValue([])
      mockApi.devices.add.mockRejectedValue(new Error("Failed to add device"))

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Add Device" })).toBeInTheDocument()
      })

      // Open add device modal
      const addButton = screen.getByRole("button", { name: "Add Device" })
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByText("Add New Device")).toBeInTheDocument()
      })

      // Fill and submit form
      const nameInput = screen.getByPlaceholderText("e.g., Living Room Sensor")
      const serialInput = screen.getByPlaceholderText("e.g., SN123456789")

      fireEvent.change(nameInput, { target: { value: "Test Device" } })
      fireEvent.change(serialInput, { target: { value: "SN123" } })

      // Find submit button properly
      const modal = screen.getByText("Add New Device").closest(".fixed")
      let submitButton: HTMLElement | null = null

      if (modal) {
        submitButton = modal.querySelector('button[type="submit"]') as HTMLElement
      }

      if (!submitButton) {
        const allAddButtons = screen.getAllByText("Add Device")
        submitButton = allAddButtons[allAddButtons.length - 1]
      }

      expect(submitButton).toBeInTheDocument()
      fireEvent.click(submitButton!)

      // Should handle error - the error is expected and will be caught
      await waitFor(() => {
        expect(mockApi.devices.add).toHaveBeenCalled()
      })

      // Check that error was handled in store
      const deviceState = useDeviceStore.getState()
      expect(deviceState.error).toBe("Failed to add device")
    })
  })

  describe("Form Validation Errors", () => {
    it("should show validation errors for empty login form", async () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      // Submit empty form
      const loginButton = screen.getByRole("button", { name: "Login" })
      fireEvent.click(loginButton)

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument()
        expect(screen.getByText("Password is required")).toBeInTheDocument()
      })
    })

    it("should show validation errors for invalid email", async () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      const emailInput = screen.getByPlaceholderText("your@email.com")
      const loginButton = screen.getByRole("button", { name: "Login" })

      fireEvent.change(emailInput, { target: { value: "invalid-email" } })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByText("Invalid email format")).toBeInTheDocument()
      })
    })

    it("should show validation errors for short password", async () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      const passwordInput = screen.getByPlaceholderText("••••••••")
      const loginButton = screen.getByRole("button", { name: "Login" })

      fireEvent.change(passwordInput, { target: { value: "123" } })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument()
      })
    })
  })

  describe("Network Connectivity", () => {
    it("should handle offline state gracefully", async () => {
      // Mock network error
      mockApi.devices.getAll.mockRejectedValue(new Error("Network request failed"))

      useAuthStore.setState({
        user: { id: "1", name: "Owner", email: "owner@example.com", role: "owner" },
        token: "token",
        isAuthenticated: true,
      })

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(mockApi.devices.getAll).toHaveBeenCalled()
      })

      // Should handle network error gracefully
      const deviceState = useDeviceStore.getState()
      expect(deviceState.error).toBe("Failed to fetch devices")
    })
  })
})
