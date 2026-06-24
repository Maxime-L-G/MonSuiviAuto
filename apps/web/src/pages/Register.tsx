import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { apiFetch } from "../lib/api"

type RegisterResponse = {
  user: { id: string; email: string; role: "USER" | "PROFESSIONAL" | "ADMIN" }
}

export function Register() {
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"USER" | "PROFESSIONAL">("USER")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit() {
    setError(null)
    setLoading(true)
    try {
      await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      })
      nav("/", { replace: true })
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes("409")) {
        setError("Un compte avec cet email existe déjà.")
      } else {
        setError("Une erreur est survenue. Vérifie tes informations.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(2,132,199,0.12),transparent_55%)]">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface/80 backdrop-blur p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="mt-3 text-2xl font-semibold">Créer un compte</h1>
          <p className="text-sm text-muted">Inscris-toi pour commencer à suivre tes véhicules.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-border bg-white/70 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <label className="text-sm font-medium">Email</label>
        <input
          className="mt-1 mb-4 input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm font-medium">Mot de passe</label>
        <input
          type="password"
          className="mt-1 mb-4 input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="text-sm font-medium">Type de compte</label>
        <div className="mt-1 mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("USER")}
            className={`rounded-xl border p-3 text-left transition ${
              role === "USER"
                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                : "border-border bg-white hover:bg-slate-50"
            }`}
          >
            <div className="text-sm font-medium">Particulier</div>
            <div className="text-xs text-muted mt-0.5">Usage personnel</div>
          </button>

          <button
            type="button"
            onClick={() => setRole("PROFESSIONAL")}
            className={`rounded-xl border p-3 text-left transition ${
              role === "PROFESSIONAL"
                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                : "border-border bg-white hover:bg-slate-50"
            }`}
          >
            <div className="text-sm font-medium">Professionnel</div>
            <div className="text-xs text-muted mt-0.5">Flotte ou garage</div>
          </button>
        </div>

        <button className="w-full btn-primary py-2" onClick={onSubmit} disabled={loading}>
          {loading ? "Inscription…" : "Créer mon compte"}
        </button>

        <p className="mt-4 text-center text-sm text-muted">
          Déjà un compte ?{" "}
          <Link to="/" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
