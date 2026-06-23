import { Request, Response } from "express"
import { loginSchema, registerSchema } from "./auth.schema"
import * as service from "./auth.service"

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })
  }

  try {
    const user = await service.register(parsed.data.email, parsed.data.password, parsed.data.role)
    return res.status(201).json({ user })
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "EMAIL_ALREADY_USED") {
      return res.status(409).json({ error: "EMAIL_ALREADY_USED" })
    }
    return res.status(500).json({ error: "SERVER_ERROR" })
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })
  }

  try {
    const result = await service.login(parsed.data.email, parsed.data.password)
    return res.json(result)
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "INVALID_CREDENTIALS" })
    }
    return res.status(500).json({ error: "SERVER_ERROR" })
  }
}

export async function getMe(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" })

  const user = await service.getMe(userId)
  if (!user) return res.status(401).json({ error: "UNAUTHORIZED" })

  return res.json({ user })
}

export async function deleteAccount(req: Request, res: Response) {
  const userId = req.user!.id
  await service.deleteAccount(userId)
  return res.status(204).send()
}
