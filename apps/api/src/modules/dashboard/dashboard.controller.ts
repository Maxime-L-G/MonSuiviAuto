import { Request, Response } from "express"
import * as service from "./dashboard.service"

export async function getSummary(req: Request, res: Response) {
  const userId = req.user!.id
  const summary = await service.getDashboardSummary(userId)
  return res.json(summary)
}
