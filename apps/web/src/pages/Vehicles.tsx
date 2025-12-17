import { useEffect, useMemo, useState } from "react"
import { apiFetch } from "../lib/api"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  currentKm: number
}

type CreateVehicleInput = {
  make: string
  model: string
  year: number
  currentKm: number
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
      {children}
    </div>
  )
}

function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-slate-950/50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface2 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-base font-semibold">{title}</div>
          <button
            className="rounded-xl px-3 py-1.5 text-sm text-muted hover:bg-slate-100"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState<number>(currentYear)
  const [currentKm, setCurrentKm] = useState<number>(0)

  async function loadVehicles() {
    setError(null)
    setLoading(true)
    try {
      const data = await apiFetch<{ vehicles: Vehicle[] }>("/vehicles")
      setVehicles(data.vehicles)
    } catch {
      setError("Impossible de charger les véhicules.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadVehicles()
  }, [])

  function resetForm() {
    setFormError(null)
    setMake("")
    setModel("")
    setYear(currentYear)
    setCurrentKm(0)
  }

  async function createVehicle() {
    setFormError(null)

    // validations simples côté UI (le back valide aussi)
    if (!make.trim() || !model.trim()) {
      setFormError("Marque et modèle sont obligatoires.")
      return
    }
    if (!Number.isInteger(year) || year < 1900 || year > currentYear + 1) {
      setFormError("Année invalide.")
      return
    }
    if (!Number.isInteger(currentKm) || currentKm < 0) {
      setFormError("Kilométrage invalide.")
      return
    }

    const payload: CreateVehicleInput = {
      make: make.trim(),
      model: model.trim(),
      year,
      currentKm,
    }

    setSaving(true)
    try {
      await apiFetch<{ vehicle: Vehicle }>("/vehicles", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      setOpen(false)
      resetForm()
      await loadVehicles()
    } catch {
      setFormError("Erreur lors de la création du véhicule.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Véhicules</div>
            <div className="text-sm text-muted">Liste de tes véhicules</div>
          </div>

          <button
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95"
            onClick={() => {
              resetForm()
              setOpen(true)
            }}
          >
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
      </Card>

      <Modal
        title="Ajouter un véhicule"
        open={open}
        onClose={() => setOpen(false)}
      >
        {formError && (
          <div className="mb-4 rounded-xl border border-border bg-white p-3 text-sm text-danger">
            {formError}
          </div>
        )}

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Marque</label>
            <input
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Peugeot"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Modèle</label>
            <input
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="208"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Année</label>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={1900}
                max={currentYear + 1}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Kilométrage actuel</label>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                value={currentKm}
                onChange={(e) => setCurrentKm(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-slate-50"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Annuler
            </button>

            <button
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95 disabled:opacity-60"
              onClick={createVehicle}
              disabled={saving}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
