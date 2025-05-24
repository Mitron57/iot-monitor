"use client"

import type React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "../../components/theme/theme-provider"
import DashboardPage from "../../pages/dashboard"
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

const mockDevices = [
  {
    id: "device-1",
    name: "Living Room Sensor",
    type: "Temperature",
    status: "online" as const,
    temperature: 22.5,
    humidity: 45,
    batteryLevel: 78,
    lastUpdated: "10 min ago",
  },
  {
    id: "device-2",
    name: "Kitchen Sensor",
    type: "Humidity",
    status: "offline" as const,
    temperature: 24.1,
    humidity: 52,
    batteryLevel: 92,
    lastUpdated: "5 min ago",
  },
]

describe("Device Management Flow (Fixed)", () => {
  beforeEach(() => {
    // Set authenticated owner state
    useAuthStore.setState({
      user: { id: "1", name: "Owner", email: "owner@example.com", role: "owner" },
      token: "token",
      isAuthenticated: true,
    })

    // Reset device store
    useDeviceStore.setState({
      devices: [],
      loading: false,
      error: null,
    })

    jest.clearAllMocks()
  })

  describe("Device Display", () => {
    it("should load and display devices on dashboard", async () => {
      mockApi.devices.getAll.mockResolvedValue(mockDevices)

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      // Check dashboard title
      expect(screen.getByText("Device Dashboard")).toBeInTheDocument()

      // Wait for devices to load
      await waitFor(() => {
        expect(screen.getByText("Living Room Sensor")).toBeInTheDocument()
        expect(screen.getByText("Kitchen Sensor")).toBeInTheDocument()
      })

      // Check device details
      expect(screen.getByText("22.5°C")).toBeInTheDocument()
      expect(screen.getByText("45%")).toBeInTheDocument()
      expect(screen.getByText("online")).toBeInTheDocument()
      expect(screen.getByText("offline")).toBeInTheDocument()
    })

    it("should show loading state while fetching devices", async () => {
      // Mock delayed response
      mockApi.devices.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockDevices), 100)),
      )

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      // Should show skeleton loaders initially
      const skeletons = document.querySelectorAll(".device-card-skeleton")
      expect(skeletons.length).toBeGreaterThan(0)

      // Wait for devices to load
      await waitFor(() => {
        expect(screen.getByText("Living Room Sensor")).toBeInTheDocument()
      })
    })
  })

  describe("Device Selection", () => {
    it("should select device and show charts", async () => {
      mockApi.devices.getAll.mockResolvedValue(mockDevices)

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText("Living Room Sensor")).toBeInTheDocument()
      })

      // Click on device card
      const deviceCard = screen.getByText("Living Room Sensor").closest(".device-card")
      expect(deviceCard).toBeInTheDocument()

      if (deviceCard) {
        fireEvent.click(deviceCard)

        // Should show charts section
        await waitFor(() => {
          expect(screen.getByText("Device Statistics: Living Room Sensor")).toBeInTheDocument()
        })
      }
    })
  })

  describe("Add Device Flow (Fixed)", () => {
    it("should complete full add device flow with proper selectors", async () => {
      mockApi.devices.getAll.mockResolvedValue(mockDevices)
      const newDevice = {
        id: "device-3",
        name: "New Sensor",
        type: "Combined",
        status: "online" as const,
        temperature: 20.0,
        humidity: 40,
        batteryLevel: 85,
        lastUpdated: "just now",
      }
      mockApi.devices.add.mockResolvedValue(newDevice)

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText("Device Dashboard")).toBeInTheDocument()
      })

      // Click Add Device button in header (first one)
      const addButtons = screen.getAllByText("Add Device")
      expect(addButtons.length).toBeGreaterThan(0)

      // Click the first "Add Device" button (in header)
      fireEvent.click(addButtons[0])

      // Should open add device modal
      await waitFor(() => {
        expect(screen.getByText("Add New Device")).toBeInTheDocument()
      })

      // Fill form
      const nameInput = screen.getByPlaceholderText("e.g., Living Room Sensor")
      const serialInput = screen.getByPlaceholderText("e.g., SN123456789")

      fireEvent.change(nameInput, { target: { value: "New Sensor" } })
      fireEvent.change(serialInput, { target: { value: "SN123456789" } })

      // Find submit button by looking for the one inside the form
      const modal =
        screen.getByText("Add New Device").closest('[role="dialog"]') ||
        screen.getByText("Add New Device").closest(".fixed")

      let submitButton: HTMLElement | null = null
      if (modal) {
        submitButton = modal.querySelector('button[type="submit"]') as HTMLElement
      }

      // Fallback: get the last "Add Device" button (should be submit)
      if (!submitButton) {
        const allAddButtons = screen.getAllByText("Add Device")
        submitButton = allAddButtons[allAddButtons.length - 1]
      }

      expect(submitButton).toBeInTheDocument()
      fireEvent.click(submitButton!)

      // Wait for API call
      await waitFor(() => {
        expect(mockApi.devices.add).toHaveBeenCalledWith({
          name: "New Sensor",
          type: "Temperature", // default value
          serialNumber: "SN123456789",
        })
      })
    })

    it("should validate form fields with proper selectors", async () => {
      mockApi.devices.getAll.mockResolvedValue(mockDevices)

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText("Device Dashboard")).toBeInTheDocument()
      })

      // Open add device modal
      const addButtons = screen.getAllByText("Add Device")
      fireEvent.click(addButtons[0])

      await waitFor(() => {
        expect(screen.getByText("Add New Device")).toBeInTheDocument()
      })

      // Try to submit empty form - find submit button properly
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

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText("Device name is required")).toBeInTheDocument()
        expect(screen.getByText("Serial number is required")).toBeInTheDocument()
      })
    })
  })

  describe("Guest User Restrictions", () => {
    it("should not show Add Device button for guests", async () => {
      // Set guest user
      useAuthStore.setState({
        user: { id: "2", name: "Guest", email: "guest@example.com", role: "guest" },
        token: "token",
        isAuthenticated: true,
      })

      mockApi.devices.getAll.mockResolvedValue(mockDevices)

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>,
      )

      await waitFor(() => {
        expect(screen.getByText("Device Dashboard")).toBeInTheDocument()
      })

      // Add Device button should not be present
      expect(screen.queryByText("Add Device")).not.toBeInTheDocument()
    })
  })
})
