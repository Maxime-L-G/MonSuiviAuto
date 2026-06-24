import { Schema, model } from "mongoose"

const auditSchema = new Schema({
  userId:   { type: String, required: true },
  action:   { type: String, enum: ["CREATE", "UPDATE", "DELETE"], required: true },
  entity:   { type: String, enum: ["VEHICLE", "MAINTENANCE", "REMINDER", "DOCUMENT", "USER"], required: true },
  entityId: { type: String, required: true },
  details:  { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
})

export const AuditLog = model("AuditLog", auditSchema)
