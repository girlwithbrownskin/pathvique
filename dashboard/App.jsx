import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ChatPage from './pages/ChatPage'
import MapPage from './pages/MapPage'
import AlertsPage from './pages/AlertsPage'
import ReportPage from './pages/ReportPage'

function Navbar({ onLogin, user }) {
  const location = useLocation()
  const links = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Pathbot' },
    { to: '/map', label: 'Live Map' },
    { to: '/alerts', label: 'Alerts' },
    { to: '/report', label: 'Report' },
  ]
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(124,58,237,0.2)',
      padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '64px'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'Space Grotesk'
        }}>P</div>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: '#fff' }}>
          पथ<span style={{ color: '#a855f7' }}>Vique</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            textDecoration: 'none',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            color: location.pathname === l.to ? '#fff' : '#94a3b8',
            background: location.pathname === l.to ? 'rgba(124,58,237,0.3)' : 'transparent',
            border: location.pathname === l.to ? '1px solid rgba(124,58,237,0.5)' : '1px solid transparent',
            transition: 'all 0.2s'
          }}>{l.label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white'
            }}>{user.name[0]}</div>
            <span style={{ fontSize: 13, color: '#cbd5e1' }}>{user.name}</span>
          </div>
        ) : (
          <>
            <button onClick={() => onLogin('citizen')} style={{
              background: 'transparent', border: '1px solid rgba(124,58,237,0.4)',
              color: '#a78bfa', padding: '7px 16px', borderRadius: 8,
              fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}>Citizen Login</button>
            <button onClick={() => onLogin('govt')} style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              border: 'none', color: 'white', padding: '7px 16px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>Govt Portal</button>
          </>
        )}
      </div>
    </nav>
  )
}

function LoginModal({ type, onClose, onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isGovt = type === 'govt'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: '#12121a', border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: 20, padding: 40, width: 400, position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'none',
          border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer'
        }}>×</button>

        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: isGovt ? 'rgba(245,158,11,0.1)' : 'rgba(124,58,237,0.1)',
            border: `1px solid ${isGovt ? 'rgba(245,158,11,0.3)' : 'rgba(124,58,237,0.3)'}`,
            borderRadius: 20, padding: '4px 12px', marginBottom: 16
          }}>
            <span style={{ fontSize: 12, color: isGovt ? '#f59e0b' : '#a78bfa', fontWeight: 600 }}>
              {isGovt ? '🏛 Government Portal' : '👤 Citizen Access'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>
            {isGovt ? 'Official Login' : 'Welcome back'}
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
            {isGovt ? 'Access the government dashboard and reports' : 'Get personalised city alerts and updates'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>
              {isGovt ? 'Official Email' : 'Email'}
            </label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder={isGovt ? 'officer@tn.gov.in' : 'you@email.com'}
              style={{
                width: '100%', marginTop: 6, padding: '12px 14px',
                background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, color: '#e2e8f0', fontSize: 14,
                outline: 'none', boxSizing: 'border-box'
              }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', marginTop: 6, padding: '12px 14px',
                background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, color: '#e2e8f0', fontSize: 14,
                outline: 'none', boxSizing: 'border-box'
              }} />
          </div>
          <button onClick={() => onSuccess({ name: isGovt ? 'Officer Kumar' : 'Citizen', role: type })}
            style={{
              marginTop: 8, padding: '13px',
              background: isGovt
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              border: 'none', borderRadius: 10, color: 'white',
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk'
            }}>
            {isGovt ? 'Access Dashboard' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AppInner() {
  const [loginType, setLoginType] = useState(null)
  const [user, setUser] = useState(null)

  return (
    <div style={{ paddingTop: 64 }}>
      <Navbar onLogin={setLoginType} user={user} />
      {loginType && (
        <LoginModal
          type={loginType}
          onClose={() => setLoginType(null)}
          onSuccess={(u) => { setUser(u); setLoginType(null) }}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  )
}
