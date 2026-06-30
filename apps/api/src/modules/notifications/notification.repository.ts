import { prisma } from "../../config/prisma"

export async function dbListRemindersDueSoon(from: Date, to: Date) {
  return prisma.reminder.findMany({
    where: {
      status: "OPEN",
      dueDate: { gte: from, lte: to },
      emailSentAt: null,
    },
    include: {
      vehicle: {
        select: {
          make: true,
          model: true,
          user: { select: { email: true } },
        },
      },
    },
  })
}

export async function dbMarkEmailSent(reminderId: string) {
  return prisma.reminder.update({
    where: { id: reminderId },
    data: { emailSentAt: new Date() },
  })
}
