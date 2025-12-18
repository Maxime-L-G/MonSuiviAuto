import { useState } from "react"
import { apiFetch } from "../lib/api"
import { createPortal } from "react-dom"

export function MaintenanceForm({
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
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [mileage, setMileage] = useState(0)
  const [cost, setCost] = useState(0)

  if (!open) return null

  async function submit() {
    await apiFetch(`/vehicles/${vehicleId}/maintenances`, {
      method: "POST",
      body: JSON.stringify({
        title,
        date: new Date(date).toISOString(),
        mileage,
        costCents: cost * 100,
      }),
    })
    onClose()
    onCreated()
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4">
        <h3 className="text-lg font-semibold">Ajouter un entretien</h3>

        <div>
          <label className="text-sm font-medium">Intitulé</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="Ex : Changement des pneus"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Date de l’entretien</label>
          <input
            type="date"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Kilométrage du véhicule</label>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="Ex : 65000"
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Coût (€)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="Ex : 120"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            className="rounded-xl border px-4 py-2"
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            className="rounded-xl bg-primary px-4 py-2 text-white"
            onClick={submit}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
