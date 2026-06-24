import { Request, Response } from "express"
import * as service from "./admin.service"

export async function listUsers(req: Request, res: Response) {
  const users = await service.listUsers()
  return res.json({ users })
}

export async function deleteUser(req: Request, res: Response) {
  const adminId = req.user!.id
  const { id } = req.params

  if (id === adminId) {
    return res.status(400).json({ error: "CANNOT_DELETE_SELF" })
  }

  await service.deleteUser(adminId, id)
  return res.status(204).send()
}
