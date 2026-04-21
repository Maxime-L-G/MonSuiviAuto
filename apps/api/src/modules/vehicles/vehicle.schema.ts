import { z } from "zod"

export const vehicleUsageSchema = z.enum(["PERSONAL", "PROFESSIONAL"])

export const createVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900),
  currentKm: z.number().int().min(0),
  usage: vehicleUsageSchema.optional(),
})

export const updateVehicleSchema = z.object({
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1900).optional(),
  currentKm: z.number().int().min(0).optional(),
  usage: vehicleUsageSchema.optional(),
})
