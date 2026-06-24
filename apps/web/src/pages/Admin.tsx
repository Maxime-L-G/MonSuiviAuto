import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { apiFetch, getUser } from "../lib/api"

type User = {
  id: string
  email: string
  role: "USER" | "PROFESSIONAL" | "ADMIN"
  createdAt: string
  _count: { vehicles: number }
}

const ROLE_LABELS: Record<User["role"], string> = {
  USER: "Particulier",
  PROFESSIONAL: "Professionnel",
  ADMIN: "Admin",
}

const ROLE_CLASS: Record<User["role"], string> = {
  USER: "bg-slate-50 text-slate-600 border-slate-200",
  PROFESSIONAL: "bg-blue-50 text-blue-700 border-blue-200",
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
}

function ConfirmDeleteModal({
  user,
  onClose,
  onConfirm,
}: {
  user: User
  onClose: () => void
  onConfirm: () => void
}) {
  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface2 shadow-xl p-5">
        <div className="text-base font-semibold">Supprimer cet utilisateur</div>
        <p className="mt-2 text-sm text-muted">
          Es-tu sûr de vouloir supprimer <strong>{user.email}</strong> ? Tous ses véhicules,
          entretiens, rappels et documents seront définitivement supprimés. Cette action est
          irréversible.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-danger" onClick={onConfirm}>Supprimer définitivement</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function Admin() {
  const currentUser = getUser()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null)

  function load() {
    setLoading(true)
    apiFetch<{ users: User[] }>("/admin/users")
      .then((res) => setUsers(res.users))
      .catch(() => setError("Impossible de charger les utilisateurs."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete() {
    if (!confirmDelete) return
    await apiFetch(`/admin/users/${confirmDelete.id}`, { method: "DELETE" })
    setConfirmDelete(null)
    load()
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-lg font-semibold">Administration</div>
        <div className="text-sm text-muted">Liste de tous les utilisateurs</div>
      </div>

      {loading && <div className="text-sm text-muted">Chargement…</div>}
      {error && <div className="text-sm text-danger">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-3">
          {users.length === 0 && (
            <div className="text-sm text-muted">Aucun utilisateur.</div>
          )}
          {users.map((u) => (
            <div
              key={u.id}
              className="rounded-xl border border-border bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{u.email}</div>
                <div className="mt-1 text-sm text-muted">
                  Inscrit le {new Date(u.createdAt).toLocaleDateString()} ·{" "}
                  {u._count.vehicles} véhicule{u._count.vehicles > 1 ? "s" : ""}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${ROLE_CLASS[u.role]}`}>
                  {ROLE_LABELS[u.role]}
                </span>
                {u.id !== currentUser?.id && (
                  <button
                    className="text-sm text-danger hover:underline"
                    onClick={() => setConfirmDelete(u)}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          user={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
