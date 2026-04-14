import * as repo from "./dashboard.repository"

export async function getDashboardSummary(userId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const in30Days = new Date(now)
  in30Days.setDate(now.getDate() + 30)

  const [vehiclesCount, spendMonthCents, spendYearCents, upcomingReminders] =
    await Promise.all([
      repo.dbCountVehicles(userId),
      repo.dbSumMaintenanceCosts(userId, startOfMonth),
      repo.dbSumMaintenanceCosts(userId, startOfYear),
      repo.dbListUpcomingReminders(userId, now, in30Days),
    ])

  return { vehiclesCount, spendMonthCents, spendYearCents, upcomingReminders }
}
