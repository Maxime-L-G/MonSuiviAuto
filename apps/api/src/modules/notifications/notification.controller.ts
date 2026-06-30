import { Request, Response } from "express"
import * as service from "./notification.service"

export async function checkReminders(req: Request, res: Response) {
  const secret = req.headers["x-cron-secret"]

  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "UNAUTHORIZED" })
  }

  const result = await service.sendUpcomingReminderEmails()
  return res.json(result)
}
