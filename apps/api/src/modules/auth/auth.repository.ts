import { prisma } from "../../config/prisma"
import { Role } from "@prisma/client"

export async function dbFindUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function dbCreateUser(email: string, passwordHash: string, role: Role = "USER") {
  return prisma.user.create({
    data: { email, passwordHash, role },
    select: { id: true, email: true, role: true, createdAt: true },
  })
}

export async function dbFindUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, createdAt: true },
  })
}

export async function dbListDocumentFilenames(userId: string) {
  return prisma.document.findMany({
    where: { vehicle: { userId } },
    select: { filename: true },
  })
}

export async function dbDeleteUser(id: string) {
  return prisma.user.delete({ where: { id } })
}
