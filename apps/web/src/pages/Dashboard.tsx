import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"

type Summary = {
  vehiclesCount: number
  spendMonthCents: number
  spendYearCents: number
}

export function Dashboard() {
  const [data, setData] = useState<Summary | null>(null)

  useEffect(() => {
    apiFetch<Summary>("/dashboard/summary").then(setData).catch(() => setData(null))
  }, [])

  const month = data ? (data.spendMonthCents / 100).toFixed(2) : "…"
  const year = data ? (data.spendYearCents / 100).toFixed(2) : "…"
  const vehicles = data ? String(data.vehiclesCount) : "…"

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-surface/80 backdrop-blur p-5 border border-border shadow-sm">
        <div className="text-sm text-muted">Prochains rappels</div>
        <div className="mt-2 text-sm text-muted">
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Dépenses (mois)" value={`${month} €`} />
        <StatCard title="Dépenses (année)" value={`${year} €`} />
        <StatCard title="Véhicules" value={vehicles} />
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface/80 backdrop-blur p-5 border border-border shadow-sm">
      <div className="text-sm text-muted">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}
