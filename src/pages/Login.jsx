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
    <div style={styles.page}>

      {/* ── BACKGROUND ── */}
      <div style={styles.bg}>
        {/* Animated floating cards in background */}
        <div style={{ ...styles.floatCard, top: '8%', left: '5%', animationDelay: '0s' }}>
          <span style={styles.floatIcon}>📅</span>
          <span style={styles.floatText}>Schedule Meeting</span>
          <span style={styles.floatDate}>Today 2:00 PM</span>
        </div>
        <div style={{ ...styles.floatCard, top: '20%', left: '3%', animationDelay: '0.5s' }}>
          <span style={styles.floatIcon}>🔔</span>
          <span style={styles.floatText}>Lab Practical</span>
          <span style={styles.floatDate}>Tomorrow 9:00 AM</span>
        </div>
        <div style={{ ...styles.floatCard, top: '38%', left: '6%', animationDelay: '1s' }}>
          <span style={styles.floatIcon}>📚</span>
          <span style={styles.floatText}>Cloud Computing</span>
          <span style={styles.floatDate}>Mon 10:00 AM</span>
        </div>
        <div style={{ ...styles.floatCard, top: '55%', left: '4%', animationDelay: '1.5s' }}>
          <span style={styles.floatIcon}>✅</span>
          <span style={styles.floatText}>UI/UX Assignment</span>
          <span style={styles.floatDate}>Tue 11:59 PM</span>
        </div>
        <div style={{ ...styles.floatCard, top: '70%', left: '7%', animationDelay: '2s' }}>
          <span style={styles.floatIcon}>🔒</span>
          <span style={styles.floatText}>Access Control</span>
          <span style={styles.floatDate}>Wed 4:00 PM</span>
        </div>

        {/* Right side float cards */}
        <div style={{ ...styles.floatCard, top: '12%', right: '5%', left: 'auto', animationDelay: '0.3s' }}>
          <span style={styles.floatIcon}>☁️</span>
          <span style={styles.floatText}>Cloud Sync</span>
          <span style={styles.floatDate}>Active Now</span>
        </div>
        <div style={{ ...styles.floatCard, top: '28%', right: '4%', left: 'auto', animationDelay: '0.8s' }}>
          <span style={styles.floatIcon}>📊</span>
          <span style={styles.floatText}>Weekly Report</span>
          <span style={styles.floatDate}>3 tasks done</span>
        </div>
        <div style={{ ...styles.floatCard, top: '45%', right: '6%', left: 'auto', animationDelay: '1.3s' }}>
          <span style={styles.floatIcon}>🗓️</span>
          <span style={styles.floatText}>March 2026</span>
          <span style={styles.floatDate}>5 events</span>
        </div>
        <div style={{ ...styles.floatCard, top: '62%', right: '5%', left: 'auto', animationDelay: '1.8s' }}>
          <span style={styles.floatIcon}>⏰</span>
          <span style={styles.floatText}>Reminder Set</span>
          <span style={styles.floatDate}>30 min before</span>
        </div>

        {/* Glow orbs */}
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.orb3} />
      </div>

      {/* ── LOGIN BOX ── */}
      <div style={styles.center}>
        <div style={styles.card}>

          {/* Logo */}
          <div style={styles.logoBox}>
            <div style={styles.logoIcon}>🗓️</div>
            <div>
              <h1 style={styles.logoTitle}>SmartScheduler</h1>
              <p style={styles.logoSub}>Cloud-Based Scheduling Platform</p>
            </div>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          <h2 style={styles.title}>Welcome Back 👋</h2>
          <p style={styles.subtitle}>Sign in to manage your schedules</p>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>

            {/* Email field */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>📧 Email Address</label>
              <div style={styles.inputWrap}>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>🔑 Password</label>
              <div style={styles.inputWrap}>
                <input
                  style={{ ...styles.input, paddingRight: '48px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={styles.eyeBtn}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <button style={styles.signInBtn} type="submit">
              <span>Sign In</span>
              <span style={styles.btnArrow}>→</span>
            </button>

          </form>

          {/* Features row */}
          <div style={styles.featuresRow}>
            {[
              { icon: '☁️', text: 'Cloud Sync'   },
              { icon: '🔒', text: 'Secure RBAC'  },
              { icon: '📤', text: 'ICS Export'   },
              { icon: '📅', text: 'Smart Cal'    },
            ].map((f, i) => (
              <div key={i} style={styles.featurePill}>
                <span style={{ fontSize: '14px' }}>{f.icon}</span>
                <span style={styles.featurePillText}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Register link */}
          <p style={styles.registerTxt}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.registerLink}>
              Create one free →
            </Link>
          </p>

        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(20px); }
          20%  { opacity: 1; transform: translateY(0px);  }
          80%  { opacity: 1; transform: translateY(0px);  }
          100% { opacity: 0; transform: translateY(-20px);}
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.1); opacity: 0.6; }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%;   }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%;   }
        }
        .signin-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 30px rgba(79,70,229,0.5) !important;
        }
        .signin-btn:active {
          transform: translateY(0px) !important;
        }
        input:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.15) !important;
        }
      `}</style>

    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0914',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // Background
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #0a0914 0%, #0f0e1f 40%, #130d1f 70%, #0a0914 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 12s ease infinite',
  },

  // Glow orbs
  orb1: {
    position: 'absolute', width: '500px', height: '500px',
    borderRadius: '50%', top: '-100px', left: '-100px',
    background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
    animation: 'pulse 6s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute', width: '400px', height: '400px',
    borderRadius: '50%', bottom: '-80px', right: '-80px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
    animation: 'pulse 8s ease-in-out infinite',
  },
  orb3: {
    position: 'absolute', width: '300px', height: '300px',
    borderRadius: '50%', top: '40%', left: '40%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
    animation: 'pulse 10s ease-in-out infinite',
  },

  // Floating schedule cards
  floatCard: {
    position: 'absolute',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    animation: 'floatUp 4s ease-in-out infinite',
    minWidth: '160px',
  },
  floatIcon:  { fontSize: '16px' },
  floatText:  { color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '600' },
  floatDate:  { color: 'rgba(255,255,255,0.35)', fontSize: '10px' },

  // Center login box
  center: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '460px',
    padding: '20px',
  },

  // Card
  card: {
    background: 'rgba(19,17,31,0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: `
      0 0 0 1px rgba(79,70,229,0.15),
      0 20px 60px rgba(0,0,0,0.5),
      0 0 80px rgba(79,70,229,0.08),
      inset 0 1px 0 rgba(255,255,255,0.06)
    `,
  },

  // Logo
  logoBox: {
    display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px'
  },
  logoIcon: {
    width: '52px', height: '52px', borderRadius: '14px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '26px',
    boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
  },
  logoTitle: {
    color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0,
    background: 'linear-gradient(135deg, #fff, #a5b4fc)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  logoSub: { color: '#64748b', fontSize: '11px', margin: '2px 0 0' },

  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
    marginBottom: '20px',
  },

  title:    { color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 4px' },
  subtitle: { color: '#64748b', fontSize: '13px', marginBottom: '20px' },

  // Error
  errorBox: {
    background: 'rgba(239,68,68,0.1)', color: '#fca5a5',
    borderRadius: '10px', padding: '11px 14px',
    marginBottom: '16px', fontSize: '13px',
    border: '1px solid rgba(239,68,68,0.2)',
    display: 'flex', alignItems: 'center', gap: '8px',
  },

  // Form
  fieldGroup: { marginBottom: '16px' },
  label:      { color: '#94a3b8', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '7px', letterSpacing: '0.5px' },
  inputWrap:  { position: 'relative' },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', padding: '13px 16px',
    color: '#fff', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', transition: 'all 0.2s',
    display: 'block',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%',
    transform: 'translateY(-50%)', background: 'transparent',
    border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px',
  },

  // Sign in button
  signInBtn: {
    width: '100%',
    padding: '14px',
    marginTop: '4px',
    marginBottom: '20px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease infinite',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
    letterSpacing: '0.5px',
  },
  btnArrow: { fontSize: '18px', transition: 'transform 0.2s' },

  // Features pills row
  featuresRow: {
    display: 'flex', gap: '8px', flexWrap: 'wrap',
    justifyContent: 'center', marginBottom: '20px',
  },
  featurePill: {
    display: 'flex', alignItems: 'center', gap: '5px',
    background: 'rgba(79,70,229,0.1)',
    border: '1px solid rgba(79,70,229,0.2)',
    borderRadius: '20px', padding: '5px 12px',
  },
  featurePillText: { color: '#a5b4fc', fontSize: '11px', fontWeight: '600' },

  // Register
  registerTxt:  { color: '#64748b', fontSize: '13px', textAlign: 'center', margin: 0 },
  registerLink: {
    color: '#818cf8', fontWeight: '600', textDecoration: 'none',
    borderBottom: '1px solid rgba(129,140,248,0.3)',
  },
}