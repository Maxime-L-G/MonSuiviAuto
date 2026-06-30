import * as repo from "./notification.repository"
import { resend } from "../../config/resend"

const TYPE_LABELS: Record<string, string> = {
  INSPECTION: "Contrôle technique",
  INSURANCE: "Assurance",
  OIL_CHANGE: "Vidange",
  CUSTOM: "Rappel",
}

export async function sendUpcomingReminderEmails() {
  const now = new Date()
  const in3Days = new Date(now)
  in3Days.setDate(in3Days.getDate() + 3)

  const reminders = await repo.dbListRemindersDueSoon(now, in3Days)

  let sent = 0

  for (const reminder of reminders) {
    const to = reminder.vehicle.user.email
    const vehicleName = `${reminder.vehicle.make} ${reminder.vehicle.model}`
    const dueDate = reminder.dueDate?.toLocaleDateString("fr-FR")

    try {
      await resend.emails.send({
        from: "MonSuiviAuto <onboarding@resend.dev>",
        to,
        subject: `Rappel : ${TYPE_LABELS[reminder.type] ?? reminder.type} à venir pour ${vehicleName}`,
        html: `
          <p>Bonjour,</p>
          <p>Le rappel <strong>${reminder.title}</strong> pour votre véhicule <strong>${vehicleName}</strong> arrive à échéance le <strong>${dueDate}</strong>.</p>
          <p>Connectez-vous à MonSuiviAuto pour gérer ce rappel.</p>
        `,
      })

      await repo.dbMarkEmailSent(reminder.id)
      sent++
    } catch (e) {
      console.error(`Failed to send reminder email for ${reminder.id}:`, e)
    }
  }

  return { checked: reminders.length, sent }
}
