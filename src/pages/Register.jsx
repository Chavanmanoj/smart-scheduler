import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const { register }            = useAuth()
  const navigate                = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password || !confirm) {
      setError('Please fill all fields')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    const result = register(name, email, password)
    if (!result.success) {
      setError(result.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div style={styles.page}>

      {/* LEFT */}
      <div style={styles.left}>
        <div style={{ marginBottom: '48px' }}>
          <span style={{ fontSize: '56px' }}>🗓️</span>
          <h1 style={styles.brandName}>SmartScheduler</h1>
          <p style={styles.brandSub}>Create your free account today</p>
        </div>
        {[
          { icon: '✅', text: 'Free to use'                    },
          { icon: '☁️', text: 'Cloud-Based Architecture'       },
          { icon: '📅', text: 'Manage all your schedules'      },
          { icon: '🔒', text: 'Secure & private'               },
        ].map((f, i) => (
          <div key={i} style={styles.feature}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <span style={styles.featureText}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Account 🚀</h2>
          <p style={styles.sub}>Fill in your details to get started</p>

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <form onSubmit={handleRegister}>
            <p style={styles.label}>Full Name</p>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <p style={styles.label}>Email</p>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <p style={styles.label}>Password</p>
            <input
              style={styles.input}
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <p style={styles.label}>Confirm Password</p>
            <input
              style={styles.input}
              type="password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
            <button style={styles.btn} type="submit">
              Create Account →
            </button>
          </form>

          <p style={styles.loginLink}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8' }}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page:       { display: 'flex', minHeight: '100vh', background: '#0f0e17' },
  left:       { flex: 1, background: '#13111f', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid #2a2740' },
  brandName:  { color: '#fff', fontSize: '32px', fontWeight: '700', margin: '12px 0 8px' },
  brandSub:   { color: '#64748b', fontSize: '16px' },
  feature:    { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px' },
  featureIcon:{ fontSize: '20px', width: '44px', height: '44px', background: '#1e1b4b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  featureText:{ color: '#94a3b8', fontSize: '15px' },
  right:      { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' },
  card:       { background: '#13111f', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', border: '1px solid #2a2740' },
  title:      { color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 4px' },
  sub:        { color: '#64748b', fontSize: '14px', marginBottom: '24px' },
  errorBox:   { background: '#2d1b1b', color: '#f87171', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', border: '1px solid #f43f5e44' },
  label:      { color: '#94a3b8', fontSize: '13px', fontWeight: '600', marginBottom: '6px', marginTop: '0' },
  input:      { width: '100%', background: '#1a1828', border: '1px solid #2a2740', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none', marginBottom: '16px', display: 'block', boxSizing: 'border-box' },
  btn:        { width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  loginLink:  { color: '#64748b', fontSize: '13px', textAlign: 'center', marginTop: '20px' },
}