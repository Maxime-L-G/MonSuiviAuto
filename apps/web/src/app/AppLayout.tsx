import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { createPortal } from "react-dom"
import { apiFetch, clearToken, clearUser, getUser } from "../lib/api"

const navBase =
  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition hover:bg-white/10"
const navActive = "bg-white/10 text-white ring-1 ring-white/10"

const ROLE_LABELS: Record<string, string> = {
  USER: "Particulier",
  PROFESSIONAL: "Professionnel",
  ADMIN: "Administrateur",
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function Icon({ d }: { d: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

function DeleteAccountModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface2 shadow-xl p-5">
        <div className="text-base font-semibold">Supprimer mon compte</div>
        <p className="mt-2 text-sm text-muted">
          Cette action est définitive. Tous tes véhicules, entretiens, rappels et documents seront supprimés. Cette action est irréversible.
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

export function AppLayout() {
  const nav = useNavigate()
  const user = getUser()
  const isAdmin = user?.role === "ADMIN"
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleDeleteAccount() {
    await apiFetch("/auth/me", { method: "DELETE" })
    clearToken()
    clearUser()
    nav("/", { replace: true })
  }

  return (
    <div className="h-full bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(2,132,199,0.10),transparent_55%)]">
      <div className="h-full grid grid-cols-[280px_1fr]">
        <aside className="flex flex-col border-r border-border bg-slate-950/90 text-slate-100 backdrop-blur">

          {/* Logo */}
          <div className="px-6 py-5 border-b border-white/5">
            <div className="text-base font-semibold tracking-tight">MonSuiviAuto</div>
            <div className="text-xs text-slate-400 mt-0.5">Gestion & suivi automobile</div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <NavSection title="Général">
              <NavLink to="/app" end className={({ isActive }) => `${navBase} ${isActive ? navActive : "text-slate-300"}`}>
                <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                Dashboard
              </NavLink>
            </NavSection>

            <NavSection title="Mes véhicules">
              <NavLink to="/app/vehicles" end className={({ isActive }) => `${navBase} ${isActive ? navActive : "text-slate-300"}`}>
                <Icon d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM3 10h1l1-4h12l1 4h1M5 10h14" />
                Véhicules
              </NavLink>
              <NavLink to="/app/vehicles/archived" className={({ isActive }) => `${navBase} ${isActive ? navActive : "text-slate-300"}`}>
                <Icon d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                Véhicules archivés
              </NavLink>
            </NavSection>

            <NavSection title="Services">
              <NavLink to="/app/garages" className={({ isActive }) => `${navBase} ${isActive ? navActive : "text-slate-300"}`}>
                <Icon d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                Garages proches
              </NavLink>
            </NavSection>

            {isAdmin && (
              <NavSection title="Administration">
                <NavLink to="/app/admin" className={({ isActive }) => `${navBase} ${isActive ? navActive : "text-slate-300"}`}>
                  <Icon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  Utilisateurs
                </NavLink>
              </NavSection>
            )}
          </nav>

          {/* User + déconnexion + suppression */}
          <div className="px-4 py-4 border-t border-white/5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{user?.email}</div>
                <div className="text-xs text-slate-400">{ROLE_LABELS[user?.role ?? "USER"]}</div>
              </div>
              <button
                onClick={() => { clearToken(); clearUser(); nav("/", { replace: true }) }}
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
                title="Déconnexion"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-slate-500 hover:text-red-400 transition"
            >
              Supprimer mon compte
            </button>
          </div>
        </aside>

        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {confirmDelete && (
        <DeleteAccountModal
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  )
}
