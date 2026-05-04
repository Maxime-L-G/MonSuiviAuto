import { Request, Response } from "express"
import * as service from "./admin.service"

export async function listUsers(req: Request, res: Response) {
  const users = await service.listUsers()
  return res.json({ users })
}
