import { z } from "zod"

export const createVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900),
  currentKm: z.number().int().min(0),
})
