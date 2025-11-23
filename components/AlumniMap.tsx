'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Alumni {
  id: string
  firstName: string
  lastName: string
  city: string | null
  currentRole: string | null
  coords: [number, number]
}

interface AlumniMapProps {
  alumni: Alumni[]
}

export default function AlumniMap({ alumni }: AlumniMapProps) {
  // Center on Israel
  const center: [number, number] = [31.5, 34.8]

  // Create custom icon
  const createIcon = (color: string) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">
      ${alumni.length > 1 ? '' : ''}
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444']
  const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length]

  return (
    <MapContainer
      center={center}
      zoom={8}
      style={{ height: '600px', width: '100%' }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {alumni.map((person) => (
        <Marker
          key={person.id}
          position={person.coords}
          icon={createIcon(getColor(person.firstName))}
        >
          <Popup>
            <div className="text-center min-w-[150px]" dir="rtl">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold"
                style={{ background: getColor(person.firstName) }}
              >
                {person.firstName[0]}{person.lastName[0]}
              </div>
              <h3 className="font-semibold text-sm">
                {person.firstName} {person.lastName}
              </h3>
              {person.currentRole && (
                <p className="text-xs text-gray-500 mt-1">{person.currentRole}</p>
              )}
              <p className="text-xs text-blue-600 mt-1">
                <i className="fas fa-map-marker-alt ml-1"></i>
                {person.city}
              </p>
              <a
                href={`/profile/${person.id}`}
                className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700"
              >
                צפה בפרופיל
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
