import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// This component wraps any page or button
// and blocks access if user lacks permission
export default function RBACGuard({ permission, children, fallback }) {
  const { can } = useAuth()

  if (!can(permission)) {
    return fallback || <AccessDeniedInline />
  }

  return children
}

// Inline small denied message for buttons/sections
function AccessDeniedInline() {
  return (
    <div style={styles.denied}>
      <span style={{ fontSize: '20px' }}>🔒</span>
      <p style={styles.deniedText}>You don't have permission for this action.</p>
    </div>
  )
}

// Full page denied for route protection
export function PageGuard({ permission, children }) {
  const { can, user } = useAuth()
  const navigate      = useNavigate()

  if (!can(permission)) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.lockIcon}>🔒</div>
          <h2 style={styles.title}>Access Denied</h2>
          <p style={styles.sub}>
            Your role <strong style={{ color: '#818cf8' }}>({user?.role})</strong> does
            not have permission to access this page.
          </p>
          <div style={styles.permBox}>
            <p style={styles.permLabel}>Required permission:</p>
            <code style={styles.permCode}>{permission}</code>
          </div>
          <button style={styles.btn} onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return children
}

const styles = {
  // Inline denied
  denied: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#2d1b1b', borderRadius: '10px',
    padding: '12px 16px', border: '1px solid #f43f5e33'
  },
  deniedText: { color: '#f87171', fontSize: '13px', margin: 0 },

  // Full page denied
  page: {
    minHeight: '100vh', background: '#0f0e17',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  card: {
    background: '#13111f', borderRadius: '20px',
    border: '1px solid #2a2740', padding: '48px',
    textAlign: 'center', maxWidth: '440px', width: '100%'
  },
  lockIcon: { fontSize: '56px', marginBottom: '16px' },
  title:    { color: '#fff', fontSize: '26px', fontWeight: '700', marginBottom: '12px' },
  sub:      { color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' },
  permBox:  {
    background: '#1a1828', borderRadius: '10px',
    padding: '14px', marginBottom: '24px'
  },
  permLabel: { color: '#64748b', fontSize: '12px', marginBottom: '6px' },
  permCode:  {
    background: '#0f0e17', color: '#818cf8',
    padding: '4px 12px', borderRadius: '6px',
    fontSize: '13px', fontFamily: 'monospace'
  },
  btn: {
    background: '#4f46e5', color: '#fff', border: 'none',
    borderRadius: '10px', padding: '12px 32px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer'
  },
}