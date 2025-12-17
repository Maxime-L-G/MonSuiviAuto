import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  currentKm: number
}

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await apiFetch<{ vehicles: Vehicle[] }>("/vehicles")
        setVehicles(data.vehicles)
      } catch {
        setError("Impossible de charger les véhicules.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Véhicules</div>
          <div className="text-sm text-muted">Liste de tes véhicules</div>
        </div>

        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
          Ajouter
        </button>
      </div>

      {loading && <div className="mt-4 text-sm text-muted">Chargement...</div>}
      {error && <div className="mt-4 text-sm text-danger">{error}</div>}

      {!loading && !error && (
        <div className="mt-4 grid gap-3">
          {vehicles.length === 0 ? (
            <div className="text-sm text-muted">Aucun véhicule pour le moment.</div>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className="rounded-xl border border-border bg-white/70 p-4">
                <div className="font-medium">
                  {v.make} {v.model} <span className="text-muted">({v.year})</span>
                </div>
                <div className="text-sm text-muted">{v.currentKm.toLocaleString()} km</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
