export function Vehicles() {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Véhicules</div>
          <div className="text-sm text-muted">Liste de tes véhicules</div>
        </div>

        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
          Ajouter
        </button>
      </div>

      <div className="mt-4 text-sm text-muted">
      </div>
    </div>
  )
}
