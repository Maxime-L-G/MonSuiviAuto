import { Request, Response } from "express"
import { loginSchema, registerSchema } from "./auth.schema"
import * as authService from "./auth.service"

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })

  try {
    const user = await authService.register(parsed.data.email, parsed.data.password)
    return res.status(201).json({ user })
  } catch (e: any) {
    if (e?.message === "EMAIL_ALREADY_USED") return res.status(409).json({ error: "EMAIL_ALREADY_USED" })
    return res.status(500).json({ error: "SERVER_ERROR" })
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })

  try {
    const result = await authService.login(parsed.data.email, parsed.data.password)
    return res.json(result)
  } catch (e: any) {
    if (e?.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "INVALID_CREDENTIALS" })
    return res.status(500).json({ error: "SERVER_ERROR" })
  }
}
