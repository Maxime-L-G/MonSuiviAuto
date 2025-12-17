import { useEffect, useMemo, useState } from "react"
import { apiFetch } from "../lib/api"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  currentKm: number
}

type VehicleInput = {
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
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />
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
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState<number>(currentYear)
  const [currentKm, setCurrentKm] = useState<number>(0)

  async function loadVehicles() {
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

  function openCreate() {
    setEditing(null)
    setMake("")
    setModel("")
    setYear(currentYear)
    setCurrentKm(0)
    setFormError(null)
    setOpen(true)
  }

  function openEdit(v: Vehicle) {
    setEditing(v)
    setMake(v.make)
    setModel(v.model)
    setYear(v.year)
    setCurrentKm(v.currentKm)
    setFormError(null)
    setOpen(true)
  }

  async function submit() {
    setFormError(null)

    if (!make.trim() || !model.trim()) {
      setFormError("Marque et modèle obligatoires.")
      return
    }

    const payload: VehicleInput = {
      make: make.trim(),
      model: model.trim(),
      year,
      currentKm,
    }

    setSaving(true)
    try {
      if (editing) {
        await apiFetch(`/vehicles/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      } else {
        await apiFetch("/vehicles", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      }

      setOpen(false)
      await loadVehicles()
    } catch {
      setFormError("Erreur lors de l’enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce véhicule ?")) return

    try {
      await apiFetch(`/vehicles/${id}`, { method: "DELETE" })
      await loadVehicles()
    } catch {
      alert("Erreur lors de la suppression.")
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Véhicules</div>
          <div className="text-sm text-muted">Gestion de tes véhicules</div>
        </div>

        <button
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95"
          onClick={openCreate}
        >
          Ajouter
        </button>
      </div>

      {loading && <div className="mt-4 text-sm text-muted">Chargement...</div>}
      {error && <div className="mt-4 text-sm text-danger">{error}</div>}

      {!loading && !error && (
        <div className="mt-4 grid gap-3">
          {vehicles.map((v) => (
            <div key={v.id} className="rounded-xl border border-border bg-white/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {v.make} {v.model}{" "}
                    <span className="text-muted">({v.year})</span>
                  </div>
                  <div className="text-sm text-muted">
                    {v.currentKm.toLocaleString()} km
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-slate-100"
                    onClick={() => openEdit(v)}
                  >
                    Modifier
                  </button>
                  <button
                    className="rounded-lg border border-border px-3 py-1.5 text-sm text-danger hover:bg-red-50"
                    onClick={() => remove(v.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editing ? "Modifier le véhicule" : "Ajouter un véhicule"}
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
              />
            </div>

            <div>
              <label className="text-sm font-medium">Kilométrage actuel</label>
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                value={currentKm}
                onChange={(e) => setCurrentKm(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="rounded-xl border px-4 py-2"
              onClick={() => setOpen(false)}
            >
              Annuler
            </button>
            <button
              className="rounded-xl bg-primary px-4 py-2 text-white"
              disabled={saving}
              onClick={submit}
            >
              {saving ? "..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}
