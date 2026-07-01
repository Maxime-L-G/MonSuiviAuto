import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { apiFetch } from "../lib/api"
import { MaintenanceList } from "../components/MaintenanceList"
import { ReminderList } from "../components/ReminderList"
import { VehicleStats } from "../components/VehicleStats"
import { DocumentList } from "../components/DocumentList"

type VehicleUsage = "PERSONAL" | "PROFESSIONAL"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  currentKm: number
  usage: VehicleUsage
}

const USAGE_LABELS: Record<VehicleUsage, string> = {
  PERSONAL: "Personnel",
  PROFESSIONAL: "Professionnel",
}

export function VehicleDetails() {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [statsKey, setStatsKey] = useState(0)

  useEffect(() => {
    if (!id) return
    apiFetch<{ vehicle: Vehicle }>(`/vehicles/${id}`)
      .then((res) => setVehicle(res.vehicle))
  }, [id])

  if (!vehicle) return <div className="text-sm text-muted">Chargement…</div>

  return (
    <div className="space-y-6">
      <Link to="/app/vehicles" className="text-sm text-muted hover:underline">
        ← Retour aux véhicules
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h1 className="text-xl font-semibold">
          {vehicle.make} {vehicle.model}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted">
          <span>{vehicle.year}</span>
          <span>·</span>
          <span>{vehicle.currentKm.toLocaleString()} km</span>
          <span>·</span>
          <span className="inline-flex items-center rounded-full border border-border bg-white px-2 py-0.5 text-xs">
            {USAGE_LABELS[vehicle.usage]}
          </span>
        </div>
      </div>

      <VehicleStats vehicleId={vehicle.id} refreshKey={statsKey} />
      <MaintenanceList vehicleId={vehicle.id} onMaintenanceChange={() => setStatsKey(k => k + 1)} />
      <ReminderList vehicleId={vehicle.id} currentKm={vehicle.currentKm} />
      <DocumentList vehicleId={vehicle.id} />
    </div>
  )
}
