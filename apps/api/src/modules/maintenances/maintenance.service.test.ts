import * as repo from "./maintenance.repository"
import { dbCreateReminder } from "../reminders/reminder.repository"
import { logAudit } from "../audit/audit.service"
import { createMaintenance, updateMaintenance, deleteMaintenance } from "./maintenance.service"

jest.mock("./maintenance.repository")
jest.mock("../reminders/reminder.repository")
jest.mock("../audit/audit.service")

const mockedRepo = repo as jest.Mocked<typeof repo>
const mockedCreateReminder = dbCreateReminder as jest.Mock
const mockedLogAudit = logAudit as jest.Mock

describe("maintenance.service — createMaintenance", () => {
  const userId = "user-1"
  const vehicleId = "vehicle-1"

  beforeEach(() => {
    jest.clearAllMocks()
    mockedRepo.dbFindVehicleOwned.mockResolvedValue({ id: vehicleId } as never)
  })

  it("retourne null si le véhicule n'appartient pas à l'utilisateur", async () => {
    mockedRepo.dbFindVehicleOwned.mockResolvedValue(null)

    const result = await createMaintenance(userId, vehicleId, {
      title: "Vidange",
      type: "OIL_CHANGE",
      date: new Date("2026-01-01"),
      mileage: 50000,
    })

    expect(result).toBeNull()
    expect(mockedRepo.dbCreateMaintenance).not.toHaveBeenCalled()
  })

  it("génère un rappel automatique pour une vidange (OIL_CHANGE)", async () => {
    mockedRepo.dbCreateMaintenance.mockResolvedValue({
      id: "m-1",
      type: "OIL_CHANGE",
    } as never)

    await createMaintenance(userId, vehicleId, {
      title: "Vidange",
      type: "OIL_CHANGE",
      date: new Date("2026-01-01T00:00:00.000Z"),
      mileage: 50000,
    })

    expect(mockedCreateReminder).toHaveBeenCalledTimes(1)
    const [calledVehicleId, reminderData] = mockedCreateReminder.mock.calls[0]

    expect(calledVehicleId).toBe(vehicleId)
    expect(reminderData.type).toBe("OIL_CHANGE")
    expect(reminderData.dueMileage).toBe(60000)
    expect(reminderData.dueDate.toISOString().slice(0, 10)).toBe("2027-01-01")
  })

  it("ne génère aucun rappel pour une réparation (REPAIR)", async () => {
    mockedRepo.dbCreateMaintenance.mockResolvedValue({
      id: "m-2",
      type: "REPAIR",
    } as never)

    await createMaintenance(userId, vehicleId, {
      title: "Bas de caisse",
      type: "REPAIR",
      date: new Date("2026-01-01"),
      mileage: 50000,
    })

    expect(mockedCreateReminder).not.toHaveBeenCalled()
  })

  it("génère un rappel sans dueMileage pour un contrôle technique (pas de kmInterval)", async () => {
    mockedRepo.dbCreateMaintenance.mockResolvedValue({
      id: "m-3",
      type: "INSPECTION",
    } as never)

    await createMaintenance(userId, vehicleId, {
      title: "CT",
      type: "INSPECTION",
      date: new Date("2026-01-01T00:00:00.000Z"),
      mileage: 50000,
    })

    const [, reminderData] = mockedCreateReminder.mock.calls[0]
    expect(reminderData.dueMileage).toBeUndefined()
    expect(reminderData.dueDate.toISOString().slice(0, 10)).toBe("2028-01-01")
  })

  it("journalise l'action après création", async () => {
    mockedRepo.dbCreateMaintenance.mockResolvedValue({ id: "m-4", type: "OTHER" } as never)

    await createMaintenance(userId, vehicleId, {
      title: "Divers",
      date: new Date("2026-01-01"),
      mileage: 1000,
    })

    expect(mockedLogAudit).toHaveBeenCalledWith(userId, "CREATE", "MAINTENANCE", "m-4")
  })
})

describe("maintenance.service — updateMaintenance / deleteMaintenance", () => {
  const userId = "user-1"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("updateMaintenance retourne null si l'entretien n'existe pas ou n'appartient pas à l'utilisateur", async () => {
    mockedRepo.dbFindMaintenance.mockResolvedValue(null)

    const result = await updateMaintenance(userId, "m-404", { title: "X" })

    expect(result).toBeNull()
    expect(mockedRepo.dbUpdateMaintenance).not.toHaveBeenCalled()
  })

  it("deleteMaintenance journalise la suppression", async () => {
    mockedRepo.dbFindMaintenance.mockResolvedValue({ id: "m-1" } as never)

    const result = await deleteMaintenance(userId, "m-1")

    expect(result).toBe(true)
    expect(mockedRepo.dbDeleteMaintenance).toHaveBeenCalledWith("m-1")
    expect(mockedLogAudit).toHaveBeenCalledWith(userId, "DELETE", "MAINTENANCE", "m-1")
  })
})
