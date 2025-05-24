import "@testing-library/jest-dom"

// Подавляем все предупреждения о deprecated модулях в тестах
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  // Подавляем предупреждения о punycode и других deprecated модулях
  console.warn = (...args: any[]) => {
    const message = args[0]
    if (typeof message === "string") {
      if (
        message.includes("punycode") ||
        message.includes("deprecated") ||
        message.includes("React Router Future Flag Warning") ||
        message.includes("v7_startTransition") ||
        message.includes("v7_relativeSplatPath")
      ) {
        return
      }
    }
    originalWarn.call(console, ...args)
  }

  // Подавляем ожидаемые ошибки в тестах
  console.error = (...args: any[]) => {
    const message = args[0]
    if (typeof message === "string") {
      if (
        message.includes("Failed to fetch devices") ||
        message.includes("Failed to add device") ||
        message.includes("Failed to update device") ||
        message.includes("Failed to delete device") ||
        message.includes("Login failed") ||
        message.includes("Registration failed") ||
        message.includes("Network error") ||
        message.includes("Invalid credentials")
      ) {
        return
      }
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})

// Mock animejs
jest.mock("animejs", () => ({
  animate: jest.fn(),
  stagger: jest.fn(),
}))

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: "/dashboard",
  }),
}))

// Mock date-fns
jest.mock("date-fns", () => ({
  formatDistanceToNow: jest.fn(() => "5 minutes ago"),
}))

// Mock recharts
jest.mock("recharts", () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
