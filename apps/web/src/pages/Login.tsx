import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState("test@test.com")
  const [password, setPassword] = useState("password123")

  return (
    <div className="h-full flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(2,132,199,0.12),transparent_55%)]">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface/80 backdrop-blur p-6 shadow-sm">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-100">
            MonSuiviAuto
            <span className="opacity-70">•</span>
            <span className="opacity-80">Premium garage</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold">Connexion</h1>
          <p className="text-sm text-muted">
            Connecte-toi pour gérer tes véhicules et ton entretien.
          </p>
        </div>

        <label className="text-sm font-medium">Email</label>
        <input
          className="mt-1 mb-4 w-full rounded-xl border border-border bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="toi@email.com"
        />

        <label className="text-sm font-medium">Mot de passe</label>
        <input
          type="password"
          className="mt-1 mb-6 w-full rounded-xl border border-border bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button
          className="w-full rounded-xl bg-primary px-3 py-2 text-white font-medium shadow-sm hover:opacity-95"
          onClick={() => nav("/app")}
        >
          Se connecter
        </button>

        <div className="mt-4 text-xs text-muted">
        </div>
      </div>
    </div>
  )
}
