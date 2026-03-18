import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showCon, setShowCon]   = useState(false)
  const { register }            = useAuth()
  const navigate                = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password || !confirm) { setError('Please fill all fields'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    const result = register(name, email, password)
    if (!result.success) { setError(result.message); return }
    navigate('/dashboard')
  }

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeIn {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%,100%{ transform:scale(1); opacity:0.4; }
          50%    { transform:scale(1.1); opacity:0.6; }
        }
        @keyframes gradShift {
          0%  { background-position:0% 50%; }
          50% { background-position:100% 50%; }
          100%{ background-position:0% 50%; }
        }
        input:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.2) !important;
          outline: none !important;
        }
        .reg-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(79,70,229,0.55) !important;
        }

        /* Desktop */
        @media(min-width:769px){
          .reg-left  { display:flex !important; }
          .reg-right { width:50% !important; }
        }

        /* Mobile */
        @media(max-width:768px){
          .reg-left  { display:none !important; }
          .reg-right {
            width:100% !important;
            min-height:100vh !important;
            padding:20px 16px !important;
            justify-content:flex-start !important;
            align-items:stretch !important;
            overflow-y:auto !important;
          }
          .reg-card  {
            max-width:100% !important;
            padding:24px 18px !important;
            margin:0 !important;
            border-radius:20px !important;
          }
          .reg-form-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* Background */}
      <div style={s.bg}>
        <div style={s.orb1} />
        <div style={s.orb2} />
        <div style={s.orb3} />
      </div>

      {/* Left — desktop only */}
      <div className="reg-left" style={{ display: 'none', width: '50%', background: 'rgba(10,9,20,0.6)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '60px 48px', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '48px', animation: 'fadeIn 0.6s ease' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(79,70,229,0.5)' }}>🗓️</div>
          <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-1px' }}>
            Smart <span style={{ color: '#818cf8' }}>Scheduler</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Create your free account today</p>
        </div>
        {[
          { icon: '✅', text: 'Free to use forever'           },
          { icon: '☁️', text: 'Cloud-Based Architecture'      },
          { icon: '📅', text: 'Manage all your schedules'     },
          { icon: '🔒', text: 'RBAC Access Control (ICS)'     },
          { icon: '📤', text: 'Export to Google Calendar'     },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px', animation: `fadeIn 0.6s ease ${i*0.1}s both` }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(79,70,229,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid rgba(79,70,229,0.2)', flexShrink: 0 }}>{f.icon}</div>
            <span style={{ color: '#94a3b8', fontSize: '15px' }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Right — form */}
      <div className="reg-right" style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative', zIndex: 2 }}>
        <div className="reg-card" style={{ background: 'rgba(13,12,24,0.92)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '440px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 0 1px rgba(79,70,229,0.15),0 20px 60px rgba(0,0,0,0.5)', animation: 'fadeIn 0.5s ease' }}>

          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }} className="mob-logo-reg">
            <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🗓️</div>
            <div>
              <p style={{ color: '#fff', fontSize: '17px', fontWeight: '800', margin: 0 }}>Smart <span style={{ color: '#818cf8' }}>Scheduler</span></p>
              <p style={{ color: '#64748b', fontSize: '11px', margin: 0 }}>Cloud-Based Scheduling</p>
            </div>
          </div>

          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: '0 0 4px' }}>Create Account 🚀</h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Fill in your details to get started</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: '12px', padding: '11px 14px', marginBottom: '16px', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={ls.label}>👤 FULL NAME</label>
              <input
                style={ls.input} type="text"
                placeholder="Enter your full name"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={ls.label}>📧 EMAIL ADDRESS</label>
              <input
                style={ls.input} type="email"
                placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={ls.label}>🔑 PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...ls.input, paddingRight: '48px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={ls.eyeBtn}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={ls.label}>🔒 CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...ls.input, paddingRight: '48px' }}
                  type={showCon ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                />
                <button type="button" onClick={() => setShowCon(!showCon)} style={ls.eyeBtn}>
                  {showCon ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: password.length >= i*2 ? (password.length < 4 ? '#f43f5e' : password.length < 8 ? '#f59e0b' : '#10b981') : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                  ))}
                </div>
                <p style={{ color: password.length < 4 ? '#f43f5e' : password.length < 8 ? '#f59e0b' : '#10b981', fontSize: '11px', margin: 0 }}>
                  {password.length < 4 ? 'Weak' : password.length < 8 ? 'Medium' : 'Strong'} password
                </p>
              </div>
            )}

            <button className="reg-btn" type="submit" style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(79,70,229,0.4)', marginBottom: '20px' }}>
              Create Account <span style={{ fontSize: '18px' }}>→</span>
            </button>

          </form>

          {/* Features pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
            {[
              { icon: '✅', text: 'Free'       },
              { icon: '☁️', text: 'Cloud'      },
              { icon: '🔒', text: 'Secure'     },
              { icon: '📅', text: 'Smart Cal'  },
            ].map((f,i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '20px', padding: '4px 10px' }}>
                <span style={{ fontSize: '12px' }}>{f.icon}</span>
                <span style={{ color: '#a5b4fc', fontSize: '11px', fontWeight: '600' }}>{f.text}</span>
              </div>
            ))}
          </div>

          <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'none', borderBottom: '1px solid rgba(129,140,248,0.3)' }}>
              Sign in here →
            </Link>
          </p>

        </div>
      </div>

      <style>{`
        @media(min-width:769px){ .mob-logo-reg{ display:none !important; } }
        @media(max-width:768px){ .mob-logo-reg{ display:flex !important; } }
      `}</style>

    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', background: '#07060f', position: 'relative', overflow: 'hidden' },
  bg:   { position: 'fixed', inset: 0, background: 'linear-gradient(135deg,#07060f 0%,#0d0b1a 40%,#0a0f1e 100%)', zIndex: 0 },
  orb1: { position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,70,229,0.15),transparent 70%)', top: '-100px', left: '-100px', animation: 'pulse 6s ease-in-out infinite' },
  orb2: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12),transparent 70%)', bottom: '-80px', right: '-80px', animation: 'pulse 8s ease-in-out infinite' },
  orb3: { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)', top: '40%', left: '40%', animation: 'pulse 10s ease-in-out infinite' },
}

const ls = {
  label:  { color: '#94a3b8', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' },
  input:  { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.2s', display: 'block' },
  eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' },
}