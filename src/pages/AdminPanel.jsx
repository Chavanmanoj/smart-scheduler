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

  const [tab, setTab]                   = useState('users')
  const [users, setUsers]               = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [allSchedules, setAllSchedules] = useState([])
  const [roleModal, setRoleModal]       = useState(null)
  const [newRole, setNewRole]           = useState('')
  const [successMsg, setSuccessMsg]     = useState('')
  const [sortBy, setSortBy]             = useState('name')
  const [sortDir, setSortDir]           = useState('asc')
  const [searchUser, setSearchUser]     = useState('')
  const [sidebarOpen, setSidebarOpen]   = useState(false)

  useEffect(() => {
    loadUsers()
    const saved = JSON.parse(localStorage.getItem('schedules') || '[]')
    setAllSchedules([...defaultSchedules, ...saved])
  }, [])

  const loadUsers = () => {
    const registered = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const adminUser  = { id: 0, name: 'Admin', email: 'admin@smart.com', role: 'admin', joined: '2026-01-01' }
    setUsers([adminUser, ...registered])
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const p = name.trim().split(' ')
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase()
  }

  if (!can('access_admin')) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#07060f,#0d0b1a,#0a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
        <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.06)', padding:'40px 32px', textAlign:'center', maxWidth:'380px', width:'100%' }}>
          <p style={{ fontSize:'52px' }}>🔒</p>
          <h2 style={{ color:'#fff', fontSize:'22px', fontWeight:'800', margin:'12px 0 8px' }}>Access Denied</h2>
          <p style={{ color:'#64748b', marginBottom:'24px', fontSize:'14px' }}>Your role <strong style={{ color:'#818cf8' }}>({user?.role})</strong> cannot access this page.</p>
          <button onClick={() => navigate('/dashboard')} style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', border:'none', borderRadius:'12px', padding:'12px 28px', fontSize:'14px', fontWeight:'700', cursor:'pointer' }}>← Back to Dashboard</button>
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
    logs.unshift({ name:'Admin', email:'admin@smart.com', role:'admin', action:`Assigned role "${newRole}" to ${roleModal.name}`, time:new Date().toLocaleString() })
    localStorage.setItem('loginHistory', JSON.stringify(logs))
    setSuccessMsg(`✅ Role "${newRole}" assigned to ${roleModal.name}`)
    setTimeout(() => setSuccessMsg(''), 3000)
    setRoleModal(null); setNewRole('')
    loadUsers()
  }

  const getUserSchedules = (email) => allSchedules.filter(s => s.owner === email)
  const getLogs = (email) => {
    const history = JSON.parse(localStorage.getItem('loginHistory') || '[]')
    return [...accessLogs, ...history].filter(l => l.email === email)
  }

  const sortedUsers = [...users]
    .filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()))
    .sort((a,b) => {
      let va = sortBy==='name' ? a.name : sortBy==='date' ? (a.joined||'') : a.role
      let vb = sortBy==='name' ? b.name : sortBy==='date' ? (b.joined||'') : b.role
      return sortDir==='asc' ? (va>vb?1:-1) : (va<vb?1:-1)
    })

  const toggleSort = (col) => {
    if (sortBy===col) setSortDir(d => d==='asc'?'desc':'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft:'4px', opacity:sortBy===col ? 1 : 0.3, fontSize:'10px' }}>
      {sortBy===col ? (sortDir==='asc' ? '▲' : '▼') : '⇅'}
    </span>
  )

  const tabs = [
    { id:'users',     label:'👥 Users'        },
    { id:'roles',     label:'🔐 Role Manager'  },
    { id:'data',      label:'📊 User Data'     },
    { id:'schedules', label:'📋 All Schedules' },
    { id:'logs',      label:'📝 Access Logs'   },
  ]

  const navItems = [
    { icon:'🏠', label:'Dashboard',    path:'/dashboard' },
    { icon:'📅', label:'Calendar',     path:'/calendar'  },
    { icon:'➕', label:'Add Schedule', path:'/add'       },
    { icon:'📁', label:'My Schedules', path:'/schedules' },
    { icon:'🔐', label:'RBAC Demo',    path:'/rbac'      },
    { icon:'👑', label:'Admin Panel',  path:'/admin'     },
    { icon:'⚙️', label:'Settings',     path:'/settings'  },
  ]

  const SidebarContent = () => (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', gap:'4px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px', padding:'4px 8px' }}>
        <div style={{ width:'40px', height:'40px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', boxShadow:'0 4px 16px rgba(79,70,229,0.5)', flexShrink:0 }}>🗓️</div>
        <div>
          <span style={{ color:'#fff', fontSize:'17px', fontWeight:'800' }}>Smart </span>
          <span style={{ color:'#818cf8', fontSize:'17px', fontWeight:'800' }}>Scheduler</span>
        </div>
      </div>
      <div style={{ background:'rgba(79,70,229,0.08)', borderRadius:'16px', padding:'14px', marginBottom:'8px', border:'1px solid rgba(79,70,229,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'14px', flexShrink:0 }}>{getInitials(user?.name)}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ color:'#fff', fontWeight:'700', fontSize:'13px', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</p>
            <p style={{ color:'#475569', fontSize:'10px', margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p>
          </div>
        </div>
        <span style={{ background:'#f43f5e20', color:'#f43f5e', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', border:'1px solid #f43f5e33' }}>👑 Admin</span>
      </div>
      {navItems.map((item,i) => (
        <div key={i} onClick={() => { navigate(item.path); setSidebarOpen(false) }} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'11px 14px', borderRadius:'12px', color:item.path==='/admin' ? '#a5b4fc' : '#64748b', fontSize:'14px', cursor:'pointer', transition:'all 0.2s', background:item.path==='/admin' ? 'rgba(79,70,229,0.2)' : 'transparent', borderLeft:item.path==='/admin' ? '3px solid #4f46e5' : '3px solid transparent', fontWeight:item.path==='/admin' ? '700' : '400', marginBottom:'2px' }}>
          <span style={{ fontSize:'16px', width:'20px', textAlign:'center' }}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
      <div style={{ flex:1 }} />
      <div onClick={logout} style={{ padding:'11px 14px', borderRadius:'12px', color:'#f87171', background:'rgba(239,68,68,0.08)', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', gap:'10px', border:'1px solid rgba(239,68,68,0.12)', marginTop:'8px' }}>
        🚪 <span>Logout</span>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'linear-gradient(135deg,#07060f 0%,#0d0b1a 30%,#0a0f1e 60%,#0d0a18 100%)', position:'relative', overflow:'hidden' }}>

      {/* CSS RESETS & ANIMATIONS */}
      <style>{`
        * { box-sizing: border-box; } /* Crucial for preventing layout blowout */

        @keyframes admFadeIn  { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        @keyframes slideLeft  { from{transform:translateX(-100%);} to{transform:translateX(0);} }
        @keyframes modalPop   { from{opacity:0;transform:scale(0.9);} to{opacity:1;transform:scale(1);} }
        
        .row-hover:hover { background:rgba(255,255,255,0.05) !important; }
        .sort-btn:hover  { background:rgba(79,70,229,0.15) !important; }

        /* Universal Table Scroll Wrapper */
        .table-scroll {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px; /* Breathing room for scrollbar */
        }
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 8px; }
        .table-scroll::-webkit-scrollbar-thumb { background: rgba(79,70,229,0.3); border-radius: 8px; }

        /* Mobile Adjustments */
        @media(max-width:900px) {
          .adm-desk-sb { display:none !important; }
          .adm-mob-bar { display:flex !important; }
          .adm-main    { margin-left:0 !important; padding:16px !important; }
          
          /* Horizontal scroll for Tabs and Controls */
          .tabs-adm, .sort-controls { 
            flex-wrap: nowrap !important; 
            overflow-x: auto !important; 
            padding-bottom: 8px; 
          }
          .tabs-adm::-webkit-scrollbar, .sort-controls::-webkit-scrollbar { display: none; }
          
          .role-info-grid  { grid-template-columns:1fr !important; }
          .modal-role-grid { grid-template-columns:repeat(3,1fr) !important; }
          .user-info-top   { flex-direction:column !important; align-items:flex-start !important; gap:12px !important; }
          .user-mini-stats { display:flex !important; flex-wrap:wrap !important; gap:10px !important; width:100% !important; margin-top:10px !important; }
        }

        @media(min-width:901px) {
          .adm-desk-sb { display:flex !important; flex-direction:column !important; }
          .adm-mob-bar { display:none !important; }
          .adm-main    { margin-left:268px !important; }
          .role-info-grid { grid-template-columns:repeat(3,1fr) !important; }
          .modal-role-grid{ grid-template-columns:repeat(3,1fr) !important; }
          .user-info-top  { flex-direction:row !important; align-items:center !important; }
          .user-mini-stats{ display:flex !important; }
        }
      `}</style>

      {/* DESKTOP SIDEBAR */}
      <aside className="adm-desk-sb" style={{ width:'268px', minHeight:'100vh', background:'rgba(10,9,20,0.97)', backdropFilter:'blur(20px)', padding:'24px 16px', position:'fixed', left:0, top:0, borderRight:'1px solid rgba(255,255,255,0.05)', zIndex:100, overflowY:'auto', boxShadow:'4px 0 32px rgba(0,0,0,0.4)' }}>
        <SidebarContent />
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:200, backdropFilter:'blur(4px)', display:'flex' }} onClick={() => setSidebarOpen(false)}>
          <aside style={{ width:'280px', maxWidth:'85vw', background:'rgba(10,9,20,0.99)', padding:'24px 16px', overflowY:'auto', animation:'slideLeft 0.25s ease', boxShadow:'8px 0 40px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* MAIN CONTAINER: minWidth: 0 is CRUCIAL here to prevent flexbox blowout */}
      <main className="adm-main" style={{ padding:'28px', flex:1, minWidth:0, minHeight:'100vh', position:'relative', zIndex:1 }}>

        {/* Mobile top bar */}
        <div className="adm-mob-bar" style={{ display:'none', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', background:'rgba(255,255,255,0.03)', borderRadius:'16px', padding:'12px 16px', border:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background:'rgba(79,70,229,0.15)', border:'1px solid rgba(79,70,229,0.25)', color:'#818cf8', borderRadius:'10px', padding:'8px 14px', fontSize:'18px', cursor:'pointer', lineHeight:1 }}>☰</button>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'18px' }}>🗓️</span>
            <span style={{ color:'#fff', fontSize:'14px', fontWeight:'800' }}>Smart <span style={{ color:'#818cf8' }}>Scheduler</span></span>
          </div>
          <span style={{ background:'#f43f5e20', color:'#f43f5e', padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700' }}>👑 Admin</span>
        </div>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px', animation:'admFadeIn 0.4s ease' }}>
          <div>
            <h1 style={{ fontSize:'24px', fontWeight:'800', color:'#fff', margin:0 }}>👑 Admin Panel</h1>
            <p style={{ color:'#64748b', fontSize:'13px', marginTop:'4px' }}>Manage users, assign roles and monitor activity</p>
          </div>
          <div style={{ background:'#f43f5e20', color:'#f43f5e', border:'1px solid #f43f5e33', borderRadius:'12px', padding:'8px 16px', fontSize:'13px', fontWeight:'700', flexShrink:0 }}>
            🔒 RBAC — Admin Only
          </div>
        </div>

        {/* Success message */}
        {successMsg && (
          <div style={{ background:'rgba(16,185,129,0.1)', color:'#10b981', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'12px', padding:'12px 18px', marginBottom:'16px', fontSize:'14px', fontWeight:'600', animation:'admFadeIn 0.3s ease' }}>
            {successMsg}
          </div>
        )}

        {/* Stats Grid - Using auto-fit so it naturally wraps on mobile without blowing out */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:'12px', marginBottom:'20px', animation:'admFadeIn 0.4s ease 0.05s both' }}>
          {[
            { label:'Total Users',  value:users.length,                                icon:'👥', color:'#6366f1', grad:'linear-gradient(135deg,#1e1b4b,#312e81)' },
            { label:'Schedules',    value:allSchedules.length,                         icon:'📅', color:'#10b981', grad:'linear-gradient(135deg,#0d2d24,#064e3b)' },
            { label:'Admins',       value:users.filter(u=>u.role==='admin').length,    icon:'👑', color:'#f43f5e', grad:'linear-gradient(135deg,#2d1b1b,#7f1d1d)' },
            { label:'Teachers',     value:users.filter(u=>u.role==='teacher').length,  icon:'👨‍🏫', color:'#f59e0b', grad:'linear-gradient(135deg,#2d2010,#78350f)' },
            { label:'Students',     value:users.filter(u=>u.role==='student').length,  icon:'👨‍🎓', color:'#06b6d4', grad:'linear-gradient(135deg,#0d2530,#164e63)' },
          ].map((s,i) => (
            <div key={i} style={{ background:s.grad, borderRadius:'14px', padding:'14px', display:'flex', alignItems:'center', gap:'10px', border:`1px solid ${s.color}30`, boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize:'22px', flexShrink:0 }}>{s.icon}</span>
              <div style={{ minWidth:0 }}>
                <p style={{ color:s.color, fontSize:'20px', fontWeight:'800', margin:0 }}>{s.value}</p>
                <p style={{ color:'#64748b', fontSize:'10px', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs-adm" style={{ display:'flex', gap:'8px', marginBottom:'18px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedUser(null) }} style={{ padding:'10px 16px', borderRadius:'12px', fontSize:'13px', fontWeight:'700', cursor:'pointer', transition:'all 0.2s', background:tab===t.id ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.04)', color:tab===t.id ? '#fff' : '#64748b', border:`1px solid ${tab===t.id ? '#4f46e5' : 'rgba(255,255,255,0.06)'}`, whiteSpace:'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ USERS TAB ══ */}
        {tab === 'users' && (
          <div style={{ animation:'admFadeIn 0.4s ease' }}>
            {/* Search + sort */}
            <div style={{ display:'flex', gap:'12px', marginBottom:'14px', alignItems:'center', flexWrap:'wrap' }}>
              <input
                value={searchUser} onChange={e => setSearchUser(e.target.value)}
                placeholder="🔍 Search by name or email..."
                style={{ flex:1, minWidth:'200px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'10px 14px', color:'#fff', fontSize:'13px', outline:'none' }}
              />
              <div className="sort-controls" style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                <span style={{ color:'#64748b', fontSize:'11px', fontWeight:'600', whiteSpace:'nowrap' }}>Sort:</span>
                {[{col:'name',label:'🔤 Name'},{col:'date',label:'📅 Date'},{col:'role',label:'🔐 Role'}].map(s => (
                  <button key={s.col} className="sort-btn" onClick={() => toggleSort(s.col)} style={{ padding:'6px 12px', borderRadius:'10px', fontSize:'11px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s', background:sortBy===s.col ? 'rgba(79,70,229,0.25)' : 'rgba(255,255,255,0.04)', color:sortBy===s.col ? '#a5b4fc' : '#64748b', border:`1px solid ${sortBy===s.col ? '#4f46e5' : 'rgba(255,255,255,0.06)'}`, whiteSpace:'nowrap' }}>
                    {s.label} <SortIcon col={s.col} />
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table with Horizontal Scroll Wrapper */}
            <div className="table-scroll">
              <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden', minWidth:'800px', marginBottom:'10px' }}>
                <div style={{ display:'flex', gap:'12px', padding:'12px 18px', background:'rgba(79,70,229,0.1)', color:'#64748b', fontSize:'11px', fontWeight:'700', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ flex:2, minWidth:'160px' }}>USER</span>
                  <span style={{ flex:2, minWidth:'180px' }}>EMAIL</span>
                  <span style={{ flex:1, minWidth:'100px' }}>ROLE</span>
                  <span style={{ flex:1, minWidth:'100px' }}>JOINED</span>
                  <span style={{ flex:1, minWidth:'100px' }}>SCHEDULES</span>
                  <span style={{ flex:1, minWidth:'150px', textAlign:'right' }}>ACTIONS</span>
                </div>

                {sortedUsers.length === 0 && (
                  <div style={{ padding:'40px', textAlign:'center', color:'#475569' }}>
                    <p style={{ fontSize:'32px' }}>👥</p>
                    <p style={{ marginTop:'8px', fontSize:'13px' }}>No users found</p>
                  </div>
                )}

                {sortedUsers.map((u, i) => (
                  <div key={u.id} className="row-hover" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.04)', borderLeft:`3px solid ${ROLE_COLOR(u.role)}`, transition:'all 0.2s' }}>
                    <div style={{ flex:2, minWidth:'160px', display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:`linear-gradient(135deg,${ROLE_COLOR(u.role)}40,${ROLE_COLOR(u.role)}20)`, color:ROLE_COLOR(u.role), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'13px', flexShrink:0, border:`1px solid ${ROLE_COLOR(u.role)}33` }}>
                        {getInitials(u.name)}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <p style={{ color:'#fff', fontWeight:'700', fontSize:'13px', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</p>
                        <p style={{ color:'#475569', fontSize:'10px', margin:'2px 0 0' }}>ID #{u.id}</p>
                      </div>
                    </div>
                    <div style={{ flex:2, minWidth:'180px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      <p style={{ color:'#94a3b8', fontSize:'12px', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</p>
                    </div>
                    <div style={{ flex:1, minWidth:'100px' }}>
                      <span style={{ background:ROLE_COLOR(u.role)+'20', color:ROLE_COLOR(u.role), padding:'4px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:'700', border:`1px solid ${ROLE_COLOR(u.role)}33` }}>
                        {u.role==='admin' ? '👑' : u.role==='teacher' ? '👨‍🏫' : '👨‍🎓'} {u.role}
                      </span>
                    </div>
                    <div style={{ flex:1, minWidth:'100px' }}>
                      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', padding:'5px 8px', display:'inline-flex', alignItems:'center', gap:'4px', border:'1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize:'11px' }}>📅</span>
                        <span style={{ color:'#94a3b8', fontSize:'11px', fontWeight:'500' }}>{u.joined||'N/A'}</span>
                      </div>
                    </div>
                    <div style={{ flex:1, minWidth:'100px' }}>
                      <div style={{ background:'rgba(99,102,241,0.1)', borderRadius:'8px', padding:'5px 8px', display:'inline-flex', alignItems:'center', gap:'4px', border:'1px solid rgba(99,102,241,0.2)' }}>
                        <span style={{ fontSize:'11px' }}>📋</span>
                        <span style={{ color:'#818cf8', fontSize:'13px', fontWeight:'800' }}>{getUserSchedules(u.email).length}</span>
                      </div>
                    </div>
                    <div style={{ flex:1, minWidth:'150px', display:'flex', justifyContent:'flex-end', gap:'6px' }}>
                      <button onClick={() => { setSelectedUser(u); setTab('data') }} style={{ background:'rgba(79,70,229,0.15)', border:'1px solid rgba(79,70,229,0.25)', color:'#818cf8', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>👁️ View</button>
                      {u.email !== 'admin@smart.com' && (
                        <button onClick={() => { setRoleModal(u); setNewRole(u.role) }} style={{ background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.25)', color:'#a78bfa', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>🔐 Role</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users by join date */}
            <div className="table-scroll">
              <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.06)', padding:'18px', minWidth:'500px' }}>
                <h3 style={{ color:'#fff', fontSize:'14px', fontWeight:'800', marginBottom:'14px' }}>📅 Users by Join Date</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {[...users].filter(u => u.joined).sort((a,b) => new Date(a.joined)-new Date(b.joined)).map((u,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', background:'rgba(255,255,255,0.03)', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.05)', borderLeft:`3px solid ${ROLE_COLOR(u.role)}` }}>
                      <span style={{ color:'#4f46e5', fontSize:'12px', fontWeight:'800', minWidth:'22px' }}>#{i+1}</span>
                      <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:ROLE_COLOR(u.role)+'30', color:ROLE_COLOR(u.role), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'12px', flexShrink:0 }}>
                        {getInitials(u.name)}
                      </div>
                      <div style={{ flex:1, minWidth:'150px' }}>
                        <p style={{ color:'#fff', fontWeight:'700', fontSize:'13px', margin:0 }}>{u.name}</p>
                        <p style={{ color:'#475569', fontSize:'10px', margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</p>
                      </div>
                      <div style={{ background:'rgba(79,70,229,0.12)', border:'1px solid rgba(79,70,229,0.2)', borderRadius:'8px', padding:'5px 12px', textAlign:'center', flexShrink:0, width:'80px' }}>
                        <p style={{ color:'#818cf8', fontSize:'12px', fontWeight:'800', margin:0 }}>{u.joined}</p>
                        <p style={{ color:'#475569', fontSize:'9px', margin:0 }}>Joined</p>
                      </div>
                      <span style={{ background:ROLE_COLOR(u.role)+'20', color:ROLE_COLOR(u.role), padding:'3px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:'700', flexShrink:0, width:'70px', textAlign:'center' }}>{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ ROLE MANAGER TAB ══ */}
        {tab === 'roles' && (
          <div style={{ animation:'admFadeIn 0.4s ease' }}>
            <div className="role-info-grid" style={{ display:'grid', gap:'14px', marginBottom:'20px' }}>
              {['admin','teacher','student'].map(role => (
                <div key={role} style={{ background:ROLE_COLOR(role)+'10', borderRadius:'16px', padding:'18px', border:`1px solid ${ROLE_COLOR(role)}30` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                    <span style={{ fontSize:'24px' }}>{role==='admin'?'👑':role==='teacher'?'👨‍🏫':'👨‍🎓'}</span>
                    <div>
                      <p style={{ color:ROLE_COLOR(role), fontSize:'14px', fontWeight:'800', margin:0 }}>{role.charAt(0).toUpperCase()+role.slice(1)}</p>
                      <p style={{ color:'#64748b', fontSize:'11px', margin:0 }}>{users.filter(u=>u.role===role).length} users</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                    {ROLE_PERMISSIONS[role].map((p,i) => (
                      <span key={i} style={{ background:ROLE_COLOR(role)+'20', color:ROLE_COLOR(role), padding:'2px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:'600' }}>✓ {p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ color:'#fff', fontSize:'14px', fontWeight:'800', marginBottom:'12px' }}>👥 Assign Roles</h3>
            <div className="table-scroll">
              <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden', minWidth:'650px' }}>
                <div style={{ display:'flex', gap:'12px', padding:'11px 16px', background:'rgba(79,70,229,0.1)', color:'#64748b', fontSize:'11px', fontWeight:'700' }}>
                  <span style={{ flex:2, minWidth:'150px' }}>USER</span>
                  <span style={{ flex:2, minWidth:'180px' }}>EMAIL</span>
                  <span style={{ flex:1, minWidth:'100px' }}>CURRENT</span>
                  <span style={{ flex:2, minWidth:'180px' }}>CHANGE TO</span>
                </div>
                {users.filter(u => u.email !== 'admin@smart.com').map((u,i) => (
                  <div key={u.id} className="row-hover" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', borderLeft:`3px solid ${ROLE_COLOR(u.role)}` }}>
                    <div style={{ flex:2, minWidth:'150px', display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:ROLE_COLOR(u.role)+'25', color:ROLE_COLOR(u.role), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'12px', flexShrink:0 }}>{getInitials(u.name)}</div>
                      <span style={{ color:'#fff', fontSize:'13px', fontWeight:'600', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</span>
                    </div>
                    <span style={{ flex:2, minWidth:'180px', color:'#94a3b8', fontSize:'12px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</span>
                    <div style={{ flex:1, minWidth:'100px' }}>
                      <span style={{ background:ROLE_COLOR(u.role)+'20', color:ROLE_COLOR(u.role), padding:'3px 8px', borderRadius:'20px', fontSize:'10px', fontWeight:'700' }}>{u.role}</span>
                    </div>
                    <div style={{ flex:2, minWidth:'180px', display:'flex', gap:'6px' }}>
                      {['student','teacher','admin'].map(r => (
                        <button key={r} onClick={() => { setRoleModal(u); setNewRole(r) }} style={{ padding:'5px 8px', borderRadius:'8px', fontSize:'10px', fontWeight:'600', cursor:'pointer', border:`1px solid ${ROLE_COLOR(r)}44`, background:u.role===r ? ROLE_COLOR(r) : ROLE_COLOR(r)+'15', color:u.role===r ? '#fff' : ROLE_COLOR(r) }}>
                          {r==='admin'?'👑':r==='teacher'?'👨‍🏫':'👨‍🎓'} {r}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ USER DATA TAB ══ */}
        {tab === 'data' && (
          <div style={{ animation:'admFadeIn 0.4s ease' }}>
            <div style={{ display:'flex', gap:'8px', marginBottom:'18px', flexWrap:'nowrap', overflowX:'auto', WebkitOverflowScrolling:'touch', paddingBottom:'8px' }}>
              {users.map(u => (
                <div key={u.id} onClick={() => setSelectedUser(u)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 14px', borderRadius:'12px', cursor:'pointer', background:selectedUser?.id===u.id ? ROLE_COLOR(u.role)+'25' : 'rgba(255,255,255,0.04)', border:`1px solid ${selectedUser?.id===u.id ? ROLE_COLOR(u.role) : 'rgba(255,255,255,0.06)'}`, color:selectedUser?.id===u.id ? ROLE_COLOR(u.role) : '#64748b', fontWeight:'600', fontSize:'13px', flexShrink:0 }}>
                  <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:ROLE_COLOR(u.role)+'30', color:ROLE_COLOR(u.role), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'10px' }}>{getInitials(u.name)}</div>
                  <span>{u.name}</span>
                </div>
              ))}
            </div>

            {!selectedUser && (
              <div style={{ textAlign:'center', padding:'48px 20px', color:'#475569', background:'rgba(255,255,255,0.02)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ fontSize:'44px' }}>👆</p>
                <p style={{ marginTop:'12px', fontSize:'14px' }}>Select a user above to view their data</p>
              </div>
            )}

            {selectedUser && (
              <div>
                {/* User Info Card */}
                <div style={{ background:`linear-gradient(135deg,${ROLE_COLOR(selectedUser.role)}12,rgba(255,255,255,0.02))`, borderRadius:'18px', padding:'20px', border:`1px solid ${ROLE_COLOR(selectedUser.role)}30`, marginBottom:'20px' }}>
                  <div className="user-info-top" style={{ display:'flex', gap:'14px' }}>
                    <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:`linear-gradient(135deg,${ROLE_COLOR(selectedUser.role)},${ROLE_COLOR(selectedUser.role)}99)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'20px', flexShrink:0 }}>
                      {getInitials(selectedUser.name)}
                    </div>
                    <div style={{ flex:1 }}>
                      <h3 style={{ color:'#fff', fontSize:'18px', fontWeight:'800', margin:0 }}>{selectedUser.name}</h3>
                      <p style={{ color:'#94a3b8', fontSize:'12px', margin:'4px 0' }}>📧 {selectedUser.email}</p>
                      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'6px' }}>
                        <span style={{ background:ROLE_COLOR(selectedUser.role)+'20', color:ROLE_COLOR(selectedUser.role), padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700' }}>{selectedUser.role}</span>
                        <span style={{ background:'rgba(79,70,229,0.15)', color:'#818cf8', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700' }}>📅 {selectedUser.joined||'N/A'}</span>
                      </div>
                    </div>
                    <div className="user-mini-stats" style={{ display:'flex', gap:'10px' }}>
                      <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:'10px', padding:'10px 14px', textAlign:'center', flex:1 }}>
                        <p style={{ color:'#6366f1', fontSize:'18px', fontWeight:'800', margin:0 }}>{getUserSchedules(selectedUser.email).length}</p>
                        <p style={{ color:'#64748b', fontSize:'10px', margin:0 }}>Schedules</p>
                      </div>
                      <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:'10px', padding:'10px 14px', textAlign:'center', flex:1 }}>
                        <p style={{ color:'#f59e0b', fontSize:'18px', fontWeight:'800', margin:0 }}>{getLogs(selectedUser.email).length}</p>
                        <p style={{ color:'#64748b', fontSize:'10px', margin:0 }}>Activity</p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 style={{ color:'#fff', fontSize:'14px', fontWeight:'800', marginBottom:'10px' }}>📅 Schedules</h3>
                {getUserSchedules(selectedUser.email).length === 0 ? (
                  <div style={{ textAlign:'center', padding:'28px', background:'rgba(255,255,255,0.02)', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.04)', marginBottom:'18px', color:'#475569' }}>📭 No schedules</div>
                ) : (
                  <div className="table-scroll" style={{ marginBottom:'18px' }}>
                    <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.05)', overflow:'hidden', minWidth:'500px' }}>
                      <div style={{ display:'flex', gap:'12px', padding:'10px 16px', background:'rgba(79,70,229,0.1)', color:'#64748b', fontSize:'11px', fontWeight:'700' }}>
                        <span style={{ flex:3, minWidth:'150px' }}>TITLE</span>
                        <span style={{ flex:2, minWidth:'100px' }}>DATE</span>
                        <span style={{ flex:1, minWidth:'80px' }}>TIME</span>
                        <span style={{ flex:1, minWidth:'100px' }}>CATEGORY</span>
                      </div>
                      {getUserSchedules(selectedUser.email).map((s) => (
                        <div key={s.id} className="row-hover" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', borderLeft:`3px solid ${s.color}` }}>
                          <span style={{ flex:3, minWidth:'150px', color:'#e2e8f0', fontSize:'13px', fontWeight:'600' }}>{s.title}</span>
                          <span style={{ flex:2, minWidth:'100px', color:'#94a3b8', fontSize:'11px' }}>📅 {s.date}</span>
                          <span style={{ flex:1, minWidth:'80px', color:'#94a3b8', fontSize:'11px' }}>⏰ {s.time}</span>
                          <span style={{ flex:1, minWidth:'100px' }}>
                            <span style={{ background:s.color+'20', color:s.color, padding:'2px 8px', borderRadius:'8px', fontSize:'10px', fontWeight:'700' }}>{s.category}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h3 style={{ color:'#fff', fontSize:'14px', fontWeight:'800', marginBottom:'10px' }}>📝 Activity Log</h3>
                <div className="table-scroll">
                  <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.05)', overflow:'hidden', minWidth:'450px' }}>
                    <div style={{ display:'flex', gap:'12px', padding:'10px 16px', background:'rgba(79,70,229,0.1)', color:'#64748b', fontSize:'11px', fontWeight:'700' }}>
                      <span style={{ flex:3, minWidth:'180px' }}>ACTION</span>
                      <span style={{ flex:2, minWidth:'120px' }}>TIME</span>
                      <span style={{ flex:1, minWidth:'80px' }}>STATUS</span>
                    </div>
                    {getLogs(selectedUser.email).length === 0 ? (
                      <div style={{ padding:'20px', textAlign:'center', color:'#475569' }}>No activity</div>
                    ) : getLogs(selectedUser.email).map((log,i) => (
                      <div key={i} className="row-hover" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ flex:3, minWidth:'180px', color:'#e2e8f0', fontSize:'12px' }}>🔹 {log.action}</span>
                        <span style={{ flex:2, minWidth:'120px', color:'#64748b', fontSize:'11px' }}>🕐 {log.time}</span>
                        <span style={{ flex:1, minWidth:'80px' }}><span style={{ color:'#10b981', fontSize:'10px', fontWeight:'600' }}>✓ Done</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ ALL SCHEDULES TAB ══ */}
        {tab === 'schedules' && (
          <div style={{ animation:'admFadeIn 0.4s ease' }}>
            <div className="table-scroll">
              <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden', minWidth:'650px' }}>
                <div style={{ display:'flex', gap:'12px', padding:'12px 16px', background:'rgba(79,70,229,0.1)', color:'#64748b', fontSize:'11px', fontWeight:'700' }}>
                  <span style={{ flex:3, minWidth:'180px' }}>TITLE</span>
                  <span style={{ flex:2, minWidth:'150px' }}>OWNER</span>
                  <span style={{ flex:2, minWidth:'120px' }}>DATE & TIME</span>
                  <span style={{ flex:1, minWidth:'100px' }}>CATEGORY</span>
                </div>
                {allSchedules.map((s,i) => (
                  <div key={s.id} className="row-hover" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', borderLeft:`3px solid ${s.color}` }}>
                    <div style={{ flex:3, minWidth:'180px', display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:s.color, flexShrink:0 }} />
                      <span style={{ color:'#e2e8f0', fontSize:'13px', fontWeight:'600' }}>{s.title}</span>
                    </div>
                    <div style={{ flex:2, minWidth:'150px', display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'rgba(79,70,229,0.2)', color:'#818cf8', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'10px', flexShrink:0 }}>{getInitials(s.ownerName||'U')}</div>
                      <span style={{ color:'#94a3b8', fontSize:'12px' }}>{s.ownerName||'Unknown'}</span>
                    </div>
                    <div style={{ flex:2, minWidth:'120px' }}>
                      <p style={{ color:'#94a3b8', fontSize:'11px', margin:0 }}>📅 {s.date}</p>
                      <p style={{ color:'#64748b', fontSize:'10px', margin:'2px 0 0' }}>⏰ {s.time}</p>
                    </div>
                    <span style={{ flex:1, minWidth:'100px' }}>
                      <span style={{ background:s.color+'20', color:s.color, padding:'3px 8px', borderRadius:'8px', fontSize:'10px', fontWeight:'700' }}>{s.category}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ LOGS TAB ══ */}
        {tab === 'logs' && (
          <div style={{ animation:'admFadeIn 0.4s ease' }}>
            <div className="table-scroll">
              <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden', minWidth:'650px' }}>
                <div style={{ display:'flex', gap:'12px', padding:'12px 16px', background:'rgba(79,70,229,0.1)', color:'#64748b', fontSize:'11px', fontWeight:'700' }}>
                  <span style={{ flex:2, minWidth:'150px' }}>USER</span>
                  <span style={{ flex:1, minWidth:'100px' }}>ROLE</span>
                  <span style={{ flex:3, minWidth:'200px' }}>ACTION</span>
                  <span style={{ flex:2, minWidth:'120px' }}>TIME</span>
                </div>
                {[...accessLogs, ...JSON.parse(localStorage.getItem('loginHistory')||'[]')].map((log,i) => (
                  <div key={i} className="row-hover" style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', borderLeft:`3px solid ${ROLE_COLOR(log.role)}` }}>
                    <div style={{ flex:2, minWidth:'150px', display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:ROLE_COLOR(log.role)+'25', color:ROLE_COLOR(log.role), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'10px', flexShrink:0 }}>{getInitials(log.user||log.name||'U')}</div>
                      <span style={{ color:'#e2e8f0', fontSize:'12px', fontWeight:'600' }}>{log.user||log.name}</span>
                    </div>
                    <div style={{ flex:1, minWidth:'100px' }}>
                      <span style={{ background:ROLE_COLOR(log.role)+'20', color:ROLE_COLOR(log.role), padding:'2px 8px', borderRadius:'20px', fontSize:'10px', fontWeight:'700' }}>{log.role}</span>
                    </div>
                    <span style={{ flex:3, minWidth:'200px', color:'#94a3b8', fontSize:'12px' }}>🔹 {log.action}</span>
                    <span style={{ flex:2, minWidth:'120px', color:'#64748b', fontSize:'11px' }}>🕐 {log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ══ ROLE MODAL ══ */}
      {roleModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(6px)', padding:'16px' }}>
          <div style={{ background:'#0d0c18', borderRadius:'22px', border:'1px solid rgba(255,255,255,0.08)', padding:'28px', width:'100%', maxWidth:'480px', boxShadow:'0 24px 60px rgba(0,0,0,0.6)', animation:'modalPop 0.3s ease' }}>
            <h3 style={{ color:'#fff', fontSize:'18px', fontWeight:'800', margin:'0 0 6px' }}>🔐 Assign Role</h3>
            <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'18px' }}>Change role for <strong style={{ color:'#fff' }}>{roleModal.name}</strong></p>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'11px 14px', marginBottom:'18px', border:'1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color:'#64748b', fontSize:'12px' }}>Current Role</span>
              <span style={{ background:ROLE_COLOR(roleModal.role)+'20', color:ROLE_COLOR(roleModal.role), padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'700' }}>{roleModal.role}</span>
            </div>

            <p style={{ color:'#94a3b8', fontSize:'11px', fontWeight:'700', marginBottom:'10px' }}>SELECT NEW ROLE</p>
            <div className="modal-role-grid" style={{ display:'grid', gap:'10px', marginBottom:'14px' }}>
              {[
                { role:'student', icon:'👨‍🎓', desc:'View & add own' },
                { role:'teacher', icon:'👨‍🏫', desc:'Manage own, view all' },
                { role:'admin',   icon:'👑',   desc:'Full system access' },
              ].map(r => (
                <div key={r.role} onClick={() => setNewRole(r.role)} style={{ borderRadius:'12px', padding:'14px', textAlign:'center', cursor:'pointer', border:`2px solid ${newRole===r.role ? ROLE_COLOR(r.role) : 'rgba(255,255,255,0.06)'}`, background:newRole===r.role ? ROLE_COLOR(r.role)+'20' : 'rgba(255,255,255,0.03)', position:'relative' }}>
                  <span style={{ fontSize:'24px' }}>{r.icon}</span>
                  <p style={{ color:newRole===r.role ? ROLE_COLOR(r.role) : '#e2e8f0', fontWeight:'700', fontSize:'12px', margin:'6px 0 3px' }}>{r.role.charAt(0).toUpperCase()+r.role.slice(1)}</p>
                  <p style={{ color:'#64748b', fontSize:'9px', margin:0 }}>{r.desc}</p>
                  {newRole===r.role && <div style={{ position:'absolute', top:'6px', right:'6px', width:'18px', height:'18px', borderRadius:'50%', background:ROLE_COLOR(r.role), color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px' }}>✓</div>}
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={() => { setRoleModal(null); setNewRole('') }} style={{ flex:1, padding:'11px', borderRadius:'12px', background:'rgba(255,255,255,0.05)', color:'#94a3b8', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>Cancel</button>
              <button onClick={handleAssignRole} style={{ flex:2, padding:'11px', borderRadius:'12px', background:newRole ? `linear-gradient(135deg,${ROLE_COLOR(newRole)},${ROLE_COLOR(newRole)}cc)` : '#2a2740', color:'#fff', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>✅ Assign {newRole || '...'} Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}