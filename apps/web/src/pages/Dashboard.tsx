import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"
import { Link } from "react-router-dom"

type Summary = {
  vehiclesCount: number
  spendMonthCents: number
  spendYearCents: number
}

type UpcomingReminder = {
  id: string
  title: string
  dueDate: string | null
  vehicle: { id: string; make: string; model: string }
}

export function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [reminders, setReminders] = useState<UpcomingReminder[]>([])

  useEffect(() => {
    apiFetch<Summary>("/dashboard/summary").then(setSummary).catch(() => setSummary(null))
    apiFetch<{ reminders: UpcomingReminder[] }>("/reminders/upcoming")
      .then((r) => setReminders(r.reminders))
      .catch(() => setReminders([]))
  }, [])

  const month = summary ? (summary.spendMonthCents / 100).toFixed(2) : "…"
  const year = summary ? (summary.spendYearCents / 100).toFixed(2) : "…"
  const vehicles = summary ? String(summary.vehiclesCount) : "…"

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl bg-surface/80 backdrop-blur p-5 border border-border shadow-sm">
        <div className="text-sm text-muted">Prochains rappels (30 jours)</div>

        <div className="mt-3 grid gap-2">
          {reminders.length === 0 ? (
            <div className="text-sm text-muted">Aucun rappel à venir.</div>
          ) : (
            reminders.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-border bg-white/70 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.title}</div>

                  <div className="text-sm text-muted">
                    <Link
                      to={`/app/vehicles/${r.vehicle.id}`}
                      className="hover:underline"
                    >
                      {r.vehicle.make} {r.vehicle.model}
                    </Link>
                  </div>
                </div>

                <div className="text-sm text-muted">
                  {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "-"}
                </div>
              </div>
            ))
          )}
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
