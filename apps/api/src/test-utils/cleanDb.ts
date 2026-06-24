import { prisma } from "../config/prisma"

export async function cleanDb() {
  await prisma.document.deleteMany()
  await prisma.reminder.deleteMany()
  await prisma.maintenance.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()
}
