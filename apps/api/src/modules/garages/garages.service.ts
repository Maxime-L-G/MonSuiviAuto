const OVERPASS_URL = "https://overpass-api.de/api/interpreter"

export async function findNearbyGarages(lat: number, lon: number) {
  const query =
    `[out:json];(` +
    `node["shop"="car_repair"](around:5000,${lat},${lon});` +
    `node["amenity"="car_repair"](around:5000,${lat},${lon});` +
    `node["craft"="car_painter"](around:5000,${lat},${lon});` +
    `node["shop"="car"](around:5000,${lat},${lon});` +
    `node["craft"="car_repair"](around:5000,${lat},${lon});` +
    `);out;`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 12000)

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`OVERPASS_ERROR ${res.status} ${body.slice(0, 200)}`)
    }

    const data = await res.json()
    return data.elements ?? []
  } finally {
    clearTimeout(timeoutId)
  }
}
