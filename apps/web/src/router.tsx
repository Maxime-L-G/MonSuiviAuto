import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "./app/AppLayout"
import { RequireAuth } from "./app/RequireAuth"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { Vehicles } from "./pages/Vehicles"
import { ArchivedVehicles } from "./pages/ArchivedVehicles"
import { Admin } from "./pages/Admin"
import { Garages } from "./pages/Garages"
import { VehicleDetails } from "./pages/VehicleDetails"

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "vehicles", element: <Vehicles /> },
          { path: "vehicles/archived", element: <ArchivedVehicles /> },
          { path: "admin", element: <Admin /> },
          { path: "garages", element: <Garages /> },
          { path: "vehicles/:id", element: <VehicleDetails /> }
        ],
      },
    ],
  },
])
