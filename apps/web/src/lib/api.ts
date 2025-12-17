const API_URL = import.meta.env.VITE_API_URL as string

export function getToken() {
  return localStorage.getItem("token")
}

export function setToken(token: string) {
  localStorage.setItem("token", token)
}

export function clearToken() {
  localStorage.removeItem("token")
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()

  const headers = new Headers(init.headers)
  headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(`${API_URL}${path}`, { ...init, headers })

    if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`${res.status} ${res.statusText} ${text}`)
  }

  // ✅ Cas classique: DELETE renvoie 204 No Content
  if (res.status === 204) {
    return undefined as T
  }

  // Si pas de contenu JSON, on évite de parser
  const contentType = res.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    return (await res.text()) as unknown as T
  }

  return res.json() as Promise<T>

}
