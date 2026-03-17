import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ALL_PERMISSIONS = [
  'view_own_schedules', 'view_all_schedules', 'create_schedule',
  'edit_own_schedule',  'edit_any_schedule',  'delete_own_schedule',
  'delete_any_schedule','export_ics',         'view_users',
  'manage_users',       'view_logs',          'access_admin',
]

const ROLE_PERMISSIONS = {
  admin:   ['view_own_schedules','view_all_schedules','create_schedule','edit_own_schedule','edit_any_schedule','delete_own_schedule','delete_any_schedule','export_ics','view_users','manage_users','view_logs','access_admin'],
  teacher: ['view_own_schedules','view_all_schedules','create_schedule','edit_own_schedule','delete_own_schedule','export_ics','view_users'],
  student: ['view_own_schedules','create_schedule','edit_own_schedule','delete_own_schedule','export_ics'],
}

const ROLE_INFO = {
  admin:   { label: 'Admin',   icon: '👑', color: '#f43f5e', bg: '#2d1b1b', desc: 'Full system access. Can manage all users and schedules.' },
  teacher: { label: 'Teacher', icon: '👨‍🏫', color: '#f59e0b', bg: '#2d2010', desc: 'Can view all schedules, create and manage own schedules.' },
  student: { label: 'Student', icon: '👨‍🎓', color: '#10b981', bg: '#0d2d24', desc: 'Can only view and manage own schedules.' },
}

export default function RBACDemo() {
  const { user, can, myPermissions, logout } = useAuth()
  const navigate  = useNavigate()
  const roleInfo  = ROLE_INFO[user?.role] || {}
  const myPerms   = myPermissions()

  const liveTests = [
    { label: 'Can view all schedules?',  perm: 'view_all_schedules'  },
    { label: 'Can delete any schedule?', perm: 'delete_any_schedule' },
    { label: 'Can manage users?',        perm: 'manage_users'        },
    { label: 'Can export ICS file?',     perm: 'export_ics'          },
    { label: 'Can access admin panel?',  perm: 'access_admin'        },
    { label: 'Can view access logs?',    perm: 'view_logs'           },
  ]

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logoRow}>
          <span style={{ fontSize: '28px' }}>🗓️</span>
          <span style={styles.logoText}>SmartSched</span>
        </div>
        <div style={styles.userBox}>
          <div style={{ ...styles.avatar, background: roleInfo.color + '30', color: roleInfo.color }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={styles.userName}>{user?.name}</p>
            <p style={{ color: roleInfo.color, fontSize: '11px', margin: 0, fontWeight: '600' }}>
              {roleInfo.icon} {roleInfo.label}
            </p>
          </div>
        </div>
        {[
          { icon: '🏠', label: 'Dashboard',    path: '/dashboard' },
          { icon: '📅', label: 'Calendar',     path: '/calendar'  },
          { icon: '➕', label: 'Add Schedule', path: '/add'       },
          { icon: '📁', label: 'My Schedules', path: '/schedules' },
          { icon: '🔐', label: 'RBAC Demo',    path: '/rbac'      },
          { icon: '👑', label: 'Admin Panel',  path: '/admin'     },
        ].map((item, i) => (
          <div key={i} onClick={() => navigate(item.path)} style={{
            ...styles.navItem,
            ...(item.path === '/rbac' ? styles.navActive : {})
          }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div onClick={logout} style={styles.logoutBtn}>🚪 Logout</div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>

        <div style={styles.topBar}>
          <div>
            <h1 style={styles.heading}>🔐 RBAC Demo</h1>
            <p style={styles.sub}>Role-Based Access Control — Information Cyber Security</p>
          </div>
          <div style={{ ...styles.roleBadge, background: roleInfo.bg, color: roleInfo.color, border: `1px solid ${roleInfo.color}44` }}>
            {roleInfo.icon} {roleInfo.label}
          </div>
        </div>

        {/* Theory */}
        <div style={styles.box}>
          <h3 style={styles.boxTitle}>📚 What is RBAC?</h3>
          <p style={styles.theoryText}>
            <strong style={{ color: '#818cf8' }}>Role-Based Access Control (RBAC)</strong> is
            a security model where permissions are assigned to <strong style={{ color: '#fff' }}>roles</strong>,
            and users are assigned to roles. A user gets access only if their role
            has the required permission.
          </p>
          <div style={styles.pointsGrid}>
            {[
              { icon: '👤', text: 'Users are assigned one role'                  },
              { icon: '🏷️', text: 'Roles hold a set of permissions'              },
              { icon: '🔑', text: 'Permissions grant access to specific actions' },
              { icon: '🚫', text: 'Access denied if role lacks the permission'   },
            ].map((p, i) => (
              <div key={i} style={styles.point}>
                <span style={{ fontSize: '18px' }}>{p.icon}</span>
                <span style={styles.pointText}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Matrix */}
        <div style={styles.box}>
          <h3 style={styles.boxTitle}>📊 Permission Matrix</h3>
          <div style={styles.matrixWrap}>
            <div style={styles.matrixHeader}>
              <span style={{ flex: 3 }}>Permission</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#f43f5e' }}>👑 Admin</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#f59e0b' }}>👨‍🏫 Teacher</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#10b981' }}>👨‍🎓 Student</span>
            </div>
            {ALL_PERMISSIONS.map((perm, i) => (
              <div key={perm} style={{ ...styles.matrixRow, background: i % 2 === 0 ? '#1a1828' : '#13111f' }}>
                <span style={{ flex: 3 }}>
                  <code style={styles.permCode}>{perm}</code>
                </span>
                <span style={{ flex: 1, textAlign: 'center' }}>{ROLE_PERMISSIONS.admin.includes(perm)   ? '✅' : '❌'}</span>
                <span style={{ flex: 1, textAlign: 'center' }}>{ROLE_PERMISSIONS.teacher.includes(perm) ? '✅' : '❌'}</span>
                <span style={{ flex: 1, textAlign: 'center' }}>{ROLE_PERMISSIONS.student.includes(perm) ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Your permissions */}
        <div style={styles.box}>
          <h3 style={styles.boxTitle}>
            🔑 Your Permissions
            <span style={{ ...styles.chip, background: roleInfo.color + '20', color: roleInfo.color }}>
              {myPerms.length} / {ALL_PERMISSIONS.length} granted
            </span>
          </h3>
          <div style={styles.permsGrid}>
            {ALL_PERMISSIONS.map(perm => {
              const granted = can(perm)
              return (
                <div key={perm} style={{
                  ...styles.permCard,
                  background: granted ? '#0d2d24' : '#1a1828',
                  border:     `1px solid ${granted ? '#10b98133' : '#2a2740'}`,
                  opacity:    granted ? 1 : 0.45,
                }}>
                  <span>{granted ? '✅' : '🔒'}</span>
                  <code style={{ fontSize: '10px', color: granted ? '#10b981' : '#64748b', wordBreak: 'break-all' }}>
                    {perm}
                  </code>
                </div>
              )
            })}
          </div>
        </div>

        {/* Live Test */}
        <div style={styles.box}>
          <h3 style={styles.boxTitle}>🧪 Live Permission Test</h3>
          <div style={styles.testGrid}>
            {liveTests.map((test, i) => {
              const result = can(test.perm)
              return (
                <div key={i} style={{
                  ...styles.testCard,
                  background:  result ? '#0d2d24' : '#2d1b1b',
                  borderColor: result ? '#10b98133' : '#f43f5e33',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '22px' }}>{result ? '✅' : '❌'}</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: result ? '#10b981' : '#f43f5e' }}>
                      {result ? 'ALLOWED' : 'DENIED'}
                    </span>
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '500', margin: '8px 0 4px' }}>{test.label}</p>
                  <code style={{ color: '#64748b', fontSize: '10px' }}>{test.perm}</code>
                </div>
              )
            })}
          </div>
        </div>

        {/* All roles */}
        <div style={styles.box}>
          <h3 style={styles.boxTitle}>👥 All Roles</h3>
          <div style={styles.rolesGrid}>
            {Object.entries(ROLE_INFO).map(([role, info]) => (
              <div key={role} style={{
                ...styles.roleCard,
                border: `1px solid ${info.color}44`,
                ...(user?.role === role ? { boxShadow: `0 0 0 2px ${info.color}` } : {})
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px' }}>{info.icon}</span>
                  <div>
                    <p style={{ color: info.color, fontSize: '16px', fontWeight: '700', margin: 0 }}>{info.label}</p>
                    {user?.role === role && (
                      <span style={{ background: info.color + '20', color: info.color, padding: '1px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '600' }}>
                        ← You
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>{info.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ROLE_PERMISSIONS[role].map(p => (
                    <span key={p} style={{ background: info.color + '15', color: info.color, padding: '2px 8px', borderRadius: '6px', fontSize: '10px' }}>
                      {p.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

const styles = {
  page:     { display: 'flex', minHeight: '100vh', background: '#0f0e17' },
  sidebar:  { width: '240px', minHeight: '100vh', background: '#13111f', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px', position: 'fixed', left: 0, top: 0, borderRight: '1px solid #2a2740' },
  logoRow:  { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' },
  logoText: { color: '#fff', fontSize: '20px', fontWeight: '700' },
  userBox:  { display: 'flex', alignItems: 'center', gap: '10px', background: '#1e1b4b', borderRadius: '12px', padding: '12px', marginBottom: '16px', border: '1px solid #2e2b5e' },
  avatar:   { width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
  userName: { color: '#fff', fontWeight: '600', fontSize: '13px', margin: 0 },
  navItem:  { display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', color: '#94a3b8', fontSize: '14px', cursor: 'pointer' },
  navActive:{ background: '#4f46e5', color: '#fff' },
  logoutBtn:{ marginTop: 'auto', padding: '11px 14px', borderRadius: '10px', color: '#f87171', background: '#2d1b1b', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
  main:     { marginLeft: '240px', padding: '32px', flex: 1 },
  topBar:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading:  { fontSize: '26px', fontWeight: '700', color: '#fff' },
  sub:      { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  roleBadge:{ padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '700' },
  box:      { background: '#13111f', borderRadius: '16px', border: '1px solid #2a2740', padding: '24px', marginBottom: '24px' },
  boxTitle: { color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  chip:     { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  theoryText: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' },
  pointsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' },
  point:      { display: 'flex', gap: '10px', alignItems: 'center', background: '#1a1828', borderRadius: '10px', padding: '10px 14px' },
  pointText:  { color: '#94a3b8', fontSize: '13px' },
  matrixWrap: { borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2740' },
  matrixHeader:{ display: 'flex', gap: '16px', padding: '12px 16px', background: '#1e1b4b', color: '#64748b', fontSize: '12px', fontWeight: '600' },
  matrixRow:  { display: 'flex', gap: '16px', padding: '10px 16px', borderBottom: '1px solid #1e1c2e', fontSize: '13px' },
  permCode:   { background: '#0f0e17', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' },
  permsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' },
  permCard:   { borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' },
  testGrid:   { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' },
  testCard:   { borderRadius: '12px', padding: '16px', border: '1px solid' },
  rolesGrid:  { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' },
  roleCard:   { background: '#1a1828', borderRadius: '14px', padding: '20px' },
}