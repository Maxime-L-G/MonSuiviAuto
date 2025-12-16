import bcrypt from "bcrypt"
import jwt, { SignOptions, Secret } from "jsonwebtoken"
import { prisma } from "../../config/prisma"


function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET is missing")
  return secret
}

export async function register(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error("EMAIL_ALREADY_USED")

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, role: true, createdAt: true },
  })

  return user
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error("INVALID_CREDENTIALS")

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw new Error("INVALID_CREDENTIALS")

  const secret: Secret = getJwtSecret() as Secret

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"],
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role },
    secret,
    options
  )

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  }
}
