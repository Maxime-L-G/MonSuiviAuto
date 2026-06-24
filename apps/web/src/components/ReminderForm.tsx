import { useState } from "react"
import { createPortal } from "react-dom"
import { apiFetch } from "../lib/api"

type ReminderType = "INSPECTION" | "INSURANCE" | "OIL_CHANGE" | "CUSTOM"

export function ReminderForm({
  open,
  onClose,
  vehicleId,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  vehicleId: string
  onCreated: () => void
}) {
  const [type, setType] = useState<ReminderType>("INSPECTION")
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  if (!open) return null

  async function submit() {
    setError(null)

    if (!title.trim()) {
      setError("Le titre est obligatoire.")
      return
    }
    if (!dueDate) {
      setError("La date d’échéance est obligatoire.")
      return
    }

    setSaving(true)
    try {
      await apiFetch(`/vehicles/${vehicleId}/reminders`, {
        method: "POST",
        body: JSON.stringify({
          type,
          title: title.trim(),
          dueDate: new Date(dueDate).toISOString(),
          notes: notes.trim() ? notes.trim() : undefined,
        }),
      })

      onClose()
      onCreated()

      setType("INSPECTION")
      setTitle("")
      setDueDate("")
      setNotes("")
    } catch {
      setError("Erreur lors de la création du rappel.")
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface2 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-base font-semibold">Ajouter un rappel</div>
          <button
            className="rounded-xl px-3 py-1.5 text-sm text-muted hover:bg-slate-100"
            onClick={onClose}
          >
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
            <label className="text-sm font-medium">Type</label>
            <select
              className="mt-1 input-field"
              value={type}
              onChange={(e) => setType(e.target.value as ReminderType)}
            >
              <option value="INSPECTION">Contrôle technique</option>
              <option value="INSURANCE">Assurance</option>
              <option value="OIL_CHANGE">Vidange</option>
              <option value="CUSTOM">Autre</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Titre</label>
            <input
              className="mt-1 input-field"
              placeholder="Ex : Contrôle technique"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date d’échéance</label>
            <input
              type="date"
              className="mt-1 input-field"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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
            <button
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              className="btn-primary"
              onClick={submit}
              disabled={saving}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
