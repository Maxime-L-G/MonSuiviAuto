import * as repo from "./admin.repository"

export async function listUsers() {
  return repo.dbListUsers()
}
