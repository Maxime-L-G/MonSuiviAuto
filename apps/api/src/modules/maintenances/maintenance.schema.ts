import { z } from "zod"

export const maintenanceTypeSchema = z.enum([
  "OIL_CHANGE",
  "TIRES",
  "BRAKES",
  "BATTERY",
  "INSPECTION",
  "REPAIR",
  "OTHER",
])

export const createMaintenanceSchema = z.object({
  type: maintenanceTypeSchema.optional(),
  title: z.string().min(1),
  date: z.string().datetime(),
  mileage: z.number().int().min(0),
  costCents: z.number().int().min(0).optional(),
  notes: z.string().max(5000).optional(),
})
