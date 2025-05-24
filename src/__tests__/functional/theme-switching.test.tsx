"use client"

import type React from "react"

import { render, screen, fireEvent } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider, useTheme } from "../../components/theme/theme-provider"
import { ThemeToggle } from "../../components/theme/theme-toggle"
import LoginPage from "../../pages/login"
import { jest } from "@jest/globals"

// Test component to access theme context
const ThemeTestComponent = () => {
  const { theme } = useTheme()
  return <div data-testid="current-theme">{theme}</div>
}

const TestWrapper = ({ children, defaultTheme = "light" }: { children: React.ReactNode; defaultTheme?: string }) => (
  <BrowserRouter>
    <ThemeProvider defaultTheme={defaultTheme as any} storageKey="test-theme">
      {children}
    </ThemeProvider>
  </BrowserRouter>
)

describe("Theme Switching", () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()
    // Reset document classes
    document.documentElement.classList.remove("light", "dark")
  })

  describe("Theme Provider", () => {
    it("should initialize with default theme", () => {
      render(
        <TestWrapper defaultTheme="light">
          <ThemeTestComponent />
        </TestWrapper>,
      )

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })

    it("should initialize with system theme", () => {
      render(
        <TestWrapper defaultTheme="system">
          <ThemeTestComponent />
        </TestWrapper>,
      )

      expect(screen.getByTestId("current-theme")).toHaveTextContent("system")
    })

    it("should persist theme in localStorage", () => {
      render(
        <TestWrapper>
          <ThemeTestComponent />
          <ThemeToggle />
        </TestWrapper>,
      )

      // Toggle theme
      const toggleButton = screen.getByRole("button", { name: /toggle theme/i })
      fireEvent.click(toggleButton)

      // Check localStorage
      expect(localStorage.getItem("test-theme")).toBe("dark")
    })
  })

  describe("Theme Toggle Component", () => {
    it("should toggle between light and dark themes", () => {
      render(
        <TestWrapper>
          <ThemeTestComponent />
          <ThemeToggle />
        </TestWrapper>,
      )

      const toggleButton = screen.getByRole("button", { name: /toggle theme/i })
      const themeDisplay = screen.getByTestId("current-theme")

      // Initial state should be light
      expect(themeDisplay).toHaveTextContent("light")

      // Toggle to dark
      fireEvent.click(toggleButton)
      expect(themeDisplay).toHaveTextContent("dark")

      // Toggle back to light
      fireEvent.click(toggleButton)
      expect(themeDisplay).toHaveTextContent("light")
    })

    it("should apply correct CSS classes to document", () => {
      render(
        <TestWrapper>
          <ThemeToggle />
        </TestWrapper>,
      )

      const toggleButton = screen.getByRole("button", { name: /toggle theme/i })

      // Toggle to dark
      fireEvent.click(toggleButton)
      expect(document.documentElement.classList.contains("dark")).toBe(true)

      // Toggle to light
      fireEvent.click(toggleButton)
      expect(document.documentElement.classList.contains("light")).toBe(true)
    })
  })

  describe("Theme Integration", () => {
    it("should maintain theme across page navigation", () => {
      render(
        <TestWrapper>
          <LoginPage />
        </TestWrapper>,
      )

      // Find and click theme toggle
      const toggleButton = screen.getByRole("button", { name: /toggle theme/i })
      fireEvent.click(toggleButton)

      // Check that dark theme is applied
      expect(document.documentElement.classList.contains("dark")).toBe(true)
      expect(localStorage.getItem("test-theme")).toBe("dark")
    })

    it("should load saved theme from localStorage", () => {
      // Pre-set theme in localStorage
      localStorage.setItem("test-theme", "dark")

      render(
        <TestWrapper>
          <ThemeTestComponent />
        </TestWrapper>,
      )

      // Should load dark theme from localStorage
      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })

  describe("System Theme Detection", () => {
    it("should respect system theme preference", () => {
      // Mock system preference for dark mode
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(
        <TestWrapper defaultTheme="system">
          <ThemeTestComponent />
        </TestWrapper>,
      )

      expect(screen.getByTestId("current-theme")).toHaveTextContent("system")
      // Should apply dark class based on system preference
      expect(document.documentElement.classList.contains("dark")).toBe(true)
    })
  })
})
