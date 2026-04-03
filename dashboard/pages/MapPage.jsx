import { useEffect, useState } from 'react'
import MapView from '../components/MapView'

const statusConfig = {
  Flooded:      { dot: '#ef4444', badge: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' }, bar: '#ef4444' },
  Construction: { dot: '#f59e0b', badge: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' }, bar: '#f59e0b' },
  Clear:        { dot: '#10b981', badge: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' }, bar: '#10b981' },
}

const fallbackZones = [
  { area: 'Velachery', status: 'Flooded', detail: 'Flooding near lake. Avoid Taramani Link Road.', risk: 'High', updated: '9:14 am' },
  { area: 'Koyambedu', status: 'Construction', detail: 'Waterline digging on JN Salai. Delays 7–10am.', risk: 'Medium', updated: '8:30 am' },
  { area: 'Anna Nagar', status: 'Clear', detail: 'All routes operational.', risk: 'Low', updated: '9:00 am' },
  { area: 'Tambaram', status: 'Flooded', detail: 'Waterlogging at railway underpass.', risk: 'High', updated: '8:55 am' },
  { area: 'T. Nagar', status: 'Clear', detail: 'No disruptions.', risk: 'Low', updated: '9:00 am' },
  { area: 'Perungudi', status: 'Construction', detail: 'Lane closure on OMR.', risk: 'Medium', updated: '8:45 am' },
]

const filters = ['All', 'Flooded', 'Construction', 'Clear']

export default function MapPage() {
  const [floodZones, setFloodZones] = useState([])
  const [construction, setConstruction] = useState([])
  const [zones, setZones] = useState(fallbackZones)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    fetch('https://11devanshi.pythonanywhere.com/api/flood-zones')
      .then(r => r.json())
      .then(data => {
        setFloodZones(data)
        const mapped = data.map(z => ({
          area: z.area, status: 'Flooded',
          detail: `Risk score: ${z.risk_score}`,
          risk: z.risk_score > 7 ? 'High' : z.risk_score > 4 ? 'Medium' : 'Low',
          updated: 'Live',
        }))
        setZones(prev => [...mapped, ...prev.filter(p => p.status !== 'Flooded')])
      }).catch(() => {})

    fetch('https://11devanshi.pythonanywhere.com/api/construction')
      .then(r => r.json())
      .then(data => {
        setConstruction(data)
        const mapped = data.map(c => ({
          area: c.location, status: 'Construction',
          detail: c.description, risk: 'Medium', updated: 'Live',
        }))
        setZones(prev => [...prev.filter(p => p.status !== 'Construction'), ...mapped])
      }).catch(() => {})
      .finally(() => {
        setLoading(false)
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
      })
  }, [])

  const filtered = filter === 'All' ? zones : zones.filter(z => z.status === filter)

  const statCards = [
    { label: 'Flooded Zones', count: zones.filter(z => z.status === 'Flooded').length, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '🌊' },
    { label: 'Construction', count: zones.filter(z => z.status === 'Construction').length, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: '🚧' },
    { label: 'Clear Zones', count: zones.filter(z => z.status === 'Clear').length, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '✅' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
              color: '#a78bfa', fontSize: 11, fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase',
              padding: '5px 14px', borderRadius: 20, marginBottom: 14
            }}>Live Intelligence</div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
              City Zone Map
            </h1>
            <p style={{ fontSize: 14, color: '#475569' }}>
              Real-time flood and construction zones across Chennai
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '10px 16px'
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: loading ? '#f59e0b' : '#10b981',
              display: 'inline-block',
              boxShadow: `0 0 8px ${loading ? '#f59e0b' : '#10b981'}`
            }} />
            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              {loading ? 'Fetching live data…' : `Updated ${lastUpdated}`}
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {statCards.map((s, i) => (
            <div key={i} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: 16, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${s.color}18`, border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0
              }}>{s.icon}</div>
              <div>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.count}</p>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map container */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, overflow: 'hidden', marginBottom: 28,
          boxShadow: '0 0 60px rgba(0,0,0,0.5)'
        }}>
          {/* Map header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>🗺</span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
                Live Zone Map
              </span>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { dot: '#ef4444', label: 'Flooded' },
                { dot: '#f59e0b', label: 'Construction' },
                { dot: '#10b981', label: 'Clear' },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.dot, display: 'inline-block', boxShadow: `0 0 6px ${l.dot}` }} />
                  <span style={{ fontSize: 12, color: '#64748b' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div style={{ padding: 0 }}>
            {loading ? (
              <div style={{
                height: 480, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: '#0e0e18', gap: 14
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: '3px solid rgba(124,58,237,0.2)',
                  borderTop: '3px solid #7c3aed',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ fontSize: 13, color: '#475569' }}>Loading live city data…</p>
              </div>
            ) : (
              <MapView floodZones={floodZones} construction={construction} />
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '9px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              background: filter === f ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.04)',
              border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
              color: filter === f ? 'white' : '#64748b',
              boxShadow: filter === f ? '0 0 20px rgba(124,58,237,0.3)' : 'none'
            }}>{f}</button>
          ))}
        </div>

        {/* Zone cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {filtered.map((z, i) => {
            const c = statusConfig[z.status] || statusConfig['Clear']
            return (
              <div key={i} style={{
                background: '#12121a',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, overflow: 'hidden',
                borderLeft: `3px solid ${c.bar}`,
                transition: 'all 0.2s'
              }}>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: c.dot, display: 'inline-block',
                        boxShadow: `0 0 6px ${c.dot}`
                      }} />
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
                        {z.area}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: c.badge.bg, color: c.badge.color, border: `1px solid ${c.badge.border}`
                    }}>{z.status}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, paddingLeft: 16 }}>{z.detail}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingLeft: 16 }}>
                    <span style={{ fontSize: 11, color: '#334155' }}>Updated {z.updated}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: z.risk === 'High' ? '#f87171' : z.risk === 'Medium' ? '#fbbf24' : '#34d399'
                    }}>Risk: {z.risk}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}