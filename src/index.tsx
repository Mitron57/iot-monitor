import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"

const container = document.getElementById("root")
const root = createRoot(container!)

// Get the base path from the window location or environment variable
const getBasePath = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.split('/')[1]
    return path ? `/${path}` : ''
  }
  return process.env.PUBLIC_URL || ''
}

root.render(
  <React.StrictMode>
    <BrowserRouter basename={getBasePath()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
