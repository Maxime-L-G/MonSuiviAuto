import { useCallback, useEffect, useState } from "react"
import { apiFetch } from "../lib/api"
import { MaintenanceForm } from "./MaintenanceForm"

type MaintenanceType = "OIL_CHANGE" | "TIRES" | "BRAKES" | "BATTERY" | "INSPECTION" | "REPAIR" | "OTHER"

type Maintenance = {
  id: string
  title: string
  type: MaintenanceType
  date: string
  mileage: number
  costCents: number
  notes?: string
}

const TYPE_LABELS: Record<MaintenanceType, string> = {
  OIL_CHANGE: "Vidange",
  TIRES: "Pneus",
  BRAKES: "Freins",
  BATTERY: "Batterie",
  INSPECTION: "Contrôle technique",
  REPAIR: "Réparation",
  OTHER: "Autre",
}

export function MaintenanceList({ vehicleId }: { vehicleId: string }) {
  const [items, setItems] = useState<Maintenance[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Maintenance | null>(null)

  const [filterType, setFilterType] = useState<MaintenanceType | "ALL">("ALL")
  const [filterYear, setFilterYear] = useState<number | "ALL">("ALL")

  const years = [...new Set(items.map((m) => new Date(m.date).getFullYear()))].sort((a, b) => b - a)

  const filteredItems = items.filter((m) => {
    if (filterType !== "ALL" && m.type !== filterType) return false
    if (filterYear !== "ALL" && new Date(m.date).getFullYear() !== filterYear) return false
    return true
  })

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

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(m: Maintenance) {
    setEditing(m)
    setFormOpen(true)
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Entretiens</h2>
        <button className="btn-primary" onClick={openCreate}>
          Ajouter
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="input-field"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as MaintenanceType | "ALL")}
          >
            <option value="ALL">Tous les types</option>
            {(Object.keys(TYPE_LABELS) as MaintenanceType[]).map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>

          <select
            className="input-field"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
          >
            <option value="ALL">Toutes les années</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      {filteredItems.length === 0 && (
        <p className="text-sm text-muted">
          {items.length === 0 ? "Aucun entretien enregistré." : "Aucun entretien pour ces filtres."}
        </p>
      )}

      <ul className="space-y-2">
        {filteredItems.map((m) => (
          <li
            key={m.id}
            className="flex justify-between rounded-xl border border-border bg-white p-4"
          >
            <div>
              <div className="mb-1 inline-flex items-center rounded-full border border-border bg-white px-2 py-0.5 text-xs text-muted">
                {TYPE_LABELS[m.type] ?? m.type}
              </div>
              <div className="font-medium">{m.title}</div>
              <div className="text-sm text-muted">
                {new Date(m.date).toLocaleDateString()} · {m.mileage.toLocaleString()} km
              </div>
              {m.costCents > 0 && (
                <div className="text-sm">{(m.costCents / 100).toFixed(2)} €</div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                className="text-sm text-primary hover:underline"
                onClick={() => openEdit(m)}
              >
                Modifier
              </button>
              <button
                className="text-sm text-danger hover:underline"
                onClick={() => remove(m.id)}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      <MaintenanceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        vehicleId={vehicleId}
        onCreated={load}
        initial={editing ?? undefined}
      />
    </div>
  )
}
