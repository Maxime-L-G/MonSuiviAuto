import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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

type MonthlyEntry = { month: string; costCents: number }
type SpendingByType = { type: string; costCents: number }
type UpcomingReminder = {
  id: string
  title: string
  dueDate: string | null
  vehicle: { id: string; make: string; model: string }
}

type DashboardData = {
  vehiclesCount: number
  maintenancesCount: number
  spendMonthCents: number
  spendYearCents: number
  upcomingReminders: UpcomingReminder[]
  monthlyCosts: MonthlyEntry[]
  spendingByType: SpendingByType[]
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

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    apiFetch<DashboardData>("/dashboard/summary").then(setData).catch(() => {})
  }, [])

  const chartData = (data?.monthlyCosts ?? []).map((m) => ({
    name: MONTH_LABELS[m.month.split("-")[1]] ?? m.month,
    Dépenses: m.costCents / 100,
  }))

  const maxSpend = Math.max(...(data?.spendingByType ?? []).map((s) => s.costCents), 1)

  return (
    <div className="space-y-5">

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Véhicules actifs", value: data?.vehiclesCount ?? "…", border: "border-l-blue-500" },
          { label: "Entretiens effectués", value: data?.maintenancesCount ?? "…", border: "border-l-violet-500" },
          { label: "Dépenses ce mois", value: data ? fmt(data.spendMonthCents) : "…", border: "border-l-emerald-500" },
          { label: "Dépenses cette année", value: data ? fmt(data.spendYearCents) : "…", border: "border-l-amber-500" },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border border-border border-l-4 ${card.border} bg-surface/80 backdrop-blur p-5 shadow-sm`}
          >
            <div className="text-xs text-muted uppercase tracking-wide">{card.label}</div>
            <div className="mt-2 text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Chart + Répartition */}
      <div className="grid grid-cols-[1fr_300px] gap-4">

        {/* Bar chart */}
        <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
          <div className="mb-4">
            <div className="text-base font-semibold">Évolution des dépenses</div>
            <div className="text-xs text-muted">6 derniers mois</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v} €`}
              />
              <Tooltip
                formatter={(v: number) => [`${v.toFixed(2)} €`, "Dépenses"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 13 }}
              />
              <Bar dataKey="Dépenses" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par catégorie */}
        <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
          <div className="mb-4">
            <div className="text-base font-semibold">Par catégorie</div>
            <div className="text-xs text-muted">Top dépenses</div>
          </div>

          {!data || data.spendingByType.length === 0 ? (
            <div className="text-sm text-muted">Aucune donnée.</div>
          ) : (
            <div className="space-y-3">
              {data.spendingByType.map((s) => (
                <div key={s.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{TYPE_LABELS[s.type] ?? s.type}</span>
                    <span className="font-medium">{fmt(s.costCents)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(s.costCents / maxSpend) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rappels à venir */}
      <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
        <div className="mb-4">
          <div className="text-base font-semibold">Rappels à venir</div>
          <div className="text-xs text-muted">Dans les 30 prochains jours</div>
        </div>

        {!data || data.upcomingReminders.length === 0 ? (
          <div className="text-sm text-muted">Aucun rappel à venir.</div>
        ) : (
          <div className="grid gap-2">
            {data.upcomingReminders.map((r) => {
              const days = r.dueDate ? daysUntil(r.dueDate) : null
              const urgent = days !== null && days <= 7
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-white/70 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${urgent ? "bg-red-500" : "bg-amber-400"}`} />
                    <div>
                      <div className="text-sm font-medium">{r.title}</div>
                      <Link
                        to={`/app/vehicles/${r.vehicle.id}`}
                        className="text-xs text-muted hover:underline"
                      >
                        {r.vehicle.make} {r.vehicle.model}
                      </Link>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {r.dueDate ? new Date(r.dueDate).toLocaleDateString("fr-FR") : "-"}
                    </div>
                    {days !== null && (
                      <div className={`text-xs ${urgent ? "text-red-500" : "text-muted"}`}>
                        {days === 0 ? "Aujourd'hui" : `Dans ${days} j`}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
