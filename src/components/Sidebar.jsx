import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '📅', label: 'Calendar', path: '/calendar' },
  { icon: '➕', label: 'Add Schedule', path: '/add' },
  { icon: '📁', label: 'My Schedules', path: '/schedules' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>🗓️</span>
        <span style={styles.logoText}>SmartSched</span>
      </div>

      <div style={styles.userBox}>
        <div style={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <p style={styles.userName}>{user?.name || 'User'}</p>
          <p style={styles.userEmail}>{user?.email || ''}</p>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(location.pathname === item.path ? styles.navActive : {})
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button onClick={logout} style={styles.logoutBtn}>
        🚪 Logout
      </button>
    </div>
  )
}

const styles = {
  sidebar: {
    width: '240px', minHeight: '100vh', background: '#1e1b4b',
    display: 'flex', flexDirection: 'column', padding: '24px 16px',
    position: 'fixed', left: 0, top: 0, zIndex: 100
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' },
  logoIcon: { fontSize: '28px' },
  logoText: { color: '#fff', fontSize: '20px', fontWeight: '700' },
  userBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '12px', marginBottom: '32px'
  },
  avatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: '#4f46e5', color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '18px'
  },
  userName: { color: '#fff', fontWeight: '600', fontSize: '14px', margin: 0 },
  userEmail: { color: '#a5b4fc', fontSize: '11px', margin: 0 },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px', borderRadius: '10px', color: '#a5b4fc',
    textDecoration: 'none', fontSize: '15px', transition: 'all 0.2s'
  },
  navActive: { background: '#4f46e5', color: '#fff' },
  navIcon: { fontSize: '18px' },
  logoutBtn: {
    background: 'rgba(239,68,68,0.15)', color: '#fca5a5',
    border: 'none', borderRadius: '10px', padding: '12px 16px',
    cursor: 'pointer', fontSize: '14px', textAlign: 'left',
    marginTop: 'auto'
  }
}