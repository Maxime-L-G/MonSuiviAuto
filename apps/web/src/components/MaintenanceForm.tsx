import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { apiFetch } from "../lib/api"

type MaintenanceType = "OIL_CHANGE" | "TIRES" | "BRAKES" | "BATTERY" | "INSPECTION" | "REPAIR" | "OTHER"

type MaintenanceInitial = {
  id: string
  type: MaintenanceType
  title: string
  date: string
  mileage: number
  costCents: number
  notes?: string
}

export function MaintenanceForm({
  open,
  onClose,
  vehicleId,
  onCreated,
  initial,
}: {
  open: boolean
  onClose: () => void
  vehicleId: string
  onCreated: () => void
  initial?: MaintenanceInitial
}) {
  const [type, setType] = useState<MaintenanceType>("OTHER")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [mileage, setMileage] = useState(0)
  const [cost, setCost] = useState(0)
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setType(initial?.type ?? "OTHER")
      setTitle(initial?.title ?? "")
      setDate(initial?.date ? initial.date.slice(0, 10) : "")
      setMileage(initial?.mileage ?? 0)
      setCost(initial?.costCents ? initial.costCents / 100 : 0)
      setNotes(initial?.notes ?? "")
      setError(null)
    }
  }, [open, initial])

  if (!open) return null

  const isEdit = !!initial

  async function submit() {
    if (!title.trim()) {
      setError("L'intitulé est obligatoire.")
      return
    }
    if (!date) {
      setError("La date est obligatoire.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (isEdit) {
        await apiFetch(`/maintenances/${initial!.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            type,
            title: title.trim(),
            date: new Date(date).toISOString(),
            mileage,
            costCents: Math.round(cost * 100),
            notes: notes.trim() || null,
          }),
        })
      } else {
        await apiFetch(`/vehicles/${vehicleId}/maintenances`, {
          method: "POST",
          body: JSON.stringify({
            type,
            title: title.trim(),
            date: new Date(date).toISOString(),
            mileage,
            costCents: Math.round(cost * 100),
            notes: notes.trim() || undefined,
          }),
        })
      }

      onClose()
      onCreated()
    } catch {
      setError("Erreur lors de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-base font-semibold">
            {isEdit ? "Modifier l'entretien" : "Ajouter un entretien"}
          </div>
          <button className="btn-secondary py-1.5 px-3 text-sm" onClick={onClose}>
            Fermer
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="rounded-xl border border-border bg-white p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Type d'entretien</label>
            <select
              className="mt-1 input-field"
              value={type}
              onChange={(e) => setType(e.target.value as MaintenanceType)}
            >
              <option value="OIL_CHANGE">Vidange</option>
              <option value="TIRES">Pneus</option>
              <option value="BRAKES">Freins</option>
              <option value="BATTERY">Batterie</option>
              <option value="INSPECTION">Contrôle technique</option>
              <option value="REPAIR">Réparation</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Intitulé</label>
            <input
              className="mt-1 input-field"
              placeholder="Ex : Changement des pneus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date de l'entretien</label>
            <input
              type="date"
              className="mt-1 input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Kilométrage du véhicule</label>
            <input
              type="number"
              className="mt-1 input-field"
              placeholder="Ex : 65000"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Coût (€)</label>
            <input
              type="number"
              className="mt-1 input-field"
              placeholder="Ex : 120"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="mt-1 input-field"
              rows={3}
              placeholder="Optionnel"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={onClose} disabled={saving}>
              Annuler
            </button>
            <button className="btn-primary" onClick={submit} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
