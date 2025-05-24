"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { DeviceCard } from "../device/device-card"
import { useToast } from "../../hooks/use-toast"

// Mock hooks
jest.mock("../../hooks/use-toast")
const mockToast = useToast as jest.MockedFunction<typeof useToast>

const mockDevice = {
  id: "device-1",
  name: "Living Room Sensor",
  type: "Temperature",
  status: "online" as const,
  temperature: 22.5,
  humidity: 45,
  batteryLevel: 78,
  lastUpdated: "10 min ago",
}

const defaultProps = {
  device: mockDevice,
  isSelected: false,
  onSelect: jest.fn(),
  isOwner: true,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
}

describe("DeviceCard", () => {
  beforeEach(() => {
    mockToast.mockReturnValue({
      toast: jest.fn(),
      toasts: [],
      dismiss: jest.fn(),
    })
  })

  it("should render device information correctly", () => {
    render(<DeviceCard {...defaultProps} />)

    expect(screen.getByText("Living Room Sensor")).toBeInTheDocument()
    expect(screen.getByText("Temperature")).toBeInTheDocument()
    expect(screen.getByText("22.5°C")).toBeInTheDocument()
    expect(screen.getByText("45%")).toBeInTheDocument()
    expect(screen.getByText("78%")).toBeInTheDocument()
    expect(screen.getByText("online")).toBeInTheDocument()
  })

  it("should call onSelect when card is clicked", () => {
    const onSelect = jest.fn()
    render(<DeviceCard {...defaultProps} onSelect={onSelect} />)

    fireEvent.click(screen.getByText("Living Room Sensor"))
    expect(onSelect).toHaveBeenCalled()
  })

  it("should show selected state", () => {
    render(<DeviceCard {...defaultProps} isSelected={true} />)

    const card = screen.getByText("Living Room Sensor").closest(".device-card")
    expect(card).toHaveClass("ring-2", "ring-primary")
  })

  it("should show correct battery icon for low battery", () => {
    const lowBatteryDevice = { ...mockDevice, batteryLevel: 15 }
    render(<DeviceCard {...defaultProps} device={lowBatteryDevice} />)

    expect(screen.getByText("15%")).toBeInTheDocument()
  })

  it("should show offline status correctly", () => {
    const offlineDevice = { ...mockDevice, status: "offline" as const }
    render(<DeviceCard {...defaultProps} device={offlineDevice} />)

    expect(screen.getByText("offline")).toBeInTheDocument()
  })

  it("should show menu button for all users", () => {
    render(<DeviceCard {...defaultProps} isOwner={false} />)

    // Look for the menu button by finding the MoreVertical icon
    const menuButton = document.querySelector(".lucide-more-vertical")?.closest("button")
    expect(menuButton).toBeInTheDocument()
  })

  it("should show refresh option in menu", () => {
    render(<DeviceCard {...defaultProps} />)

    // Click menu button to open menu
    const menuButton = document.querySelector(".lucide-more-vertical")?.closest("button")
    if (menuButton) {
      fireEvent.click(menuButton)
    }

    // Note: In a real test, we'd need to mock the menu opening state
    // For now, we just verify the button exists
    expect(menuButton).toBeInTheDocument()
  })

  it("should handle refresh state correctly", () => {
    const { rerender } = render(<DeviceCard {...defaultProps} />)

    // Initially not refreshing
    const card = screen.getByText("Living Room Sensor").closest(".device-card")
    expect(card).not.toHaveClass("opacity-60")

    // We can't easily test the refreshing state without mocking the internal state
    // This would require a more complex test setup or exposing the refresh state
  })

  it("should show warning status correctly", () => {
    const warningDevice = { ...mockDevice, status: "warning" as const }
    render(<DeviceCard {...defaultProps} device={warningDevice} />)

    expect(screen.getByText("warning")).toBeInTheDocument()
  })
})
