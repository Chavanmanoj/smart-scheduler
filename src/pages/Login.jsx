import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter email and password'); return }
    const result = login(email, password)
    if (!result.success) { setError(result.message); return }
    navigate('/dashboard')
  }

  return (
    <div style={s.page}>
      <style>{`
        @keyframes floatUp {
          0%  { opacity:0; transform:translateY(30px); }
          20% { opacity:1; transform:translateY(0); }
          80% { opacity:1; transform:translateY(0); }
          100%{ opacity:0; transform:translateY(-30px); }
        }
        @keyframes gradShift {
          0%  { background-position:0% 50%; }
          50% { background-position:100% 50%; }
          100%{ background-position:0% 50%; }
        }
        @keyframes pulse {
          0%,100%{ transform:scale(1); opacity:0.4; }
          50%    { transform:scale(1.1); opacity:0.6; }
        }
        @keyframes fadeIn {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0); }
        }
        input:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.2) !important;
          outline: none !important;
        }
        .signin-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(79,70,229,0.55) !important;
        }

        /* Desktop: two column */
        @media(min-width:769px){
          .login-left  { display:flex !important; }
          .login-right { width:50% !important; }
          .float-cards { display:block !important; }
        }

        /* Mobile: single column, no float cards */
        @media(max-width:768px){
          .login-left  { display:none !important; }
          .login-right { width:100% !important; min-height:100vh !important; justify-content:center !important; padding:24px 16px !important; }
          .login-card  { max-width:100% !important; padding:28px 20px !important; }
          .float-cards { display:none !important; }
          .orb1, .orb2, .orb3 { width:200px !important; height:200px !important; }
        }
      `}</style>

      {/* Background */}
      <div style={s.bg}>
        <div className="orb1" style={s.orb1} />
        <div className="orb2" style={s.orb2} />
        <div className="orb3" style={s.orb3} />
      </div>

      {/* Floating cards — desktop only */}
      <div className="float-cards" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {[
          { top: '8%',  left: '3%',  icon: '📅', text: 'Team Meeting',    sub: 'Today 2:00 PM',   delay: '0s'   },
          { top: '22%', left: '2%',  icon: '🔔', sub: 'Tomorrow 9:00 AM', text: 'Morning Standup', delay: '0.6s' },
          { top: '38%', left: '4%',  icon: '📚', text: 'Study Session',   sub: 'Mon 10:00 AM',    delay: '1.2s' },
          { top: '55%', left: '2%',  icon: '✅', text: 'Assignment Due',  sub: 'Tue 11:59 PM',    delay: '1.8s' },
          { top: '70%', left: '3%',  icon: '🔒', text: 'Access Control',  sub: 'Wed 4:00 PM',     delay: '2.4s' },
          { top: '10%', right: '3%', icon: '☁️', text: 'Cloud Sync',      sub: 'Active Now',      delay: '0.3s' },
          { top: '26%', right: '2%', icon: '📊', text: 'Weekly Report',   sub: '3 tasks done',    delay: '0.9s' },
          { top: '44%', right: '3%', icon: '🗓️', text: 'March 2026',      sub: '5 events',        delay: '1.5s' },
          { top: '62%', right: '2%', icon: '⏰', text: 'Reminder Set',    sub: '30 min before',   delay: '2.1s' },
        ].map((f, i) => (
          <div key={i} style={{ position: 'absolute', top: f.top, left: f.left, right: f.right, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '10px 14px', minWidth: '160px', animation: `floatUp 4s ease-in-out ${f.delay} infinite`, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '16px' }}>{f.icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '600' }}>{f.text}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{f.sub}</span>
          </div>
        ))}
      </div>

      {/* Left side — desktop only */}
      <div className="login-left" style={{ display: 'none', width: '50%', background: 'rgba(10,9,20,0.6)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '60px 48px', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '48px', animation: 'fadeIn 0.6s ease' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(79,70,229,0.5)' }}>🗓️</div>
          <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-1px' }}>
            Smart <span style={{ color: '#818cf8' }}>Scheduler</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Cloud-Based Scheduling Platform</p>
        </div>
        {[
          { icon: '☁️', text: 'Cloud-Based Architecture'    },
          { icon: '📅', text: 'Smart Calendar Management'   },
          { icon: '📤', text: 'ICS File Export & Import'    },
          { icon: '🔒', text: 'RBAC Access Control (ICS)'   },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', animation: `fadeIn 0.6s ease ${i*0.1}s both` }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(79,70,229,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid rgba(79,70,229,0.2)', flexShrink: 0 }}>{f.icon}</div>
            <span style={{ color: '#94a3b8', fontSize: '15px' }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Right side — login form */}
      <div className="login-right" style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', position: 'relative', zIndex: 2 }}>
        <div className="login-card" style={{ background: 'rgba(13,12,24,0.9)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 0 1px rgba(79,70,229,0.15),0 20px 60px rgba(0,0,0,0.5),0 0 80px rgba(79,70,229,0.08)', animation: 'fadeIn 0.5s ease' }}>

          {/* Mobile logo */}
          <div style={{ display: 'none', alignItems: 'center', gap: '12px', marginBottom: '24px' }} className="mobile-logo">
            <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🗓️</div>
            <div>
              <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: 0 }}>Smart <span style={{ color: '#818cf8' }}>Scheduler</span></p>
              <p style={{ color: '#64748b', fontSize: '11px', margin: 0 }}>Cloud-Based Scheduling</p>
            </div>
          </div>

          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 4px' }}>Welcome Back 👋</h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>Sign in to manage your schedules</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '7px', letterSpacing: '0.5px' }}>📧 EMAIL ADDRESS</label>
              <input
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '13px 16px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.2s', display: 'block' }}
                type="email" placeholder="Enter your email"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '7px', letterSpacing: '0.5px' }}>🔑 PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '13px 48px 13px 16px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.2s', display: 'block' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button className="signin-btn" type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(79,70,229,0.4)', marginBottom: '20px', letterSpacing: '0.3px' }}>
              Sign In <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </form>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
            {[
              { icon: '☁️', text: 'Cloud Sync'  },
              { icon: '🔒', text: 'Secure RBAC' },
              { icon: '📤', text: 'ICS Export'  },
              { icon: '📅', text: 'Smart Cal'   },
            ].map((f,i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '20px', padding: '5px 12px' }}>
                <span style={{ fontSize: '13px' }}>{f.icon}</span>
                <span style={{ color: '#a5b4fc', fontSize: '11px', fontWeight: '600' }}>{f.text}</span>
              </div>
            ))}
          </div>

          <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: '600', textDecoration: 'none', borderBottom: '1px solid rgba(129,140,248,0.3)' }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .mobile-logo { display:flex !important; }
        }
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