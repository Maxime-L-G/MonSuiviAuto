import { useCallback, useEffect, useRef, useState } from "react"
import { apiFetch, getToken } from "../lib/api"

type Document = {
  id: string
  originalName: string
  mimeType: string
  sizeBytes: number
  createdAt: string
}

const API_URL = import.meta.env.VITE_API_URL as string

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export function DocumentList({ vehicleId }: { vehicleId: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await apiFetch<{ documents: Document[] }>(`/vehicles/${vehicleId}/documents`)
    setDocuments(res.documents)
  }, [vehicleId])

  useEffect(() => {
    void load()
  }, [load])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const token = getToken()
      const res = await fetch(`${API_URL}/vehicles/${vehicleId}/documents`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      })

      if (!res.ok) throw new Error("UPLOAD_FAILED")
      await load()
    } catch {
      setError("Erreur lors de l'envoi du fichier (PDF, JPG, PNG ou WEBP, 10 Mo max).")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleDelete(id: string) {
    await apiFetch(`/documents/${id}`, { method: "DELETE" })
    await load()
  }

  function handleDownload(doc: Document) {
    const token = getToken()
    fetch(`${API_URL}/documents/${doc.id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = doc.originalName
        a.click()
        URL.revokeObjectURL(url)
      })
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Documents</h2>
          <p className="text-xs text-muted">Factures, carte grise, assurance…</p>
        </div>
        <label className="btn-primary cursor-pointer">
          {uploading ? "Envoi…" : "Ajouter"}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {documents.length === 0 && (
        <p className="text-sm text-muted">Aucun document ajouté.</p>
      )}

      <ul className="space-y-2">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex justify-between items-center rounded-xl border border-border bg-white p-3"
          >
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{doc.originalName}</div>
              <div className="text-xs text-muted">
                {formatSize(doc.sizeBytes)} · {new Date(doc.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-3 shrink-0 ml-3">
              <button
                className="text-sm text-primary hover:underline"
                onClick={() => handleDownload(doc)}
              >
                Télécharger
              </button>
              <button
                className="text-sm text-danger hover:underline"
                onClick={() => handleDelete(doc.id)}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
