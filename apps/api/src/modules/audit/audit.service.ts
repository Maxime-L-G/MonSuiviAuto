import { AuditLog } from "./audit.model"

type Action = "CREATE" | "UPDATE" | "DELETE"
type Entity = "VEHICLE" | "MAINTENANCE" | "REMINDER" | "DOCUMENT"

export async function logAudit(
  userId: string,
  action: Action,
  entity: Entity,
  entityId: string,
  details?: object
) {
  await AuditLog.create({ userId, action, entity, entityId, details })
}
