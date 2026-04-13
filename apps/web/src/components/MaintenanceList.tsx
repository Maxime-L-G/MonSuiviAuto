import { useCallback, useEffect, useState } from "react"
import { apiFetch } from "../lib/api"
import { MaintenanceForm } from "./MaintenanceForm"

type Maintenance = {
  id: string
  title: string
  type: string
  date: string
  mileage: number
  costCents: number
  notes?: string
}

function typeLabel(t: string) {
  const map: Record<string, string> = {
    OIL_CHANGE: "Vidange",
    TIRES: "Pneus",
    BRAKES: "Freins",
    BATTERY: "Batterie",
    INSPECTION: "CT",
    REPAIR: "Réparation",
    OTHER: "Autre",
  }
  return map[t] ?? t
}


export function MaintenanceList({ vehicleId }: { vehicleId: string }) {
  const [items, setItems] = useState<Maintenance[]>([])
  const [open, setOpen] = useState(false)

  const load = useCallback(async () => {
    const res = await apiFetch<{ maintenances: Maintenance[] }>(
      `/vehicles/${vehicleId}/maintenances`
    )
    setItems(res.maintenances)
  }, [vehicleId])

  useEffect(() => {
    void load()
  }, [load])

  async function remove(id: string) {
    await apiFetch(`/maintenances/${id}`, { method: "DELETE" })
    await load()
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Entretiens</h2>
        <button
          className="btn-primary"
          onClick={() => setOpen(true)}
        >
          Ajouter
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted">Aucun entretien enregistré.</p>
      )}

      <ul className="space-y-2">
        {items.map((m) => (
          <li
            key={m.id}
            className="flex justify-between rounded-xl border border-border bg-white p-4"
          >
            <div>
              <div className="mb-1 inline-flex items-center rounded-full border border-border bg-white px-2 py-0.5 text-xs text-muted">
                {typeLabel(m.type)}
              </div>
              <div className="font-medium">{m.title}</div>
              <div className="text-sm text-muted">
                {new Date(m.date).toLocaleDateString()} · {m.mileage} km
              </div>
              {m.costCents > 0 && (
                <div className="text-sm">
                  {(m.costCents / 100).toFixed(2)} €
                </div>
              )}
            </div>

            <button
              className="text-sm text-danger hover:underline"
              onClick={() => remove(m.id)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      <MaintenanceForm
        open={open}
        onClose={() => setOpen(false)}
        vehicleId={vehicleId}
        onCreated={load}
      />
    </div>
  )
}
