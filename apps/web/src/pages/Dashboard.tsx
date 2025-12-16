export function Dashboard() {
  return (
    <div className="grid gap-4">
      <Card>
        <div className="text-sm text-muted">Prochains rappels</div>
        <div className="mt-2 text-sm">Aucun rappel pour le moment.</div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Dépenses (mois)" value="0 €" />
        <StatCard title="Dépenses (année)" value="0 €" />
        <StatCard title="Véhicules" value="0" />
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
      {children}
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
      <div className="text-sm text-muted">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}
