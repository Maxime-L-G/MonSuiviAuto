import multer from "multer"
import path from "path"
import { randomUUID } from "crypto"

const UPLOAD_DIR = path.join(__dirname, "../../uploads")

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"]

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${randomUUID()}${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error("UNSUPPORTED_FILE_TYPE"))
    }
    cb(null, true)
  },
})

export { UPLOAD_DIR }
