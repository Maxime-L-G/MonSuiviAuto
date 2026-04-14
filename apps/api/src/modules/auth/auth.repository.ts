import { prisma } from "../../config/prisma"

export async function dbFindUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function dbCreateUser(email: string, passwordHash: string) {
  return prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, role: true, createdAt: true },
  })
}

export async function dbFindUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, createdAt: true },
  })
}
