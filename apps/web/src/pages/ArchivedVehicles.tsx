import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  currentKm: number
  archivedAt: string
}

export function ArchivedVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<{ vehicles: Vehicle[] }>("/vehicles/archived")
      .then((res) => setVehicles(res.vehicles))
      .catch(() => setError("Impossible de charger les véhicules archivés."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-lg font-semibold">Véhicules archivés</div>
        <div className="text-sm text-muted">Véhicules retirés de ta liste active</div>
      </div>

      {loading && <div className="text-sm text-muted">Chargement…</div>}
      {error && <div className="text-sm text-danger">{error}</div>}

      {!loading && !error && vehicles.length === 0 && (
        <div className="text-sm text-muted">Aucun véhicule archivé.</div>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <div className="grid gap-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="rounded-xl border border-border bg-white/50 p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-muted">
                  {v.make} {v.model}{" "}
                  <span className="text-muted">({v.year})</span>
                </div>
                <div className="mt-1 text-sm text-muted">
                  {v.currentKm.toLocaleString()} km · Archivé le{" "}
                  {new Date(v.archivedAt).toLocaleDateString()}
                </div>
              </div>
              <span className="text-xs text-muted border border-border rounded-full px-2 py-0.5">
                Archivé
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
