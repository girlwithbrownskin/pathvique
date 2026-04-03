import { useState } from 'react'

const steps = ['Photo', 'Details', 'Severity', 'Review']

const issueTypes = ['Pothole', 'Waterlogging', 'Road damage', 'Blocked drain', 'Construction hazard', 'Broken signage', 'Other']
const areas = ['Anna Nagar', 'Velachery', 'Koyambedu', 'T. Nagar', 'Tambaram', 'Perungudi', 'Villivakkam', 'Adyar', 'Porur', 'Ambattur']

export default function ReportPage() {
  const [step, setStep] = useState(0)
  const [photo, setPhoto] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [issueType, setIssueType] = useState('')
  const [area, setArea] = useState('')
  const [street, setStreet] = useState('')
  const [severity, setSeverity] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) { setPhoto(URL.createObjectURL(file)); setPhotoFile(file) }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) { setPhoto(URL.createObjectURL(file)); setPhotoFile(file) }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const formData = new FormData()
      if (photoFile) formData.append('photo', photoFile)
      formData.append('issue_type', issueType)
      formData.append('area', area)
      formData.append('street', street)
      formData.append('severity', severity)
      formData.append('description', description)
      await fetch('https://11devanshi.pythonanywhere.com/api/upload-report', { method: 'POST', body: formData })
    } catch {}
    setSubmitting(false)
    setSubmitted(true)
  }

  const reset = () => {
    setStep(0); setPhoto(null); setPhotoFile(null)
    setIssueType(''); setArea(''); setStreet('')
    setSeverity(''); setDescription(''); setSubmitted(false)
  }

  const inputStyle = {
    width: '100%', background: '#1e1e2e',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '12px 14px',
    color: '#e2e8f0', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'Inter'
  }

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: '#475569',
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
    display: 'block'
  }

  if (submitted) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(16,185,129,0.12)',
          border: '2px solid rgba(16,185,129,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 32
        }}>✓</div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Report Submitted
        </h2>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 32 }}>
          Your report has been logged and forwarded to the relevant municipal department. You'll receive an update within 24 hours.
        </p>
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: 20, marginBottom: 32, textAlign: 'left'
        }}>
          <p style={{ fontSize: 11, color: '#475569', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Report Summary</p>
          {[
            { label: 'Issue', value: issueType },
            { label: 'Area', value: area },
            { label: 'Severity', value: severity },
            { label: 'Street', value: street || 'Not specified' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ fontSize: 12, color: '#475569' }}>{r.label}</span>
              <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={reset} style={{
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          border: 'none', color: 'white', padding: '13px 32px',
          borderRadius: 12, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'Space Grotesk'
        }}>Submit Another Report</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '48px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
            color: '#a78bfa', fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 20, marginBottom: 16
          }}>Citizen Reporting</div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
            Report an Issue
          </h1>
          <p style={{ fontSize: 14, color: '#475569' }}>
            Document a civic problem — AI routes it to the right department instantly.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: i < step ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                    : i === step ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
                  border: i === step ? '2px solid #7c3aed' : i < step ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: i <= step ? '#e2e8f0' : '#334155',
                  transition: 'all 0.3s'
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: i === step ? '#a78bfa' : '#334155', letterSpacing: 1, textTransform: 'uppercase' }}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 1, margin: '0 8px', marginBottom: 20,
                  background: i < step ? 'linear-gradient(90deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.06)'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step panels */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, overflow: 'hidden'
        }}>

          {/* Step 0 — Photo */}
          {step === 0 && (
            <div style={{ padding: 32 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
                Upload a photo
              </h3>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>
                A clear photo helps AI classify the issue accurately and speeds up resolution.
              </p>
              <label onDrop={handleDrop} onDragOver={e => e.preventDefault()} style={{ cursor: 'pointer', display: 'block' }}>
                {photo ? (
                  <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                    <img src={photo} alt="preview" style={{ width: '100%', height: 240, objectFit: 'cover' }} />
                    <button onClick={e => { e.preventDefault(); setPhoto(null); setPhotoFile(null) }} style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(0,0,0,0.6)', border: 'none',
                      color: 'white', width: 30, height: 30, borderRadius: '50%',
                      cursor: 'pointer', fontSize: 16, display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>×</button>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      padding: '20px 16px 12px'
                    }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Photo ready · Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: 200, border: '2px dashed rgba(124,58,237,0.25)',
                    borderRadius: 14, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'rgba(124,58,237,0.04)',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                    }}>📷</div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>Drop photo here or click to upload</p>
                      <p style={{ fontSize: 12, color: '#334155', marginTop: 4 }}>JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
              </label>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                <button onClick={() => setStep(1)} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b', padding: '11px 20px', borderRadius: 10,
                  fontSize: 13, cursor: 'pointer'
                }}>Skip photo</button>
                <button onClick={() => setStep(1)} disabled={!photo} style={{
                  background: photo ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.05)',
                  border: 'none', color: photo ? 'white' : '#334155',
                  padding: '11px 28px', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, cursor: photo ? 'pointer' : 'not-allowed',
                  fontFamily: 'Space Grotesk'
                }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 1 — Details */}
          {step === 1 && (
            <div style={{ padding: 32 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
                Issue details
              </h3>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 28 }}>
                Tell us what and where. Be as specific as possible.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Issue Type</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {issueTypes.map(t => (
                      <button key={t} onClick={() => setIssueType(t)} style={{
                        padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s',
                        background: issueType === t ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                        border: issueType === t ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        color: issueType === t ? '#a78bfa' : '#64748b'
                      }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Area</label>
                  <select value={area} onChange={e => setArea(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select area</option>
                    {areas.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Street / Landmark</label>
                  <input
                    value={street} onChange={e => setStreet(e.target.value)}
                    placeholder="e.g. Near Koyambedu bus stand, opposite petrol pump"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                <button onClick={() => setStep(0)} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b', padding: '11px 20px', borderRadius: 10,
                  fontSize: 13, cursor: 'pointer'
                }}>← Back</button>
                <button onClick={() => setStep(2)} disabled={!issueType || !area} style={{
                  background: (issueType && area) ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.05)',
                  border: 'none', color: (issueType && area) ? 'white' : '#334155',
                  padding: '11px 28px', borderRadius: 10,
                  fontSize: 13, fontWeight: 700,
                  cursor: (issueType && area) ? 'pointer' : 'not-allowed',
                  fontFamily: 'Space Grotesk'
                }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2 — Severity */}
          {step === 2 && (
            <div style={{ padding: 32 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
                How severe is it?
              </h3>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 28 }}>
                This helps prioritise which reports get actioned first.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Low', desc: 'Minor inconvenience, no safety risk', icon: '🟡', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
                  { label: 'Medium', desc: 'Affects traffic flow, causes delays', icon: '🟠', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
                  { label: 'High', desc: 'Immediate safety hazard, urgent action needed', icon: '🔴', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
                ].map(({ label, desc, icon, color, bg, border }) => (
                  <button key={label} onClick={() => setSeverity(label)} style={{
                    padding: '16px 20px', borderRadius: 12, cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.2s',
                    background: severity === label ? bg : 'rgba(255,255,255,0.03)',
                    border: severity === label ? `1px solid ${border}` : '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', gap: 16
                  }}>
                    <span style={{ fontSize: 24 }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: severity === label ? color : '#94a3b8', fontFamily: 'Space Grotesk' }}>{label}</p>
                      <p style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>{desc}</p>
                    </div>
                    {severity === label && (
                      <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', fontWeight: 700 }}>✓</div>
                    )}
                  </button>
                ))}
              </div>
              <div>
                <label style={labelStyle}>Description (optional)</label>
                <textarea
                  rows={3} value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Any additional context about when you noticed it, how long it's been there…"
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button onClick={() => setStep(1)} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b', padding: '11px 20px', borderRadius: 10,
                  fontSize: 13, cursor: 'pointer'
                }}>← Back</button>
                <button onClick={() => setStep(3)} disabled={!severity} style={{
                  background: severity ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.05)',
                  border: 'none', color: severity ? 'white' : '#334155',
                  padding: '11px 28px', borderRadius: 10,
                  fontSize: 13, fontWeight: 700,
                  cursor: severity ? 'pointer' : 'not-allowed',
                  fontFamily: 'Space Grotesk'
                }}>Review →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div style={{ padding: 32 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
                Review & Submit
              </h3>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 28 }}>
                Confirm everything looks right before submitting.
              </p>

              {photo && (
                <img src={photo} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }} />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 28 }}>
                {[
                  { label: 'Issue Type', value: issueType },
                  { label: 'Area', value: area },
                  { label: 'Street', value: street || 'Not specified' },
                  { label: 'Severity', value: severity },
                  { label: 'Description', value: description || 'None provided' },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '14px 0',
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}>
                    <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b', padding: '11px 20px', borderRadius: 10,
                  fontSize: 13, cursor: 'pointer'
                }}>← Back</button>
                <button onClick={handleSubmit} disabled={submitting} style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  border: 'none', color: 'white',
                  padding: '13px 32px', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Space Grotesk',
                  boxShadow: '0 0 30px rgba(124,58,237,0.3)',
                  opacity: submitting ? 0.7 : 1
                }}>
                  {submitting ? 'Submitting…' : 'Submit Report'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ fontSize: 11, color: '#1e293b', textAlign: 'center', marginTop: 20 }}>
          Reports are reviewed within 24 hours and forwarded to the relevant municipal authority.
        </p>
      </div>
    </div>
  )
}