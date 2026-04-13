import { z } from "zod"

export const reminderTypeSchema = z.enum([
  "INSPECTION",
  "INSURANCE",
  "OIL_CHANGE",
  "CUSTOM",
])

export const createReminderSchema = z.object({
  type: reminderTypeSchema.optional(),
  title: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  dueMileage: z.number().int().min(0).optional(),
  notes: z.string().max(5000).optional(),
}).refine((v) => v.dueDate || v.dueMileage, {
  message: "Provide dueDate or dueMileage",
})

export const updateReminderSchema = z.object({
  status: z.enum(["OPEN", "DONE"]).optional(),
  title: z.string().min(1).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  dueMileage: z.number().int().min(0).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
})
