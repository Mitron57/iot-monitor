import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import DashboardPage from "./pages/dashboard"
import NotificationsPage from "./pages/notifications"
import SettingsPage from "./pages/settings"
import ProtectedRoute from "./components/protected-route"
import { ToastContainer } from "./components/toast-container"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="iot-theme">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </ThemeProvider>
  )
}

export default App
