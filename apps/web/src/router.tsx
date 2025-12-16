import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "./app/AppLayout"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { Vehicles } from "./pages/Vehicles"

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "vehicles", element: <Vehicles /> },
    ],
  },
])
