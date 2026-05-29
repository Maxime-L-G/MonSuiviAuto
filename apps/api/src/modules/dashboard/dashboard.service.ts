import * as repo from "./dashboard.repository"

export async function getDashboardSummary(userId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const in30Days = new Date(now)
  in30Days.setDate(now.getDate() + 30)

  const sixMonthsAgo = new Date(now)
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const [
    vehiclesCount,
    maintenancesCount,
    spendMonthCents,
    spendYearCents,
    upcomingReminders,
    rawMaintenances,
    costByType,
  ] = await Promise.all([
    repo.dbCountVehicles(userId),
    repo.dbCountMaintenances(userId),
    repo.dbSumMaintenanceCosts(userId, startOfMonth),
    repo.dbSumMaintenanceCosts(userId, startOfYear),
    repo.dbListUpcomingReminders(userId, now, in30Days),
    repo.dbMaintenancesForPeriod(userId, sixMonthsAgo),
    repo.dbCostByType(userId),
  ])

  const monthlyMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthlyMap[key] = 0
  }
  for (const m of rawMaintenances) {
    const d = new Date(m.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (key in monthlyMap) monthlyMap[key] += m.costCents
  }
  const monthlyCosts = Object.entries(monthlyMap).map(([month, costCents]) => ({
    month,
    costCents,
  }))

  const spendingByType = costByType.map((r) => ({
    type: r.type,
    costCents: r._sum.costCents ?? 0,
  }))

  return {
    vehiclesCount,
    maintenancesCount,
    spendMonthCents,
    spendYearCents,
    upcomingReminders,
    monthlyCosts,
    spendingByType,
  }
}
