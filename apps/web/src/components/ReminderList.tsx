import { useCallback, useEffect, useState } from "react"
import { apiFetch } from "../lib/api"
import { ReminderForm } from "./ReminderForm"

type Reminder = {
  id: string
  type: "INSPECTION" | "INSURANCE" | "OIL_CHANGE" | "CUSTOM"
  title: string
  status: "OPEN" | "DONE"
  dueDate: string | null
  dueMileage: number | null
  notes?: string | null
}

function typeLabel(t: Reminder["type"]) {
  const map: Record<Reminder["type"], string> = {
    INSPECTION: "Contrôle technique",
    INSURANCE: "Assurance",
    OIL_CHANGE: "Vidange",
    CUSTOM: "Autre",
  }
  return map[t]
}

function statusBadge(status: Reminder["status"]) {
  return status === "DONE"
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-amber-50 text-amber-700 border-amber-200"
}

export function ReminderList({ vehicleId }: { vehicleId: string }) {
  const [items, setItems] = useState<Reminder[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch<{ reminders: Reminder[] }>(
        `/vehicles/${vehicleId}/reminders`
      )
      setItems(res.reminders)
    } catch {
      setError("Impossible de charger les rappels.")
    } finally {
      setLoading(false)
    }
  }, [vehicleId])

  useEffect(() => {
    void load()
  }, [load])

  async function markDone(r: Reminder) {
    await apiFetch(`/reminders/${r.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: r.status === "DONE" ? "OPEN" : "DONE" }),
    })
    await load()
  }

  async function remove(r: Reminder) {
    await apiFetch(`/reminders/${r.id}`, { method: "DELETE" })
    await load()
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rappels</h2>
        <button
          className="rounded-xl bg-primary px-4 py-2 text-sm text-white"
          onClick={() => setOpen(true)}
        >
          Ajouter
        </button>
      </div>

      {loading && <div className="text-sm text-muted">Chargement…</div>}
      {error && <div className="text-sm text-danger">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-muted">Aucun rappel pour ce véhicule.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              className="flex items-start justify-between rounded-xl border border-border bg-white p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-border bg-white px-2 py-0.5 text-xs text-muted">
                    {typeLabel(r.type)}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${statusBadge(
                      r.status
                    )}`}
                  >
                    {r.status === "DONE" ? "Terminé" : "À faire"}
                  </span>
                </div>

                <div className="mt-1 font-medium truncate">{r.title}</div>

                <div className="mt-1 text-sm text-muted">
                  {r.dueDate ? (
                    <>Échéance : {new Date(r.dueDate).toLocaleDateString()}</>
                  ) : r.dueMileage != null ? (
                    <>Échéance : {r.dueMileage.toLocaleString()} km</>
                  ) : (
                    <>Pas d’échéance</>
                  )}
                </div>

                {r.notes && (
                  <div className="mt-1 text-sm text-muted break-words">
                    {r.notes}
                  </div>
                )}
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => markDone(r)}
                >
                  {r.status === "DONE" ? "Ré-ouvrir" : "Terminer"}
                </button>
                <button
                  className="text-sm text-danger hover:underline"
                  onClick={() => remove(r)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ReminderForm
        open={open}
        onClose={() => setOpen(false)}
        vehicleId={vehicleId}
        onCreated={load}
      />
    </div>
  )
}
