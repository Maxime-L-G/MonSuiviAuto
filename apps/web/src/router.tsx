import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "./app/AppLayout"
import { RequireAuth } from "./app/RequireAuth"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { Vehicles } from "./pages/Vehicles"
import { VehicleDetails } from "./pages/VehicleDetails"

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "vehicles", element: <Vehicles /> },
          { path: "vehicles/:id", element: <VehicleDetails /> }
        ],
      },
    ],
  },
])
