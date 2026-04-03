import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CHENNAI = [13.0827, 80.2707]

export default function MapView({ floodZones = [], construction = [] }) {
  return (
    <MapContainer center={CHENNAI} zoom={12} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {floodZones.map(zone => (
        <Circle
          key={zone.id}
          center={[zone.lat, zone.lng]}
          radius={500}
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25 }}
        >
          <Popup>
            <strong>{zone.area}</strong><br />
            Risk score: {zone.risk_score}
          </Popup>
        </Circle>
      ))}

      {construction.map(c => (
        <Marker key={c.id} position={[c.lat, c.lng]}>
          <Popup>
            <strong>{c.location}</strong><br />
            {c.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}