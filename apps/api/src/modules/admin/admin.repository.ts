import { prisma } from "../../config/prisma"

export async function dbListUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { vehicles: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}
