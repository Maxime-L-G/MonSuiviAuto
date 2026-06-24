import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

type Maintenance = {
  date: string
  costCents: number
  type: string
}

const TYPE_LABELS: Record<string, string> = {
  OIL_CHANGE: "Vidange",
  TIRES: "Pneus",
  BRAKES: "Freins",
  BATTERY: "Batterie",
  INSPECTION: "Contrôle technique",
  REPAIR: "Réparation",
  OTHER: "Autre",
}

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Fév", "03": "Mar", "04": "Avr",
  "05": "Mai", "06": "Juin", "07": "Juil", "08": "Aoû",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Déc",
}

function fmt(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
}

export function VehicleStats({ vehicleId }: { vehicleId: string }) {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])

  useEffect(() => {
    apiFetch<{ maintenances: Maintenance[] }>(`/vehicles/${vehicleId}/maintenances`)
      .then((r) => setMaintenances(r.maintenances))
      .catch(() => {})
  }, [vehicleId])

  if (maintenances.length === 0) return null

  const totalCents = maintenances.reduce((sum, m) => sum + m.costCents, 0)

  const now = new Date()
  const monthlyMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthlyMap[key] = 0
  }
  for (const m of maintenances) {
    const d = new Date(m.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (key in monthlyMap) monthlyMap[key] += m.costCents
  }
  const chartData = Object.entries(monthlyMap).map(([month, costCents]) => ({
    name: MONTH_LABELS[month.split("-")[1]] ?? month,
    Dépenses: costCents / 100,
  }))

  const byType: Record<string, number> = {}
  for (const m of maintenances) {
    byType[m.type] = (byType[m.type] ?? 0) + m.costCents
  }
  const typeEntries = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const maxType = Math.max(...typeEntries.map(([, v]) => v), 1)

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-base font-semibold">Statistiques du véhicule</div>
          <div className="text-xs text-muted">Basé sur {maintenances.length} entretien{maintenances.length > 1 ? "s" : ""}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted uppercase tracking-wide">Total dépensé</div>
          <div className="text-xl font-bold text-primary">{fmt(totalCents)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-5">
        <div>
          <div className="text-sm font-medium mb-3">Dépenses par mois</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v} €`}
              />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(2)} €`, "Dépenses"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Bar dataKey="Dépenses" fill="#2563EB" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-sm font-medium mb-3">Par type</div>
          <div className="space-y-3">
            {typeEntries.map(([type, cents]) => (
              <div key={type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted">{TYPE_LABELS[type] ?? type}</span>
                  <span className="font-medium">{fmt(cents)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(cents / maxType) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
