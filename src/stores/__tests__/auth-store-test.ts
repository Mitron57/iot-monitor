import { useAuthStore } from "../auth-store"
import { api } from "../../api/api"

// Mock API
jest.mock("../../api/api")
const mockApi = api as jest.Mocked<typeof api>

describe("AuthStore", () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    jest.clearAllMocks()
  })

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: "owner@example.com",
        role: "owner" as const,
      }
      const mockToken = "mock-token"

      mockApi.auth.login.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      })

      const { login } = useAuthStore.getState()
      await login("owner@example.com", "password123")

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.token).toBe(mockToken)
      expect(state.isAuthenticated).toBe(true)
    })

    it("should throw error with invalid credentials", async () => {
      mockApi.auth.login.mockRejectedValue(new Error("Invalid credentials"))

      const { login } = useAuthStore.getState()

      await expect(login("wrong@email.com", "wrongpassword")).rejects.toThrow("Invalid credentials")

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe("logout", () => {
    it("should clear user data on logout", () => {
      // Set initial state
      useAuthStore.setState({
        user: { id: "1", name: "John", email: "john@example.com", role: "owner" },
        token: "token",
        isAuthenticated: true,
      })

      const { logout } = useAuthStore.getState()
      logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe("switchRole", () => {
    it("should switch from owner to guest", () => {
      useAuthStore.setState({
        user: { id: "1", name: "John", email: "john@example.com", role: "owner" },
        token: "token",
        isAuthenticated: true,
      })

      const { switchRole } = useAuthStore.getState()
      switchRole()

      const state = useAuthStore.getState()
      expect(state.user?.role).toBe("guest")
    })

    it("should not switch from guest to owner directly", () => {
      useAuthStore.setState({
        user: { id: "1", name: "John", email: "john@example.com", role: "guest" },
        token: "token",
        isAuthenticated: true,
      })

      const { switchRole } = useAuthStore.getState()
      switchRole()

      const state = useAuthStore.getState()
      expect(state.user?.role).toBe("guest") // Should remain guest
    })
  })

  describe("switchToOwner", () => {
    it("should switch to owner with valid credentials", () => {
      const ownerData = {
        user: { id: "1", name: "Owner", email: "owner@example.com", role: "owner" as const },
        token: "owner-token",
      }

      const { switchToOwner } = useAuthStore.getState()
      switchToOwner(ownerData)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(ownerData.user)
      expect(state.token).toBe(ownerData.token)
      expect(state.isAuthenticated).toBe(true)
    })
  })
})
