import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CHENNAI = [13.0827, 80.2707]

const CHENNAI_ZONES = [
  { id: 1, lat: 12.9816, lng: 80.2209, area: 'Velachery', risk_score: 78, description: 'Active flooding near Velachery lake. Taramani Link Road impassable. Use OMR via Perungudi flyover as alternate.' },
  { id: 2, lat: 13.0732, lng: 80.2609, area: 'Koyambedu', risk_score: 50, description: 'Waterline digging on JN Salai causing lane closures 7–10am daily. Expect 15–20 min delays.' },
  { id: 3, lat: 13.0878, lng: 80.2785, area: 'Anna Nagar', risk_score: 18, description: 'All routes operational. No disruptions reported in this area.' },
  { id: 4, lat: 12.9249, lng: 80.1000, area: 'Tambaram', risk_score: 82, description: 'Waterlogging at railway station underpass. Vehicles advised to use bypass road via GST Road.' },
  { id: 5, lat: 13.0418, lng: 80.2341, area: 'T. Nagar', risk_score: 15, description: 'No disruptions. Normal traffic flow on Usman Road and Pondy Bazaar.' },
  { id: 6, lat: 12.9602, lng: 80.2459, area: 'Perungudi', risk_score: 45, description: 'Lane closure on OMR near Perungudi interchange. Use service road to avoid delays.' },
  { id: 7, lat: 13.0358, lng: 80.1647, area: 'Porur', risk_score: 71, description: 'Water stagnation near Porur junction. Avoid Mount Poonamallee Road during heavy rain.' },
  { id: 8, lat: 13.0012, lng: 80.2565, area: 'Adyar', risk_score: 12, description: 'All clear. Adyar bridge and connecting roads fully operational.' },
  { id: 9, lat: 13.1067, lng: 80.1642, area: 'Ambattur', risk_score: 40, description: 'Minor waterlogging at industrial estate junction. Slow-moving traffic during peak hours.' },
  { id: 10, lat: 13.0524, lng: 80.2360, area: 'Villivakkam', risk_score: 55, description: 'Metro pillar work on Poonamallee High Road. Lane closures causing delays near junction.' },
]

const CHENNAI_CONSTRUCTION = [
  { id: 1, lat: 13.0732, lng: 80.2609, location: 'Koyambedu Junction', description: 'Waterline replacement work. Lane closures 7am–10am. Expect 15–20 min delays on JN Salai.' },
  { id: 2, lat: 13.0524, lng: 80.2360, location: 'Villivakkam — Poonamallee High Rd', description: 'Metro pillar construction in progress. Right lane blocked. Use left service road.' },
  { id: 3, lat: 12.9602, lng: 80.2459, location: 'Perungudi OMR', description: 'Partial lane closure near Perungudi interchange for road widening. Use service road.' },
]

const getRiskColor = (score) => {
  if (score >= 70) return '#ef4444'
  if (score >= 40) return '#f59e0b'
  return '#10b981'
}

const getRiskLabel = (score) => {
  if (score >= 70) return '🔴 High Risk'
  if (score >= 40) return '🟠 Medium Risk'
  return '🟢 Low Risk'
}

function MapController({ center }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, 12, { duration: 1.2 })
  }, [center])
  return null
}

export default function MapView({ floodZones = [], construction = [], city = 'Chennai' }) {
  const zones = floodZones.length > 0 ? floodZones : CHENNAI_ZONES
  const constructions = construction.length > 0 ? construction : CHENNAI_CONSTRUCTION

  return (
    <div>
      <MapContainer
        center={CHENNAI}
        zoom={12}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        <MapController center={CHENNAI} />

        {/* Flood risk circles */}
        {zones.map(zone => {
          const score = zone.risk_score
          const color = getRiskColor(score)
          return (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={700}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.22,
                weight: 2
              }}
            >
              <Popup>
                <div style={{ minWidth: 200, fontFamily: 'Inter, sans-serif' }}>
                  <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#1e293b' }}>
                    {zone.area}
                  </p>
                  <p style={{
                    fontSize: 12, fontWeight: 700, marginBottom: 8,
                    color: color,
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    padding: '3px 8px', borderRadius: 6,
                    display: 'inline-block'
                  }}>
                    Risk Score: {score} — {getRiskLabel(score)}
                  </p>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {zone.description}
                  </p>
                </div>
              </Popup>
            </Circle>
          )
        })}

        {/* Construction markers */}
        {constructions.map(c => (
          <Marker key={c.id} position={[c.lat, c.lng]}>
            <Popup>
              <div style={{ minWidth: 200, fontFamily: 'Inter, sans-serif' }}>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#1e293b' }}>
                  🚧 {c.location}
                </p>
                <p style={{
                  fontSize: 12, fontWeight: 700, marginBottom: 8,
                  color: '#f59e0b',
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  padding: '3px 8px', borderRadius: 6,
                  display: 'inline-block'
                }}>
                  Construction Zone
                </p>
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {c.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Zone descriptions below map */}
      <div style={{
        background: '#0e0e18',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 24px'
      }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: '#475569',
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16
        }}>
          Active Zones — Chennai
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {zones.map((z, i) => {
            const color = getRiskColor(z.risk_score)
            const pulse = z.risk_score >= 70 ? 'pulse-red' : z.risk_score >= 40 ? 'pulse-orange' : 'pulse-green'
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${color}20`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 10
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: color, flexShrink: 0, marginTop: 4,
                  boxShadow: `0 0 6px ${color}`,
                  animation: `${pulse} 2s infinite`
                }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
                      {z.area}
                    </p>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color, background: `${color}15`,
                      border: `1px solid ${color}30`,
                      padding: '1px 8px', borderRadius: 6
                    }}>
                      Risk {z.risk_score}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: '#64748b'
                    }}>
                      {getRiskLabel(z.risk_score)}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    {z.description}
                  </p>
                </div>
              </div>
            )
          })}

          {constructions.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '14px 16px',
              background: 'rgba(245,158,11,0.03)',
              border: '1px solid rgba(245,158,11,0.15)',
              borderLeft: '3px solid #f59e0b',
              borderRadius: 10
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#f59e0b', flexShrink: 0, marginTop: 4,
                boxShadow: '0 0 6px #f59e0b',
                animation: 'pulse-orange 2s infinite'
              }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
                    🚧 {c.location}
                  </p>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: '#fbbf24', background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    padding: '1px 8px', borderRadius: 6
                  }}>Construction</span>
                </div>
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}