import { Request, Response } from "express"
import { prisma } from "../../config/prisma"

export async function me(req: Request, res: Response) {
  const userId = req.user?.id
  if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, createdAt: true },
  })

  if (!user) return res.status(401).json({ error: "UNAUTHORIZED" })

  return res.json({ user })
}
