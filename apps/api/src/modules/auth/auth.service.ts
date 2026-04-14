import bcrypt from "bcrypt"
import jwt, { SignOptions, Secret } from "jsonwebtoken"
import * as repo from "./auth.repository"

function getJwtSecret(): Secret {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET is missing")
  return secret as Secret
}

export async function register(email: string, password: string) {
  const existing = await repo.dbFindUserByEmail(email)
  if (existing) throw new Error("EMAIL_ALREADY_USED")

  const passwordHash = await bcrypt.hash(password, 10)
  return repo.dbCreateUser(email, passwordHash)
}

export async function login(email: string, password: string) {
  const user = await repo.dbFindUserByEmail(email)
  if (!user) throw new Error("INVALID_CREDENTIALS")

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) throw new Error("INVALID_CREDENTIALS")

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"],
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, getJwtSecret(), options)

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  }
}

export async function getMe(id: string) {
  return repo.dbFindUserById(id)
}
