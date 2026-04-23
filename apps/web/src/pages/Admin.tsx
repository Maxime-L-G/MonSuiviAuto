import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"

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

export function Admin() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiFetch<{ users: User[] }>("/admin/users")
      .then((res) => setUsers(res.users))
      .catch(() => setError("Impossible de charger les utilisateurs."))
      .finally(() => setLoading(false))
  }, [])

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
              className="rounded-xl border border-border bg-white p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{u.email}</div>
                <div className="mt-1 text-sm text-muted">
                  Inscrit le {new Date(u.createdAt).toLocaleDateString()} ·{" "}
                  {u._count.vehicles} véhicule{u._count.vehicles > 1 ? "s" : ""}
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${ROLE_CLASS[u.role]}`}>
                {ROLE_LABELS[u.role]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
