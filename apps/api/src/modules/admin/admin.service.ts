import * as repo from "./admin.repository"
import { deleteAccount } from "../auth/auth.service"
import { logAudit } from "../audit/audit.service"

export async function listUsers() {
  return repo.dbListUsers()
}

export async function deleteUser(adminId: string, targetUserId: string) {
  await deleteAccount(targetUserId)
  await logAudit(adminId, "DELETE", "USER", targetUserId)
}
