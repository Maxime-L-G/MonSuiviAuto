import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { apiFetch, getUser } from "../lib/api"
import { createPortal } from "react-dom"

type VehicleUsage = "PERSONAL" | "PROFESSIONAL"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  currentKm: number
  usage: VehicleUsage
}

const USAGE_LABELS: Record<VehicleUsage, string> = {
  PERSONAL: "Personnel",
  PROFESSIONAL: "Professionnel",
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

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface2 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-base font-semibold">{title}</div>
          <button className="btn-secondary py-1.5 px-3 text-sm" onClick={onClose}>
            Fermer
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export function Vehicles() {
  const isPro = getUser()?.role === "PROFESSIONAL"

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Vehicle | null>(null)
  const [confirmArchive, setConfirmArchive] = useState<Vehicle | null>(null)

  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState(currentYear)
  const [currentKm, setCurrentKm] = useState(0)
  const [usage, setUsage] = useState<VehicleUsage>("PERSONAL")

  async function loadVehicles() {
    setLoading(true)
    setError(null)
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
    setUsage("PERSONAL")
  }

  function openCreate() {
    setEditing(null)
    resetForm()
    setOpenForm(true)
  }

  function openEdit(v: Vehicle) {
    setEditing(v)
    setMake(v.make)
    setModel(v.model)
    setYear(v.year)
    setCurrentKm(v.currentKm)
    setUsage(v.usage)
    setFormError(null)
    setOpenForm(true)
  }

  async function submitForm() {
    setFormError(null)

    if (!make.trim() || !model.trim()) {
      setFormError("La marque et le modèle sont obligatoires.")
      return
    }

    setSaving(true)
    try {
      const payload = { make: make.trim(), model: model.trim(), year, currentKm, usage }

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

      setOpenForm(false)
      await loadVehicles()
    } catch {
      setFormError("Erreur lors de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteVehicle() {
    if (!confirmDelete) return
    try {
      await apiFetch(`/vehicles/${confirmDelete.id}`, { method: "DELETE" })
      setConfirmDelete(null)
      await loadVehicles()
    } catch {
      setError("Erreur lors de la suppression.")
    }
  }

  async function archiveVehicle() {
    if (!confirmArchive) return
    try {
      await apiFetch(`/vehicles/${confirmArchive.id}/archive`, { method: "PATCH" })
      setConfirmArchive(null)
      await loadVehicles()
    } catch {
      setError("Erreur lors de l'archivage.")
    }
  }


  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Véhicules</div>
          <div className="text-sm text-muted">Gestion de tes véhicules</div>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          Ajouter
        </button>
      </div>

      {loading && <div className="mt-4 text-sm text-muted">Chargement…</div>}
      {error && <div className="mt-4 text-sm text-danger">{error}</div>}

      {!loading && !error && (
        <div className="mt-4 grid gap-3">
          {vehicles.length === 0 ? (
            <div className="text-sm text-muted">Aucun véhicule pour le moment.</div>
          ) : (
            vehicles.map((v) => (
              <div
                key={v.id}
                className="rounded-xl border border-border bg-white/70 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="font-medium">
                    <Link to={`/app/vehicles/${v.id}`} className="hover:underline">
                      {v.make} {v.model}
                    </Link>{" "}
                    <span className="text-muted">({v.year})</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                    <span>{v.currentKm.toLocaleString()} km</span>
                    {isPro && (
                      <span className="inline-flex items-center rounded-full border border-border bg-white px-2 py-0.5 text-xs">
                        {USAGE_LABELS[v.usage]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button className="btn-secondary py-1.5" onClick={() => openEdit(v)}>
                    Modifier
                  </button>
                  <button
                    className="btn-secondary py-1.5 text-amber-600 hover:bg-amber-50"
                    onClick={() => setConfirmArchive(v)}
                  >
                    Archiver
                  </button>
                  <button
                    className="btn-secondary py-1.5 text-danger hover:bg-red-50"
                    onClick={() => setConfirmDelete(v)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal
        title={editing ? "Modifier le véhicule" : "Ajouter un véhicule"}
        open={openForm}
        onClose={() => setOpenForm(false)}
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
              className="mt-1 input-field"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Modèle</label>
            <input
              className="mt-1 input-field"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Année</label>
              <input
                type="number"
                className="mt-1 input-field"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Kilométrage actuel</label>
              <input
                type="number"
                className="mt-1 input-field"
                value={currentKm}
                onChange={(e) => setCurrentKm(Number(e.target.value))}
              />
            </div>
          </div>

          {isPro && (
            <div>
              <label className="text-sm font-medium">Usage</label>
              <select
                className="mt-1 input-field"
                value={usage}
                onChange={(e) => setUsage(e.target.value as VehicleUsage)}
              >
                <option value="PERSONAL">Personnel</option>
                <option value="PROFESSIONAL">Professionnel</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setOpenForm(false)}>
              Annuler
            </button>
            <button className="btn-primary" onClick={submitForm} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Archiver le véhicule"
        open={!!confirmArchive}
        onClose={() => setConfirmArchive(null)}
      >
        <p className="text-sm text-muted">
          Es-tu sûr de vouloir archiver{" "}
          <strong>{confirmArchive?.make} {confirmArchive?.model}</strong> ? Il n'apparaîtra plus dans ta liste.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setConfirmArchive(null)}>
            Annuler
          </button>
          <button className="btn-primary" onClick={archiveVehicle}>
            Archiver
          </button>
        </div>
      </Modal>

      <Modal
        title="Supprimer le véhicule"
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <p className="text-sm text-muted">
          Es-tu sûr de vouloir supprimer{" "}
          <strong>{confirmDelete?.make} {confirmDelete?.model}</strong> ?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>
            Annuler
          </button>
          <button className="btn-danger" onClick={deleteVehicle}>
            Supprimer
          </button>
        </div>
      </Modal>
    </Card>
  )
}
