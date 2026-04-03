import { useState, useRef, useEffect } from 'react'

const suggestions = [
  { icon: '🌊', text: 'Is Velachery safe right now?' },
  { icon: '🚧', text: 'Which roads are blocked today?' },
  { icon: '📊', text: "What's today's disaster score?" },
  { icon: '🛣️', text: 'Best route from Anna Nagar to OMR?' },
]

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hello. I'm Pathbot — your city intelligence assistant. Ask me about road conditions, flood zones, or construction anywhere in your city.",
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [usedSuggestions, setUsedSuggestions] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text) => {
    const question = text || input.trim()
    if (!question) return
    setInput('')
    setUsedSuggestions(true)
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { from: 'user', text: question, time }])
    setTyping(true)
    try {
      const res = await fetch('https://11devanshi.pythonanywhere.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      const reply = data.answer || data.response || data.message || 'Checking live city data for you.'
      setMessages(prev => [...prev, {
        from: 'bot', text: reply,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }])
    } catch {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: 'Unable to reach city data server right now. Please try again shortly.',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div style={{
      height: 'calc(100vh - 64px)', background: '#0a0a0f',
      display: 'flex', flexDirection: 'column', maxWidth: 900,
      margin: '0 auto', width: '100%'
    }}>

      {/* Header */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#12121a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
            boxShadow: '0 0 24px rgba(124,58,237,0.5)'
          }}>⚡</div>
          <div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              Pathbot
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#10b981',
                display: 'inline-block', boxShadow: '0 0 8px #10b981'
              }} />
              <span style={{ fontSize: 12, color: '#475569' }}>Connected to live city data</span>
            </div>
          </div>
        </div>
        <div style={{
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 10, padding: '8px 14px',
          fontSize: 12, color: '#a78bfa', fontWeight: 600
        }}>
          AI · Real Time
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '32px',
        display: 'flex', flexDirection: 'column', gap: 24
      }}>

        {/* Welcome card */}
        {messages.length === 1 && (
          <div style={{
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 20, padding: 28, marginBottom: 8,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(168,85,247,0.04))'
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: '#7c3aed',
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12
            }}>
              What I can help with
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '🌊', text: 'Flood zone status & water levels' },
                { icon: '🚧', text: 'Construction zones & detours' },
                { icon: '🛣️', text: 'Best routes avoiding disruptions' },
                { icon: '⚠️', text: 'Risk scores per area' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.03)', borderRadius: 10,
                  padding: '10px 14px', border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end', gap: 12
          }}>
            {msg.from === 'bot' && (
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
              }}>⚡</div>
            )}
            <div style={{ maxWidth: '65%' }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                background: msg.from === 'user'
                  ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                  : '#1e1e2e',
                border: msg.from === 'bot' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                color: msg.from === 'user' ? 'white' : '#cbd5e1',
                fontSize: 14, lineHeight: 1.7,
                boxShadow: msg.from === 'user' ? '0 4px 20px rgba(124,58,237,0.3)' : 'none'
              }}>{msg.text}</div>
              <p style={{
                fontSize: 10, color: '#334155', marginTop: 5,
                textAlign: msg.from === 'user' ? 'right' : 'left',
                paddingLeft: msg.from === 'bot' ? 4 : 0,
                paddingRight: msg.from === 'user' ? 4 : 0
              }}>{msg.time}</p>
            </div>
            {msg.from === 'user' && (
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
              }}>👤</div>
            )}
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}>⚡</div>
            <div style={{
              padding: '16px 20px', borderRadius: '4px 18px 18px 18px',
              background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', gap: 6, alignItems: 'center'
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#7c3aed',
                  display: 'inline-block', animation: 'bounce 1.2s infinite',
                  animationDelay: `${i * 0.2}s`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Preset suggestions — always visible below messages, above input */}
      {!usedSuggestions && (
        <div style={{
          padding: '12px 32px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          background: '#0d0d14'
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: '#334155',
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10
          }}>Try asking</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.text)} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                color: '#a78bfa', padding: '9px 16px',
                borderRadius: 20, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.18)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'
                }}
              >
                <span>{s.icon}</span>
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div style={{
        padding: '16px 32px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#12121a',
        display: 'flex', gap: 12, alignItems: 'center'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about any road, area, or disruption…"
          style={{
            flex: 1, background: '#1e1e2e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '14px 18px',
            color: '#e2e8f0', fontSize: 14, outline: 'none', fontFamily: 'Inter'
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || typing}
          style={{
            width: 50, height: 50, borderRadius: 14, flexShrink: 0,
            background: input.trim() && !typing
              ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
              : 'rgba(255,255,255,0.05)',
            border: 'none',
            cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, transition: 'all 0.2s',
            boxShadow: input.trim() && !typing ? '0 0 20px rgba(124,58,237,0.4)' : 'none'
          }}>→</button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}