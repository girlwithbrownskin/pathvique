import { useState } from 'react'

const allAlerts = [
  { id: 1, type: 'Flood', area: 'Velachery', message: 'Active flooding near Velachery lake. Taramani Link Road impassable. Alternate: OMR via Perungudi flyover.', time: 'Active now', severity: 'high' },
  { id: 2, type: 'Construction', area: 'Koyambedu', message: 'Waterline work on JN Salai. Lane closures from 7am to 10am daily. Delays of 15–20 min expected.', time: 'Starts Monday', severity: 'medium' },
  { id: 3, type: 'Route', area: 'OMR', message: 'Partial lane closure near Perungudi interchange. Use Rajiv Gandhi Salai service road.', time: '3 days ago', severity: 'medium' },
  { id: 4, type: 'Construction', area: 'Villivakkam', message: 'Metro pillar work on Poonamallee High Road near Villivakkam junction. Delays during peak hours.', time: 'Ongoing', severity: 'medium' },
  { id: 5, type: 'Flood', area: 'Tambaram', message: 'Waterlogging at railway station underpass. Vehicles using this route advised to take bypass road.', time: 'Active now', severity: 'high' },
  { id: 6, type: 'Flood', area: 'Porur', message: 'Water stagnation near Porur junction. Avoid Mount Poonamallee Road during heavy rain.', time: '2 hrs ago', severity: 'high' },
]

const savedAreas = ['Villivakkam', 'Koyambedu', 'Perungudi OMR']

const severityConfig = {
  high:   { bar: '#ef4444', badge: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' }, dot: '#ef4444', label: 'High Risk' },
  medium: { bar: '#f59e0b', badge: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' }, dot: '#f59e0b', label: 'Medium' },
  low:    { bar: '#10b981', badge: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' }, dot: '#10b981', label: 'Low' },
}

const typeColors = {
  Flood:        { bg: 'rgba(239,68,68,0.1)',   color: '#f87171',  border: 'rgba(239,68,68,0.2)' },
  Construction: { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24',  border: 'rgba(245,158,11,0.2)' },
  Route:        { bg: 'rgba(99,102,241,0.1)',  color: '#818cf8',  border: 'rgba(99,102,241,0.2)' },
}

const filters = ['All', 'Flood', 'Construction', 'Route']

export default function AlertsPage() {
  const [areas, setAreas] = useState(savedAreas)
  const [newArea, setNewArea] = useState('')
  const [filter, setFilter] = useState('All')

  const addArea = () => {
    if (newArea.trim() && !areas.includes(newArea.trim())) {
      setAreas([...areas, newArea.trim()])
      setNewArea('')
    }
  }

  const removeArea = (a) => setAreas(areas.filter(x => x !== a))
  const filtered = filter === 'All' ? allAlerts : allAlerts.filter(a => a.type === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171', fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 20, marginBottom: 16
          }}>
            Live Disruptions
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
            Neighbourhood Alerts
          </h1>
          <p style={{ fontSize: 14, color: '#475569' }}>
            Real-time disruptions across your saved areas — no GPS required.
          </p>
        </div>

        {/* Saved areas */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: 24, marginBottom: 24
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            Your Saved Areas
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {areas.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
                color: '#a78bfa', fontSize: 12, fontWeight: 600,
                padding: '6px 12px', borderRadius: 20
              }}>
                {a}
                <button onClick={() => removeArea(a)} style={{
                  background: 'none', border: 'none', color: '#7c3aed',
                  cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: 0
                }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={newArea}
              onChange={e => setNewArea(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addArea()}
              placeholder="Add an area…"
              style={{
                flex: 1, background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '10px 14px', color: '#e2e8f0',
                fontSize: 13, outline: 'none'
              }}
            />
            <button onClick={addArea} style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              border: 'none', color: 'white', padding: '10px 20px',
              borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>Add</button>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              background: filter === f ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.04)',
              border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
              color: filter === f ? 'white' : '#64748b'
            }}>{f}</button>
          ))}
        </div>

        {/* Alert cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((alert) => {
            const c = severityConfig[alert.severity]
            const t = typeColors[alert.type] || typeColors['Route']
            return (
              <div key={alert.id} style={{
                background: '#12121a',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                borderLeft: `3px solid ${c.bar}`
              }}>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: c.dot, display: 'inline-block', flexShrink: 0,
                        marginTop: 2
                      }} />
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
                        {alert.area}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: t.bg, color: t.color, border: `1px solid ${t.border}`
                      }}>{alert.type}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                        background: c.badge.bg, color: c.badge.color, border: `1px solid ${c.badge.border}`
                      }}>{c.label}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#334155', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {alert.time}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, paddingLeft: 18 }}>
                    {alert.message}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
