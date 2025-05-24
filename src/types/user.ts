// User type definition
export interface User {
  id: string
  name: string
  email: string
  role: "owner" | "guest"
  avatar?: string
  password?: string // Only used for registration/settings, not stored in state
}
