import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as repo from "./auth.repository"
import { register, login } from "./auth.service"

jest.mock("./auth.repository")
jest.mock("bcrypt")
jest.mock("jsonwebtoken")

const mockedRepo = repo as jest.Mocked<typeof repo>
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const mockedJwt = jwt as jest.Mocked<typeof jwt>

describe("auth.service — register", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = "test-secret"
  })

  it("rejette l'inscription si l'email existe déjà", async () => {
    mockedRepo.dbFindUserByEmail.mockResolvedValue({ id: "u-1" } as never)

    await expect(register("test@test.com", "password123")).rejects.toThrow("EMAIL_ALREADY_USED")
    expect(mockedRepo.dbCreateUser).not.toHaveBeenCalled()
  })

  it("hash le mot de passe avant de créer l'utilisateur", async () => {
    mockedRepo.dbFindUserByEmail.mockResolvedValue(null)
    mockedBcrypt.hash.mockResolvedValue("hashed-password" as never)
    mockedRepo.dbCreateUser.mockResolvedValue({ id: "u-1", email: "test@test.com", role: "USER" } as never)

    await register("test@test.com", "password123")

    expect(mockedBcrypt.hash).toHaveBeenCalledWith("password123", 10)
    expect(mockedRepo.dbCreateUser).toHaveBeenCalledWith("test@test.com", "hashed-password", "USER")
  })
})

describe("auth.service — login", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = "test-secret"
  })

  it("rejette la connexion si l'utilisateur n'existe pas", async () => {
    mockedRepo.dbFindUserByEmail.mockResolvedValue(null)

    await expect(login("inconnu@test.com", "password")).rejects.toThrow("INVALID_CREDENTIALS")
  })

  it("rejette la connexion si le mot de passe est incorrect", async () => {
    mockedRepo.dbFindUserByEmail.mockResolvedValue({
      id: "u-1",
      email: "test@test.com",
      passwordHash: "hashed",
      role: "USER",
    } as never)
    mockedBcrypt.compare.mockResolvedValue(false as never)

    await expect(login("test@test.com", "wrong-password")).rejects.toThrow("INVALID_CREDENTIALS")
  })

  it("retourne un token et le user si les identifiants sont valides", async () => {
    mockedRepo.dbFindUserByEmail.mockResolvedValue({
      id: "u-1",
      email: "test@test.com",
      passwordHash: "hashed",
      role: "USER",
    } as never)
    mockedBcrypt.compare.mockResolvedValue(true as never)
    mockedJwt.sign.mockReturnValue("fake-jwt-token" as never)

    const result = await login("test@test.com", "correct-password")

    expect(result.token).toBe("fake-jwt-token")
    expect(result.user).toEqual({ id: "u-1", email: "test@test.com", role: "USER" })
    expect(mockedJwt.sign).toHaveBeenCalledWith(
      { sub: "u-1", role: "USER" },
      "test-secret",
      expect.objectContaining({ expiresIn: expect.anything() })
    )
  })
})
