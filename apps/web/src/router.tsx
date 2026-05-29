import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "./app/AppLayout"
import { RequireAuth } from "./app/RequireAuth"

const Login = lazy(() => import("./pages/Login").then((m) => ({ default: m.Login })))
const Register = lazy(() => import("./pages/Register").then((m) => ({ default: m.Register })))
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })))
const Vehicles = lazy(() => import("./pages/Vehicles").then((m) => ({ default: m.Vehicles })))
const ArchivedVehicles = lazy(() => import("./pages/ArchivedVehicles").then((m) => ({ default: m.ArchivedVehicles })))
const Admin = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Admin })))
const Garages = lazy(() => import("./pages/Garages").then((m) => ({ default: m.Garages })))
const VehicleDetails = lazy(() => import("./pages/VehicleDetails").then((m) => ({ default: m.VehicleDetails })))

function PageLoader() {
  return <div className="p-6 text-sm text-muted">Chargement…</div>
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  { path: "/", element: <Lazy><Login /></Lazy> },
  { path: "/register", element: <Lazy><Register /></Lazy> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          { index: true, element: <Lazy><Dashboard /></Lazy> },
          { path: "vehicles", element: <Lazy><Vehicles /></Lazy> },
          { path: "vehicles/archived", element: <Lazy><ArchivedVehicles /></Lazy> },
          { path: "admin", element: <Lazy><Admin /></Lazy> },
          { path: "garages", element: <Lazy><Garages /></Lazy> },
          { path: "vehicles/:id", element: <Lazy><VehicleDetails /></Lazy> },
        ],
      },
    ],
  },
])
