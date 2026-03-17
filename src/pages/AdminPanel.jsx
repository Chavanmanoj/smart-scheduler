import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_COLOR = (r) =>
  r === 'admin' ? '#f43f5e' : r === 'teacher' ? '#f59e0b' : '#10b981'

const ROLE_PERMISSIONS = {
  admin:   ['View All','Add','Delete Any','Manage Users','Export','View Logs'],
  teacher: ['View All','Add','Delete Own','Export','View Users'],
  student: ['View Own','Add','Delete Own','Export'],
}

const defaultSchedules = [
  { id: 1, title: 'Team Standup',     date: '2026-03-15', time: '10:00', category: 'Meeting',  color: '#10b981', owner: 'admin@smart.com',   ownerName: 'Admin'        },
  { id: 2, title: 'Project Deadline', date: '2026-03-16', time: '23:59', category: 'Deadline', color: '#f43f5e', owner: 'teacher@smart.com', ownerName: 'Prof. Sharma' },
  { id: 3, title: 'Workshop Session', date: '2026-03-17', time: '14:00', category: 'Study',    color: '#06b6d4', owner: 'student@smart.com', ownerName: 'Manoj Chavan' },
]

const accessLogs = [
  { user: 'Admin',        email: 'admin@smart.com',   action: 'Logged in',         time: '2026-03-14 09:00', role: 'admin'   },
  { user: 'Prof. Sharma', email: 'teacher@smart.com', action: 'Added schedule',    time: '2026-03-14 10:30', role: 'teacher' },
  { user: 'Manoj Chavan', email: 'student@smart.com', action: 'Exported ICS file', time: '2026-03-14 11:05', role: 'student' },
]

export default function AdminPanel() {
  const { user, logout, can } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab]                     = useState('users')
  const [users, setUsers]                 = useState([])
  const [selectedUser, setSelectedUser]   = useState(null)
  const [allSchedules, setAllSchedules]   = useState([])
  const [roleModal, setRoleModal]         = useState(null)
  const [newRole, setNewRole]             = useState('')
  const [successMsg, setSuccessMsg]       = useState('')
  const [sortBy, setSortBy]               = useState('name') // name | date | role
  const [sortDir, setSortDir]             = useState('asc')
  const [searchUser, setSearchUser]       = useState('')

  useEffect(() => {
    loadUsers()
    const saved = JSON.parse(localStorage.getItem('schedules') || '[]')
    setAllSchedules([...defaultSchedules, ...saved])
  }, [])

  const loadUsers = () => {
    const registered = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const adminUser  = {
      id: 0, name: 'Admin', email: 'admin@smart.com',
      role: 'admin', joined: '2026-01-01',
    }
    setUsers([adminUser, ...registered])
  }

  if (!can('access_admin')) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#07060f,#0d0b1a,#0a0f1e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', padding: '48px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <p style={{ fontSize: '56px' }}>🔒</p>
          <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', margin: '12px 0 8px' }}>Access Denied</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Your role <strong style={{ color: '#818cf8' }}>({user?.role})</strong> cannot access this page.</p>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 32px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>← Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const handleAssignRole = () => {
    if (!roleModal || !newRole) return
    const registered = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const updated    = registered.map(u => u.email === roleModal.email ? { ...u, role: newRole } : u)
    localStorage.setItem('registeredUsers', JSON.stringify(updated))
    const cur = JSON.parse(localStorage.getItem('smartscheduser') || 'null')
    if (cur && cur.email === roleModal.email) {
      localStorage.setItem('smartscheduser', JSON.stringify({ ...cur, role: newRole }))
    }
    const logs = JSON.parse(localStorage.getItem('loginHistory') || '[]')
    logs.unshift({ name: 'Admin', email: 'admin@smart.com', role: 'admin', action: `Assigned role "${newRole}" to ${roleModal.name}`, time: new Date().toLocaleString() })
    localStorage.setItem('loginHistory', JSON.stringify(logs))
    setSuccessMsg(`✅ Role "${newRole}" assigned to ${roleModal.name}`)
    setTimeout(() => setSuccessMsg(''), 3000)
    setRoleModal(null); setNewRole('')
    loadUsers()
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const p = name.trim().split(' ')
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase()
  }

  const getUserSchedules = (email) => allSchedules.filter(s => s.owner === email)
  const getLogs = (email) => {
    const history = JSON.parse(localStorage.getItem('loginHistory') || '[]')
    return [...accessLogs, ...history].filter(l => l.email === email)
  }

  // Sort + filter users
  const sortedUsers = [...users]
    .filter(u =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
    )
    .sort((a, b) => {
      let valA, valB
      if (sortBy === 'name')  { valA = a.name;   valB = b.name }
      if (sortBy === 'date')  { valA = a.joined || ''; valB = b.joined || '' }
      if (sortBy === 'role')  { valA = a.role;   valB = b.role }
      if (sortDir === 'asc')  return valA > valB ? 1 : -1
      return valA < valB ? 1 : -1
    })

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: '4px', opacity: sortBy === col ? 1 : 0.3, fontSize: '10px' }}>
      {sortBy === col ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )

  const tabs = [
    { id: 'users',     label: '👥 Users'        },
    { id: 'roles',     label: '🔐 Role Manager'  },
    { id: 'data',      label: '📊 User Data'     },
    { id: 'schedules', label: '📋 All Schedules' },
    { id: 'logs',      label: '📝 Access Logs'   },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg,#07060f 0%,#0d0b1a 30%,#0a0f1e 60%,#0d0a18 100%)', position: 'relative', overflow: 'hidden' }}>

      {/* Blobs */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,70,229,0.07),transparent 70%)', top: '-100px', left: '-100px', pointerEvents: 'none', zIndex: 0, animation: 'blobFloat1 18s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.05),transparent 70%)', bottom: '-80px', right: '-80px', pointerEvents: 'none', zIndex: 0, animation: 'blobFloat2 22s ease-in-out infinite' }} />

      <style>{`
        @keyframes blobFloat1 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,-15px);} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(-15px,20px);} }
        @keyframes fadeInUp   { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes slideLeft  { from{transform:translateX(-100%);} to{transform:translateX(0);} }
        .row-hover:hover { background:rgba(255,255,255,0.05) !important; }
        .sort-btn:hover  { background:rgba(79,70,229,0.15) !important; }
        @media(max-width:900px){
          .desk-sb  { display:none !important; }
          .mob-bar  { display:flex !important; }
          .adm-main { margin-left:0 !important; padding:16px !important; }
          .stats-adm{ grid-template-columns:repeat(2,1fr) !important; }
          .tabs-adm { overflow-x:auto !important; flex-wrap:nowrap !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="desk-sb" style={{ width: '268px', minHeight: '100vh', background: 'rgba(10,9,20,0.97)', backdropFilter: 'blur(20px)', padding: '24px 16px', position: 'fixed', left: 0, top: 0, borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 100, overflowY: 'auto', boxShadow: '4px 0 32px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '4px 8px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 16px rgba(79,70,229,0.5)', flexShrink: 0 }}>🗓️</div>
          <div>
            <span style={{ color: '#fff', fontSize: '17px', fontWeight: '800' }}>Smart </span>
            <span style={{ color: '#818cf8', fontSize: '17px', fontWeight: '800' }}>Scheduler</span>
          </div>
        </div>
        <div style={{ background: 'rgba(79,70,229,0.08)', borderRadius: '16px', padding: '14px', marginBottom: '8px', border: '1px solid rgba(79,70,229,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>{getInitials(user?.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#fff', fontWeight: '700', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ color: '#475569', fontSize: '10px', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
            </div>
          </div>
          <span style={{ background: '#f43f5e20', color: '#f43f5e', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: '1px solid #f43f5e33' }}>👑 Admin</span>
        </div>
        {[
          { icon: '🏠', label: 'Dashboard',    path: '/dashboard' },
          { icon: '📅', label: 'Calendar',     path: '/calendar'  },
          { icon: '➕', label: 'Add Schedule', path: '/add'       },
          { icon: '📁', label: 'My Schedules', path: '/schedules' },
          { icon: '🔐', label: 'RBAC Demo',    path: '/rbac'      },
          { icon: '👑', label: 'Admin Panel',  path: '/admin'     },
          { icon: '⚙️', label: 'Settings',     path: '/settings'  },
        ].map((item, i) => (
          <div key={i} onClick={() => navigate(item.path)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', color: item.path === '/admin' ? '#a5b4fc' : '#64748b', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', background: item.path === '/admin' ? 'rgba(79,70,229,0.2)' : 'transparent', borderLeft: item.path === '/admin' ? '3px solid #4f46e5' : '3px solid transparent', fontWeight: item.path === '/admin' ? '700' : '400', marginBottom: '2px' }}>
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div onClick={logout} style={{ padding: '11px 14px', borderRadius: '12px', color: '#f87171', background: 'rgba(239,68,68,0.08)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(239,68,68,0.12)', marginTop: '8px' }}>
          🚪 <span>Logout</span>
        </div>
      </aside>

      {/* MAIN */}
      <main className="adm-main" style={{ marginLeft: '268px', padding: '28px', flex: 1, minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {/* Mobile bar */}
        <div className="mob-bar" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: '800' }}>🗓️ Smart <span style={{ color: '#818cf8' }}>Scheduler</span></span>
          <span style={{ background: '#f43f5e20', color: '#f43f5e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>👑 Admin</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px', animation: 'fadeInUp 0.4s ease' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', margin: 0 }}>👑 Admin Panel</h1>
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Manage users, assign roles and monitor all activity</p>
          </div>
          <div style={{ background: '#f43f5e20', color: '#f43f5e', border: '1px solid #f43f5e33', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: '700' }}>
            🔒 RBAC — Admin Only
          </div>
        </div>

        {/* Success message */}
        {successMsg && (
          <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', animation: 'fadeInUp 0.3s ease' }}>
            {successMsg}
          </div>
        )}

        {/* Stats */}
        <div className="stats-adm" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '24px', animation: 'fadeInUp 0.4s ease 0.1s both' }}>
          {[
            { label: 'Total Users',  value: users.length,                                      icon: '👥', color: '#6366f1', grad: 'linear-gradient(135deg,#1e1b4b,#312e81)' },
            { label: 'Schedules',    value: allSchedules.length,                               icon: '📅', color: '#10b981', grad: 'linear-gradient(135deg,#0d2d24,#064e3b)' },
            { label: 'Admins',       value: users.filter(u=>u.role==='admin').length,          icon: '👑', color: '#f43f5e', grad: 'linear-gradient(135deg,#2d1b1b,#7f1d1d)' },
            { label: 'Teachers',     value: users.filter(u=>u.role==='teacher').length,        icon: '👨‍🏫', color: '#f59e0b', grad: 'linear-gradient(135deg,#2d2010,#78350f)' },
            { label: 'Students',     value: users.filter(u=>u.role==='student').length,        icon: '👨‍🎓', color: '#06b6d4', grad: 'linear-gradient(135deg,#0d2530,#164e63)' },
          ].map((s,i) => (
            <div key={i} style={{ background: s.grad, borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: `1px solid ${s.color}30`, boxShadow: '0 6px 20px rgba(0,0,0,0.25)', animation: `fadeInUp 0.4s ease ${i*0.06}s both` }}>
              <span style={{ fontSize: '24px' }}>{s.icon}</span>
              <div>
                <p style={{ color: s.color, fontSize: '22px', fontWeight: '800', margin: 0 }}>{s.value}</p>
                <p style={{ color: '#64748b', fontSize: '11px', margin: 0 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs-adm" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedUser(null) }} style={{ padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: tab===t.id ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.04)', color: tab===t.id ? '#fff' : '#64748b', border: `1px solid ${tab===t.id ? '#4f46e5' : 'rgba(255,255,255,0.06)'}`, boxShadow: tab===t.id ? '0 4px 16px rgba(79,70,229,0.35)' : 'none', whiteSpace: 'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ USERS TAB ══ */}
        {tab === 'users' && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>

            {/* Search + Sort controls */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                placeholder="🔍 Search by name or email..."
                style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Sort by:</span>
                {[
                  { col: 'name', label: '🔤 Name' },
                  { col: 'date', label: '📅 Date' },
                  { col: 'role', label: '🔐 Role' },
                ].map(s => (
                  <button
                    key={s.col}
                    className="sort-btn"
                    onClick={() => toggleSort(s.col)}
                    style={{ padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', background: sortBy===s.col ? 'rgba(79,70,229,0.25)' : 'rgba(255,255,255,0.04)', color: sortBy===s.col ? '#a5b4fc' : '#64748b', border: `1px solid ${sortBy===s.col ? '#4f46e5' : 'rgba(255,255,255,0.06)'}` }}
                  >
                    {s.label} <SortIcon col={s.col} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
              {/* Table header */}
              <div style={{ display: 'flex', gap: '16px', padding: '14px 20px', background: 'rgba(79,70,229,0.1)', color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ flex: 2 }}>USER</span>
                <span style={{ flex: 2 }}>EMAIL</span>
                <span style={{ flex: 1 }}>ROLE</span>
                <span style={{ flex: 1 }}>JOINED DATE</span>
                <span style={{ flex: 1 }}>SCHEDULES</span>
                <span style={{ flex: 1, textAlign: 'right' }}>ACTIONS</span>
              </div>

              {sortedUsers.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>
                  <p style={{ fontSize: '36px' }}>👥</p>
                  <p style={{ marginTop: '8px' }}>No users found</p>
                </div>
              )}

              {sortedUsers.map((u, i) => (
                <div
                  key={u.id}
                  className="row-hover"
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: `3px solid ${ROLE_COLOR(u.role)}`, transition: 'all 0.2s', animation: `fadeInUp 0.3s ease ${i*0.05}s both` }}
                >
                  {/* User info */}
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg,${ROLE_COLOR(u.role)}40,${ROLE_COLOR(u.role)}20)`, color: ROLE_COLOR(u.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', flexShrink: 0, border: `1px solid ${ROLE_COLOR(u.role)}33` }}>
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontWeight: '700', fontSize: '14px', margin: 0 }}>{u.name}</p>
                      <p style={{ color: '#475569', fontSize: '10px', margin: '2px 0 0' }}>ID: #{u.id}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ flex: 2 }}>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{u.email}</p>
                  </div>

                  {/* Role badge */}
                  <div style={{ flex: 1 }}>
                    <span style={{ background: ROLE_COLOR(u.role)+'20', color: ROLE_COLOR(u.role), padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: `1px solid ${ROLE_COLOR(u.role)}33` }}>
                      {u.role === 'admin' ? '👑' : u.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'} {u.role}
                    </span>
                  </div>

                  {/* Joined date */}
                  <div style={{ flex: 1 }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '12px' }}>📅</span>
                      <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>{u.joined || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Schedules count */}
                  <div style={{ flex: 1 }}>
                    <div style={{ background: 'rgba(99,102,241,0.1)', borderRadius: '8px', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <span style={{ fontSize: '12px' }}>📋</span>
                      <span style={{ color: '#818cf8', fontSize: '13px', fontWeight: '800' }}>{getUserSchedules(u.email).length}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.25)', color: '#818cf8', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }}
                      onClick={() => { setSelectedUser(u); setTab('data') }}
                    >
                      👁️ View
                    </button>
                    {u.email !== 'admin@smart.com' && (
                      <button
                        style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }}
                        onClick={() => { setRoleModal(u); setNewRole(u.role) }}
                      >
                        🔐 Role
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary by join date */}
            <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', animation: 'fadeInUp 0.5s ease 0.2s both' }}>
              <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>📅 Users by Join Date</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...users]
                  .filter(u => u.joined)
                  .sort((a, b) => new Date(a.joined) - new Date(b.joined))
                  .map((u, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `3px solid ${ROLE_COLOR(u.role)}` }}>
                      {/* Position */}
                      <span style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '800', minWidth: '24px' }}>#{i+1}</span>

                      {/* Avatar */}
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg,${ROLE_COLOR(u.role)}40,${ROLE_COLOR(u.role)}20)`, color: ROLE_COLOR(u.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                        {getInitials(u.name)}
                      </div>

                      {/* Name + email */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#fff', fontWeight: '700', fontSize: '13px', margin: 0 }}>{u.name}</p>
                        <p style={{ color: '#475569', fontSize: '11px', margin: '2px 0 0' }}>{u.email}</p>
                      </div>

                      {/* Join date highlighted */}
                      <div style={{ background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '10px', padding: '6px 14px', textAlign: 'center' }}>
                        <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: '800', margin: 0 }}>{u.joined}</p>
                        <p style={{ color: '#475569', fontSize: '10px', margin: 0 }}>Joined</p>
                      </div>

                      {/* Role */}
                      <span style={{ background: ROLE_COLOR(u.role)+'20', color: ROLE_COLOR(u.role), padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>
                        {u.role}
                      </span>

                      {/* Schedules */}
                      <div style={{ textAlign: 'center', minWidth: '50px' }}>
                        <p style={{ color: '#818cf8', fontSize: '16px', fontWeight: '800', margin: 0 }}>{getUserSchedules(u.email).length}</p>
                        <p style={{ color: '#475569', fontSize: '10px', margin: 0 }}>tasks</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ ROLE MANAGER TAB ══ */}
        {tab === 'roles' && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
              {['admin','teacher','student'].map(role => (
                <div key={role} style={{ background: ROLE_COLOR(role)+'10', borderRadius: '16px', padding: '20px', border: `1px solid ${ROLE_COLOR(role)}30`, boxShadow: `0 4px 20px ${ROLE_COLOR(role)}15` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '28px' }}>{role==='admin' ? '👑' : role==='teacher' ? '👨‍🏫' : '👨‍🎓'}</span>
                    <div>
                      <p style={{ color: ROLE_COLOR(role), fontSize: '16px', fontWeight: '800', margin: 0 }}>{role.charAt(0).toUpperCase()+role.slice(1)}</p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{users.filter(u=>u.role===role).length} users</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {ROLE_PERMISSIONS[role].map((p,i) => (
                      <span key={i} style={{ background: ROLE_COLOR(role)+'20', color: ROLE_COLOR(role), padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>✓ {p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '14px' }}>👥 Assign Roles</h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', background: 'rgba(79,70,229,0.1)', color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                <span style={{ flex: 2 }}>USER</span>
                <span style={{ flex: 2 }}>EMAIL</span>
                <span style={{ flex: 1 }}>CURRENT</span>
                <span style={{ flex: 2 }}>CHANGE TO</span>
              </div>
              {users.filter(u => u.email !== 'admin@smart.com').map((u, i) => (
                <div key={u.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: `3px solid ${ROLE_COLOR(u.role)}`, transition: 'all 0.2s' }}>
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: ROLE_COLOR(u.role)+'25', color: ROLE_COLOR(u.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>{getInitials(u.name)}</div>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{u.name}</span>
                  </div>
                  <span style={{ flex: 2, color: '#94a3b8', fontSize: '12px' }}>{u.email}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ background: ROLE_COLOR(u.role)+'20', color: ROLE_COLOR(u.role), padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{u.role}</span>
                  </div>
                  <div style={{ flex: 2, display: 'flex', gap: '6px' }}>
                    {['student','teacher','admin'].map(r => (
                      <button key={r} onClick={() => { setRoleModal(u); setNewRole(r) }} style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', background: u.role===r ? ROLE_COLOR(r) : ROLE_COLOR(r)+'15', color: u.role===r ? '#fff' : ROLE_COLOR(r), border: `1px solid ${ROLE_COLOR(r)}44` }}>
                        {r==='admin' ? '👑' : r==='teacher' ? '👨‍🏫' : '👨‍🎓'} {r}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {users.filter(u => u.email !== 'admin@smart.com').length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>
                  <p style={{ fontSize: '32px' }}>👥</p>
                  <p style={{ marginTop: '8px' }}>No registered users yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ USER DATA TAB ══ */}
        {tab === 'data' && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            {/* User selector chips */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {users.map(u => (
                <div key={u.id} onClick={() => setSelectedUser(u)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', background: selectedUser?.id===u.id ? ROLE_COLOR(u.role)+'25' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedUser?.id===u.id ? ROLE_COLOR(u.role) : 'rgba(255,255,255,0.06)'}`, color: selectedUser?.id===u.id ? ROLE_COLOR(u.role) : '#64748b', fontWeight: '600', fontSize: '13px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: ROLE_COLOR(u.role)+'30', color: ROLE_COLOR(u.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>{getInitials(u.name)}</div>
                  {u.name}
                </div>
              ))}
            </div>

            {!selectedUser && (
              <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
                <p style={{ fontSize: '48px' }}>👆</p>
                <p style={{ marginTop: '12px', fontSize: '15px' }}>Select a user above to view their full data</p>
              </div>
            )}

            {selectedUser && (
              <div>
                {/* User info card */}
                <div style={{ background: `linear-gradient(135deg,${ROLE_COLOR(selectedUser.role)}12,rgba(255,255,255,0.02))`, borderRadius: '20px', padding: '22px', border: `1px solid ${ROLE_COLOR(selectedUser.role)}30`, marginBottom: '24px', boxShadow: `0 8px 32px ${ROLE_COLOR(selectedUser.role)}15` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg,${ROLE_COLOR(selectedUser.role)},${ROLE_COLOR(selectedUser.role)}99)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '22px', flexShrink: 0, boxShadow: `0 6px 20px ${ROLE_COLOR(selectedUser.role)}50` }}>
                      {getInitials(selectedUser.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: 0 }}>{selectedUser.name}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0' }}>📧 {selectedUser.email}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span style={{ background: ROLE_COLOR(selectedUser.role)+'20', color: ROLE_COLOR(selectedUser.role), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: `1px solid ${ROLE_COLOR(selectedUser.role)}33` }}>
                          {selectedUser.role === 'admin' ? '👑' : selectedUser.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'} {selectedUser.role}
                        </span>
                        <span style={{ background: 'rgba(79,70,229,0.15)', color: '#818cf8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(79,70,229,0.25)' }}>
                          📅 Joined: {selectedUser.joined || 'N/A'}
                        </span>
                        <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(16,185,129,0.25)' }}>
                          ● Active
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                      {[
                        { label: 'Schedules', value: getUserSchedules(selectedUser.email).length, color: '#6366f1' },
                        { label: 'Activity',  value: getLogs(selectedUser.email).length,          color: '#f59e0b' },
                      ].map((s,i) => (
                        <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '12px 16px', textAlign: 'center', minWidth: '70px' }}>
                          <p style={{ color: s.color, fontSize: '20px', fontWeight: '800', margin: 0 }}>{s.value}</p>
                          <p style={{ color: '#64748b', fontSize: '11px', margin: 0 }}>{s.label}</p>
                        </div>
                      ))}
                      {selectedUser.email !== 'admin@smart.com' && (
                        <button onClick={() => { setRoleModal(selectedUser); setNewRole(selectedUser.role) }} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                          🔐 Change Role
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Schedules */}
                <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📅 Schedules by {selectedUser.name}
                  <span style={{ background: 'rgba(79,70,229,0.15)', color: '#818cf8', borderRadius: '20px', padding: '2px 10px', fontSize: '11px' }}>
                    {getUserSchedules(selectedUser.email).length}
                  </span>
                </h3>

                {getUserSchedules(selectedUser.email).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '20px', color: '#475569' }}>
                    <p style={{ fontSize: '32px' }}>📭</p>
                    <p style={{ marginTop: '8px' }}>No schedules added yet</p>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', background: 'rgba(79,70,229,0.1)', color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                      <span style={{ flex: 3 }}>TITLE</span>
                      <span style={{ flex: 2 }}>DATE</span>
                      <span style={{ flex: 1 }}>TIME</span>
                      <span style={{ flex: 1 }}>CATEGORY</span>
                    </div>
                    {getUserSchedules(selectedUser.email).map((s, i) => (
                      <div key={s.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: `3px solid ${s.color}`, transition: 'all 0.2s' }}>
                        <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 6px ${s.color}` }} />
                          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>{s.title}</span>
                        </div>
                        <span style={{ flex: 2, color: '#94a3b8', fontSize: '12px' }}>📅 {s.date}</span>
                        <span style={{ flex: 1, color: '#94a3b8', fontSize: '12px' }}>⏰ {s.time}</span>
                        <span style={{ flex: 1 }}>
                          <span style={{ background: s.color+'20', color: s.color, padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>{s.category}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Activity */}
                <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📝 Activity Log
                  <span style={{ background: 'rgba(79,70,229,0.15)', color: '#818cf8', borderRadius: '20px', padding: '2px 10px', fontSize: '11px' }}>
                    {getLogs(selectedUser.email).length}
                  </span>
                </h3>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', background: 'rgba(79,70,229,0.1)', color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                    <span style={{ flex: 3 }}>ACTION</span>
                    <span style={{ flex: 2 }}>TIME</span>
                    <span style={{ flex: 1 }}>STATUS</span>
                  </div>
                  {getLogs(selectedUser.email).length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#475569' }}>No activity yet</div>
                  ) : getLogs(selectedUser.email).map((log, i) => (
                    <div key={i} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: `3px solid ${ROLE_COLOR(selectedUser.role)}`, transition: 'all 0.2s' }}>
                      <span style={{ flex: 3, color: '#e2e8f0', fontSize: '13px' }}>🔹 {log.action}</span>
                      <span style={{ flex: 2, color: '#64748b', fontSize: '12px' }}>🕐 {log.time}</span>
                      <span style={{ flex: 1 }}>
                        <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>✓ Done</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ ALL SCHEDULES TAB ══ */}
        {tab === 'schedules' && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', gap: '16px', padding: '14px 20px', background: 'rgba(79,70,229,0.1)', color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                <span style={{ flex: 3 }}>TITLE</span>
                <span style={{ flex: 2 }}>OWNER</span>
                <span style={{ flex: 2 }}>DATE & TIME</span>
                <span style={{ flex: 1 }}>CATEGORY</span>
              </div>
              {allSchedules.map((s, i) => (
                <div key={s.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: `3px solid ${s.color}`, transition: 'all 0.2s', animation: `fadeInUp 0.3s ease ${i*0.04}s both` }}>
                  <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 6px ${s.color}` }} />
                    <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>{s.title}</span>
                  </div>
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(79,70,229,0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>
                      {getInitials(s.ownerName || 'U')}
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>{s.ownerName || 'Unknown'}</span>
                  </div>
                  <div style={{ flex: 2 }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>📅 {s.date}</p>
                    <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0' }}>⏰ {s.time}</p>
                  </div>
                  <span style={{ flex: 1 }}>
                    <span style={{ background: s.color+'20', color: s.color, padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>{s.category}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ LOGS TAB ══ */}
        {tab === 'logs' && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', gap: '16px', padding: '14px 20px', background: 'rgba(79,70,229,0.1)', color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                <span style={{ flex: 2 }}>USER</span>
                <span style={{ flex: 1 }}>ROLE</span>
                <span style={{ flex: 3 }}>ACTION</span>
                <span style={{ flex: 2 }}>TIME</span>
              </div>
              {[...accessLogs, ...JSON.parse(localStorage.getItem('loginHistory') || '[]')].map((log, i) => (
                <div key={i} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: `3px solid ${ROLE_COLOR(log.role)}`, transition: 'all 0.2s', animation: `fadeInUp 0.3s ease ${i*0.03}s both` }}>
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: ROLE_COLOR(log.role)+'25', color: ROLE_COLOR(log.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>
                      {getInitials(log.user || log.name || 'U')}
                    </div>
                    <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>{log.user || log.name}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ background: ROLE_COLOR(log.role)+'20', color: ROLE_COLOR(log.role), padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{log.role}</span>
                  </div>
                  <span style={{ flex: 3, color: '#94a3b8', fontSize: '13px' }}>🔹 {log.action}</span>
                  <span style={{ flex: 2, color: '#64748b', fontSize: '12px' }}>🕐 {log.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ══ ROLE MODAL ══ */}
      {roleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#0d0c18', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '32px', width: '480px', maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', animation: 'fadeInUp 0.3s ease' }}>
            <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: '0 0 6px' }}>🔐 Assign Role</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              Change role for <strong style={{ color: '#fff' }}>{roleModal.name}</strong>
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#64748b', fontSize: '13px' }}>Current Role</span>
              <span style={{ background: ROLE_COLOR(roleModal.role)+'20', color: ROLE_COLOR(roleModal.role), padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{roleModal.role}</span>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '12px', letterSpacing: '0.5px' }}>SELECT NEW ROLE</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
              {[
                { role: 'student', icon: '👨‍🎓', desc: 'View & add own schedules' },
                { role: 'teacher', icon: '👨‍🏫', desc: 'View all, manage own'     },
                { role: 'admin',   icon: '👑',   desc: 'Full system access'       },
              ].map(r => (
                <div key={r.role} onClick={() => setNewRole(r.role)} style={{ borderRadius: '14px', padding: '16px', textAlign: 'center', cursor: 'pointer', border: `2px solid ${newRole===r.role ? ROLE_COLOR(r.role) : 'rgba(255,255,255,0.06)'}`, background: newRole===r.role ? ROLE_COLOR(r.role)+'20' : 'rgba(255,255,255,0.03)', position: 'relative', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '28px' }}>{r.icon}</span>
                  <p style={{ color: newRole===r.role ? ROLE_COLOR(r.role) : '#e2e8f0', fontWeight: '700', fontSize: '13px', margin: '8px 0 4px' }}>{r.role.charAt(0).toUpperCase()+r.role.slice(1)}</p>
                  <p style={{ color: '#64748b', fontSize: '10px', margin: 0 }}>{r.desc}</p>
                  {newRole===r.role && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '50%', background: ROLE_COLOR(r.role), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>✓</div>}
                </div>
              ))}
            </div>

            {newRole && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', border: `1px solid ${ROLE_COLOR(newRole)}30` }}>
                <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '8px', fontWeight: '600' }}>PERMISSIONS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ROLE_PERMISSIONS[newRole].map((p,i) => (
                    <span key={i} style={{ background: ROLE_COLOR(newRole)+'20', color: ROLE_COLOR(newRole), padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>✓ {p}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setRoleModal(null); setNewRole('') }} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleAssignRole} style={{ flex: 2, padding: '12px', borderRadius: '12px', background: newRole ? `linear-gradient(135deg,${ROLE_COLOR(newRole)},${ROLE_COLOR(newRole)}cc)` : '#2a2740', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: newRole ? `0 4px 16px ${ROLE_COLOR(newRole)}50` : 'none' }}>
                ✅ Assign {newRole} Role
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}