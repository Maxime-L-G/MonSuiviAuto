import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiFetch, setToken } from "../lib/api"

type LoginResponse = {
  token: string
  user: { id: string; email: string; role: string }
}

export function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState("test@test.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit() {
    setError(null)
    setLoading(true)
    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      setToken(data.token)
      nav("/app", { replace: true })
    } catch {
      setError("Email ou mot de passe incorrect.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(2,132,199,0.12),_transparent_55%)]">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface/80 backdrop-blur p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="mt-3 text-2xl font-semibold">Connexion</h1>
          <p className="text-sm text-muted">Connecte-toi pour gérer tes véhicules.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-border bg-white/70 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <label className="text-sm font-medium">Email</label>
        <input
          className="mt-1 mb-4 w-full rounded-xl border border-border bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm font-medium">Mot de passe</label>
        <input
          type="password"
          className="mt-1 mb-6 w-full rounded-xl border border-border bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full rounded-xl bg-primary px-3 py-2 text-white font-medium shadow-sm hover:opacity-95 disabled:opacity-60"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </div>
  )
}
