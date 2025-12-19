import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import { prisma } from "../../config/prisma"

export const dashboardRouter = Router()

dashboardRouter.get("/dashboard/summary", requireAuth, async (req, res) => {
  const userId = (req as any).user.id as string

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const vehiclesCount = await prisma.vehicle.count({ where: { userId } })

  const monthAgg = await prisma.maintenance.aggregate({
    where: { vehicle: { userId }, date: { gte: startOfMonth } },
    _sum: { costCents: true },
  })

  const yearAgg = await prisma.maintenance.aggregate({
    where: { vehicle: { userId }, date: { gte: startOfYear } },
    _sum: { costCents: true },
  })

  res.json({
    vehiclesCount,
    spendMonthCents: monthAgg._sum.costCents ?? 0,
    spendYearCents: yearAgg._sum.costCents ?? 0,
  })
})
