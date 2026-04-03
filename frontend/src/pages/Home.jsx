import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const chennaiAreas = [
  'Anna Nagar', 'T. Nagar', 'Velachery', 'Koyambedu', 'Adyar',
  'Tambaram', 'Perungudi', 'Villivakkam', 'Porur', 'Ambattur',
  'Kodambakkam', 'Nungambakkam', 'Mylapore', 'Royapettah', 'Guindy'
]

const features = [
  { icon: '⚡', title: 'Pathbot AI', desc: 'Ask anything in plain language. Real answers about roads, floods, construction — instantly.', color: '#7c3aed' },
  { icon: '🗺', title: 'Live Zone Map', desc: 'Real-time colour-coded map with flood circles and construction markers pulled from live data.', color: '#2563eb' },
  { icon: '🔔', title: 'Smart Alerts', desc: 'Area-specific push notifications before disruptions hit your route. No GPS needed.', color: '#059669' },
  { icon: '📷', title: 'AI Reporting', desc: 'Photo upload with AI classification. Report reaches the right department in seconds.', color: '#dc2626' },
  { icon: '📊', title: 'Risk Score', desc: 'Per-zone live disaster index combining flood level, accidents, and construction density.', color: '#d97706' },
  { icon: '🏛', title: 'Gov Dashboard', desc: 'Authorities see all citizen reports mapped and categorised. Accountable by design.', color: '#7c3aed' },
]

const S = {
  label: {
    display: 'inline-block',
    background: 'rgba(124,58,237,0.15)',
    border: '1px solid rgba(124,58,237,0.3)',
    color: '#a78bfa', fontSize: 11, fontWeight: 700,
    letterSpacing: 2, textTransform: 'uppercase',
    padding: '5px 14px', borderRadius: 20, marginBottom: 20
  },
  h1: { fontFamily: 'Space Grotesk', fontSize: 'clamp(36px,5vw,68px)', fontWeight: 800, lineHeight: 1.1, color: '#f8fafc' },
  h2: { fontFamily: 'Space Grotesk', fontSize: 'clamp(28px,3vw,42px)', fontWeight: 700, color: '#f8fafc' },
}

export default function Home() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState('idle')
  const [selectedArea, setSelectedArea] = useState('')
  const [saved, setSaved] = useState(null)

  useEffect(() => {
    let n = 0
    const t = setInterval(() => { n += 7; setCount(Math.min(n, 500)); if (n >= 500) clearInterval(t) }, 20)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: '#0a0a0f' }}>

      {/* Location bar */}
      <div style={{
        background: step === 'saved' ? 'rgba(5,150,105,0.08)' : 'rgba(124,58,237,0.08)',
        borderBottom: `1px solid ${step === 'saved' ? 'rgba(5,150,105,0.25)' : 'rgba(124,58,237,0.25)'}`,
        padding: '0 2rem',
      }}>

        {step === 'idle' && (
          <div style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Set your area in Chennai</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Get personalised alerts for your neighbourhood</p>
              </div>
            </div>
            <button onClick={() => setStep('selecting')} style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              border: 'none', color: 'white',
              padding: '10px 22px', borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              fontFamily: 'Space Grotesk'
            }}>Set Location →</button>
          </div>
        )}

        {step === 'selecting' && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 0' }}>
            <p style={{ fontSize: 12, color: '#a78bfa', marginBottom: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px 0' }}>
              📍 Select your area — Chennai
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                style={{
                  padding: '11px 14px', background: '#1e1e2e',
                  border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10,
                  color: '#e2e8f0', fontSize: 13, outline: 'none', cursor: 'pointer',
                  minWidth: 220
                }}
              >
                <option value="">Select your area</option>
                {chennaiAreas.map(a => <option key={a}>{a}</option>)}
              </select>
              <button
                onClick={() => {
                  if (selectedArea) {
                    setSaved({ area: selectedArea })
                    setStep('saved')
                  }
                }}
                style={{
                  background: selectedArea ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.05)',
                  border: 'none', color: selectedArea ? 'white' : '#334155',
                  padding: '11px 22px', borderRadius: 10,
                  fontSize: 13, fontWeight: 700,
                  cursor: selectedArea ? 'pointer' : 'not-allowed',
                  fontFamily: 'Space Grotesk',
                  opacity: selectedArea ? 1 : 0.5
                }}
              >Save</button>
              <button
                onClick={() => setStep('idle')}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer' }}
              >Cancel</button>
            </div>
          </div>
        )}

        {step === 'saved' && saved && (
          <div style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#10b981', display: 'inline-block',
                boxShadow: '0 0 8px #10b981', flexShrink: 0
              }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#34d399', margin: 0 }}>
                  📍 {saved.area}, Chennai
                </p>
                <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>Showing live alerts for your area</p>
              </div>
            </div>
            <button
              onClick={() => setStep('selecting')}
              style={{
                background: 'none', border: '1px solid rgba(16,185,129,0.3)',
                color: '#34d399', padding: '8px 16px', borderRadius: 8,
                fontSize: 12, cursor: 'pointer', fontWeight: 600
              }}
            >Change area</button>
          </div>
        )}
      </div>

      {/* Hero */}
      <div style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        padding: '80px 2rem',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.08) 0%, transparent 50%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', position: 'relative' }}>
          <div style={{ maxWidth: 720 }}>
            <div style={S.label}>Smart City · Real Time · Chennai</div>
            <h1 style={S.h1}>
              Know your city<br />
              <span style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                before you leave home.
              </span>
            </h1>
            <p style={{ fontSize: 18, color: '#64748b', marginTop: 24, marginBottom: 40, lineHeight: 1.7, maxWidth: 520 }}>
              Construction zones, flood alerts, blocked roads — all live, all connected. Built for citizens. Trusted by government.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/chat" style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: 'white', padding: '14px 28px', borderRadius: 12,
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                fontFamily: 'Space Grotesk', display: 'inline-block',
                boxShadow: '0 0 40px rgba(124,58,237,0.4)'
              }}>Ask Pathbot →</Link>
              <Link to="/map" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0', padding: '14px 28px', borderRadius: 12,
                fontWeight: 600, fontSize: 15, textDecoration: 'none',
                fontFamily: 'Space Grotesk', display: 'inline-block',
              }}>View Live Map</Link>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
              {[
                { dot: '#ef4444', text: '4 Flood alerts active' },
                { dot: '#f59e0b', text: '3 Construction zones' },
                { dot: '#10b981', text: saved ? `Live · ${saved.area}, Chennai` : 'Live data · Chennai' },
              ].map((b, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20, padding: '6px 14px'
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: b.dot, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: '#12121a', borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '48px 2rem'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[
            { num: `${count}M+`, label: 'Urban commuters in India', sub: 'need real-time infrastructure data' },
            { num: '7 Days', label: 'Avg complaint resolution', sub: 'we aim to cut this to under 24hrs' },
            { num: '1st', label: 'Platform of its kind', sub: 'bridging citizens and government live' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '20px 24px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none'
            }}>
              <p style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 800, color: '#a855f7' }}>{s.num}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginTop: 6 }}>{s.label}</p>
              <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '100px 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={S.label}>What पथVique does</div>
          <h2 style={{ ...S.h2, marginTop: 12 }}>One platform. Every layer of your city.</h2>
          <p style={{ color: '#64748b', marginTop: 12, fontSize: 15 }}>Built for scale. Designed for people.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: '#12121a',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: 28, cursor: 'default'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${f.color}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 18
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '80px 2rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))',
          border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: '60px 40px'
        }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 700, color: '#f8fafc' }}>
            Your city is live.<br />Are you watching?
          </h2>
          <p style={{ color: '#64748b', marginTop: 12, marginBottom: 32, fontSize: 15 }}>
            Join thousands of Chennai commuters who know before they go.
          </p>
          <Link to="/map" style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: 'white', padding: '14px 32px', borderRadius: 12,
            fontWeight: 700, fontSize: 15, textDecoration: 'none',
            fontFamily: 'Space Grotesk', display: 'inline-block',
            boxShadow: '0 0 60px rgba(124,58,237,0.3)'
          }}>Open Live Map →</Link>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#334155' }}>पथVique · Urban Infrastructure, People Centred · Chennai Pilot 2025</p>
      </div>
    </div>
  )
}