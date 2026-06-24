import request from "supertest"
import { createApp } from "../../app"
import { prisma } from "../../config/prisma"
import { cleanDb } from "../../test-utils/cleanDb"

const app = createApp()

async function registerAndLogin(email: string) {
  await request(app).post("/auth/register").send({ email, password: "password123" })
  const res = await request(app).post("/auth/login").send({ email, password: "password123" })
  return res.body.token as string
}

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  await cleanDb()
  await prisma.$disconnect()
})

describe("POST /vehicles", () => {
  it("crée un véhicule pour l'utilisateur authentifié", async () => {
    const token = await registerAndLogin("owner@test.com")

    const res = await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Peugeot", model: "208", year: 2020, currentKm: 30000 })

    expect(res.status).toBe(201)
    expect(res.body.vehicle).toMatchObject({ make: "Peugeot", model: "208" })
  })

  it("rejette la création sans authentification", async () => {
    const res = await request(app)
      .post("/vehicles")
      .send({ make: "Peugeot", model: "208", year: 2020, currentKm: 30000 })

    expect(res.status).toBe(401)
  })
})

describe("Isolation des données entre utilisateurs", () => {
  it("un utilisateur ne voit pas les véhicules d'un autre utilisateur", async () => {
    const tokenA = await registerAndLogin("userA@test.com")
    const tokenB = await registerAndLogin("userB@test.com")

    await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ make: "Renault", model: "Clio", year: 2019, currentKm: 50000 })

    const resB = await request(app)
      .get("/vehicles")
      .set("Authorization", `Bearer ${tokenB}`)

    expect(resB.status).toBe(200)
    expect(resB.body.vehicles).toHaveLength(0)
  })

  it("un utilisateur ne peut pas modifier le véhicule d'un autre utilisateur", async () => {
    const tokenA = await registerAndLogin("userC@test.com")
    const tokenB = await registerAndLogin("userD@test.com")

    const createRes = await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ make: "Citroën", model: "C3", year: 2021, currentKm: 10000 })

    const vehicleId = createRes.body.vehicle.id

    const res = await request(app)
      .patch(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ currentKm: 99999 })

    expect(res.status).toBe(404)
  })
})

describe("PATCH /vehicles/:id/archive", () => {
  it("archive un véhicule et le retire de la liste active", async () => {
    const token = await registerAndLogin("archiver@test.com")

    const createRes = await request(app)
      .post("/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota", model: "Yaris", year: 2018, currentKm: 80000 })

    const vehicleId = createRes.body.vehicle.id

    const archiveRes = await request(app)
      .patch(`/vehicles/${vehicleId}/archive`)
      .set("Authorization", `Bearer ${token}`)

    expect(archiveRes.status).toBe(204)

    const listRes = await request(app)
      .get("/vehicles")
      .set("Authorization", `Bearer ${token}`)

    expect(listRes.body.vehicles).toHaveLength(0)

    const archivedRes = await request(app)
      .get("/vehicles/archived")
      .set("Authorization", `Bearer ${token}`)

    expect(archivedRes.body.vehicles).toHaveLength(1)
  })
})
