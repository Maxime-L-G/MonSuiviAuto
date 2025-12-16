import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"

type AuthUser = {
  id: string
  role: string
}

function getJwtSecret(): Secret {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET is missing")
  return secret as Secret
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "UNAUTHORIZED" })
  }

  const token = header.substring("Bearer ".length)

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload

    const userId = decoded.sub
    const role = decoded.role

    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ error: "UNAUTHORIZED" })
    }

    ;(req as any).user = { id: userId, role } satisfies AuthUser

    return next()
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" })
  }
}
