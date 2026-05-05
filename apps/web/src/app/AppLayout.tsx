import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { clearToken, clearUser, getUser } from "../lib/api"

const navBase =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-white/10"
const navActive = "bg-white/10 text-white ring-1 ring-white/10"

export function AppLayout() {
  const nav = useNavigate()
  const isAdmin = getUser()?.role === "ADMIN"

  return (
    <div className="h-full bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(2,132,199,0.10),transparent_55%)]">
      <div className="h-full grid grid-cols-[280px_1fr]">
        <aside className="p-4 border-r border-border bg-slate-950/90 text-slate-100 backdrop-blur">
          <div className="mb-6 px-2">
            <div className="text-lg font-semibold tracking-tight">MonSuiviAuto</div>
            <div className="text-sm text-slate-300">Gestion & suivi automobile</div>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/app"
              end
              className={({ isActive }) =>
                `${navBase} ${isActive ? navActive : "text-slate-200"}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/app/vehicles"
              end
              className={({ isActive }) =>
                `${navBase} ${isActive ? navActive : "text-slate-200"}`
              }
            >
              Véhicules
            </NavLink>

            <NavLink
              to="/app/vehicles/archived"
              className={({ isActive }) =>
                `${navBase} ${isActive ? navActive : "text-slate-200"}`
              }
            >
              Véhicules archivés
            </NavLink>

            <NavLink
              to="/app/garages"
              className={({ isActive }) =>
                `${navBase} ${isActive ? navActive : "text-slate-200"}`
              }
            >
              Garages proches
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/app/admin"
                className={({ isActive }) =>
                  `${navBase} ${isActive ? navActive : "text-slate-200"}`
                }
              >
                Administration
              </NavLink>
            )}
          </nav>
        </aside>

        <main className="p-6">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">MonSuiviAuto</h1>
              <p className="text-sm text-muted">
                Suivi entretien, dépenses, rappels.
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                clearToken()
                clearUser()
                nav("/", { replace: true })
              }}
            >
              Déconnexion
            </button>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  )
}
