import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { apiFetch } from "../lib/api"
import { MaintenanceList } from "../components/MaintenanceList"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  currentKm: number
}

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    if (!id) return
    apiFetch<{ vehicle: Vehicle }>(`/vehicles/${id}`)
      .then((res) => setVehicle(res.vehicle))
  }, [id])

  if (!vehicle) return <div>Chargement…</div>

  return (
    <div className="space-y-6">
      <Link to="/app/vehicles" className="text-sm text-muted hover:underline">
        ← Retour aux véhicules
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h1 className="text-xl font-semibold">
          {vehicle.make} {vehicle.model}
        </h1>
        <p className="text-sm text-muted">
          {vehicle.year} · {vehicle.currentKm.toLocaleString()} km
        </p>
      </div>

      <MaintenanceList vehicleId={vehicle.id} />
    </div>
  )
}
