import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { apiFetch, setToken, setUser } from "../lib/api"

type LoginResponse = {
  token: string
  user: { id: string; email: string; role: "USER" | "PROFESSIONAL" | "ADMIN" }
}

export function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      setUser(data.user)
      nav("/app", { replace: true })
    } catch {
      setError("Email ou mot de passe incorrect.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(2,132,199,0.12),transparent_55%)]">
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
          className="mt-1 mb-4 input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm font-medium">Mot de passe</label>
        <input
          type="password"
          className="mt-1 mb-6 input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full btn-primary py-2" onClick={onSubmit} disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <p className="mt-4 text-center text-sm text-muted">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            S'inscrire
          </Link>
        </p>

        <p className="mt-2 text-center text-xs text-muted">
          <Link to="/legal" className="hover:underline">
            Mentions légales & confidentialité
          </Link>
        </p>
      </div>
    </div>
  )
}
