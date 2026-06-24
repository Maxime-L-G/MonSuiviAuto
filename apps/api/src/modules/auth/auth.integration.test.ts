import request from "supertest"
import { createApp } from "../../app"
import { prisma } from "../../config/prisma"
import { cleanDb } from "../../test-utils/cleanDb"

const app = createApp()

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  await cleanDb()
  await prisma.$disconnect()
})

describe("POST /auth/register", () => {
  it("crée un compte avec succès", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "alice@test.com",
      password: "password123",
    })

    expect(res.status).toBe(201)
    expect(res.body.user).toMatchObject({ email: "alice@test.com", role: "USER" })
    expect(res.body.user.passwordHash).toBeUndefined()
  })

  it("rejette un email déjà utilisé", async () => {
    await request(app).post("/auth/register").send({
      email: "bob@test.com",
      password: "password123",
    })

    const res = await request(app).post("/auth/register").send({
      email: "bob@test.com",
      password: "anotherpassword",
    })

    expect(res.status).toBe(409)
    expect(res.body.error).toBe("EMAIL_ALREADY_USED")
  })

  it("rejette un mot de passe trop court", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "short@test.com",
      password: "123",
    })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe("VALIDATION_ERROR")
  })
})

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/auth/register").send({
      email: "carol@test.com",
      password: "password123",
    })
  })

  it("connecte un utilisateur avec les bons identifiants", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "carol@test.com",
      password: "password123",
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe("carol@test.com")
  })

  it("rejette un mauvais mot de passe", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "carol@test.com",
      password: "wrong-password",
    })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe("INVALID_CREDENTIALS")
  })
})

describe("GET /auth/me", () => {
  it("retourne 401 sans token", async () => {
    const res = await request(app).get("/auth/me")
    expect(res.status).toBe(401)
  })

  it("retourne le profil avec un token valide", async () => {
    await request(app).post("/auth/register").send({
      email: "dave@test.com",
      password: "password123",
    })
    const loginRes = await request(app).post("/auth/login").send({
      email: "dave@test.com",
      password: "password123",
    })

    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${loginRes.body.token}`)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe("dave@test.com")
  })
})
