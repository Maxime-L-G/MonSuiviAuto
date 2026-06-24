import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

import markerIconUrl from "leaflet/dist/images/marker-icon.png"
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png"

const defaultIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
})

const userIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  className: "hue-rotate-[200deg]",
})

type Garage = {
  id: number
  lat: number
  lon: number
  tags: { name?: string; phone?: string; opening_hours?: string }
}

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], 14)
  }, [lat, lon, map])
  return null
}

export function Garages() {
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null)
  const [garages, setGarages] = useState<Garage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        setPosition({ lat, lon })

        try {
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

          const res = await fetch("https://overpass.openstreetmap.fr/api/interpreter", {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: query,
            signal: controller.signal,
          })
          clearTimeout(timeoutId)

          if (!res.ok) throw new Error("OVERPASS_ERROR")
          const data = await res.json()
          setGarages(data.elements ?? [])
        } catch {
          setError("Le service de garages est trop lent ou indisponible pour le moment. Réessaie plus tard.")
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError("Localisation refusée. Active la géolocalisation pour voir les garages proches.")
        setLoading(false)
      },
      { timeout: 5000, enableHighAccuracy: false, maximumAge: 60000 }
    )
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
        <div className="text-sm text-muted">Localisation en cours…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm">
        <div className="text-sm text-danger">{error}</div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-5 shadow-sm space-y-4">
      <div>
        <div className="text-lg font-semibold">Garages à proximité</div>
        <div className="text-sm text-muted">
          {garages.length} garage{garages.length > 1 ? "s" : ""} trouvé{garages.length > 1 ? "s" : ""} dans un rayon de 5 km
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-border" style={{ height: 480 }}>
        {position && (
          <MapContainer
            center={[position.lat, position.lon]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <RecenterMap lat={position.lat} lon={position.lon} />

            <Marker position={[position.lat, position.lon]} icon={userIcon}>
              <Popup>Ma position</Popup>
            </Marker>

            {garages.map((g) => (
              <Marker key={g.id} position={[g.lat, g.lon]} icon={defaultIcon}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-medium">{g.tags.name ?? "Garage"}</div>
                    {g.tags.phone && <div>{g.tags.phone}</div>}
                    {g.tags.opening_hours && <div>{g.tags.opening_hours}</div>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  )
}
