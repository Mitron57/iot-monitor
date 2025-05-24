"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { NotificationPopup } from "../notification/notification-popup"
import { jest } from "@jest/globals"

const defaultProps = {
  title: "Test Notification",
  message: "This is a test message",
  type: "info" as const,
  onClose: jest.fn(),
}

describe("NotificationPopup", () => {
  it("should render notification content correctly", () => {
    render(<NotificationPopup {...defaultProps} />)

    expect(screen.getByText("Test Notification")).toBeInTheDocument()
    expect(screen.getByText("This is a test message")).toBeInTheDocument()
  })

  it("should call onClose when close button is clicked", () => {
    const onClose = jest.fn()
    render(<NotificationPopup {...defaultProps} onClose={onClose} />)

    const closeButton = screen.getByRole("button")
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })

  it("should show correct icon for warning type", () => {
    render(<NotificationPopup {...defaultProps} type="warning" />)

    // Check if warning icon is present by looking for the SVG with specific class
    const icon = screen.getByTestId("warning-icon") || document.querySelector(".lucide-alert-triangle")
    expect(icon).toBeInTheDocument()
  })

  it("should apply correct background color for error type", () => {
    const { container } = render(<NotificationPopup {...defaultProps} type="error" />)

    const popup = container.firstChild as HTMLElement
    expect(popup).toHaveClass("bg-red-50", "dark:bg-red-950")
  })

  it("should apply correct background color for success type", () => {
    const { container } = render(<NotificationPopup {...defaultProps} type="success" />)

    const popup = container.firstChild as HTMLElement
    expect(popup).toHaveClass("bg-green-50", "dark:bg-green-950")
  })

  it("should show info icon for info type", () => {
    render(<NotificationPopup {...defaultProps} type="info" />)

    const icon = document.querySelector(".lucide-info")
    expect(icon).toBeInTheDocument()
  })

  it("should show success icon for success type", () => {
    render(<NotificationPopup {...defaultProps} type="success" />)

    const icon = document.querySelector(".lucide-check-circle")
    expect(icon).toBeInTheDocument()
  })

  it("should show error icon for error type", () => {
    render(<NotificationPopup {...defaultProps} type="error" />)

    const icon = document.querySelector(".lucide-alert-circle")
    expect(icon).toBeInTheDocument()
  })
})
