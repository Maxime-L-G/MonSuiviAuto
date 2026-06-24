import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { cloudinary } from "./cloudinary"

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"]

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "monsuiviauto",
    resource_type: "auto",
  } as never,
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
