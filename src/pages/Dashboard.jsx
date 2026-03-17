import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const bgMap = {
  Class: '#1e1b4b', Deadline: '#2d1b2e', Meeting: '#0d2d24',
  Lab: '#2d2010', Study: '#0d2530', Personal: '#1e1040',
  Work: '#1a2535', Other: '#1e1e2e',
}
const categoryColors = {
  Class: '#6366f1', Deadline: '#f43f5e', Meeting: '#10b981',
  Lab: '#f59e0b', Study: '#06b6d4', Personal: '#a855f7',
  Work: '#3b82f6', Other: '#94a3b8',
}
const categoryIcons = {
  Class: '📚', Deadline: '⚠️', Meeting: '🤝',
  Lab: '🔬', Study: '📖', Personal: '👤',
  Work: '💼', Other: '📌',
}

function Confetti({ show }) {
  if (!show) return null
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ['#6366f1','#f43f5e','#10b981','#f59e0b','#06b6d4','#a855f7','#fff'][Math.floor(Math.random() * 7)],
    delay: Math.random() * 1,
    size: 5 + Math.random() * 9,
    shape: Math.random() > 0.5,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.left}%`, top: '-20px',
          width: `${p.size}px`, height: `${p.size}px`,
          background: p.color, borderRadius: p.shape ? '50%' : '2px',
          animation: `confettiFall ${1.2 + Math.random()}s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user, logout, can } = useAuth()
  const navigate = useNavigate()

  const [schedules, setSchedules]       = useState([])
  const [newCardIds, setNewCardIds]     = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [greeting, setGreeting]         = useState('')
  const [greetEmoji, setGreetEmoji]     = useState('')
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [viewMode, setViewMode]         = useState('grid')
  const [filterCat, setFilterCat]       = useState('All')
  const prevLengthRef = useRef(0)

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12)      { setGreeting('Good Morning');   setGreetEmoji('🌅') }
    else if (h < 17) { setGreeting('Good Afternoon'); setGreetEmoji('☀️') }
    else             { setGreeting('Good Evening');   setGreetEmoji('🌙') }
  }, [])

  useEffect(() => {
    loadSchedules()
    const interval = setInterval(loadSchedules, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadSchedules = () => {
    const saved = JSON.parse(localStorage.getItem('schedules') || '[]')
    const mapped = saved.map(s => ({
      ...s,
      bg:    bgMap[s.category]          || '#1e1e2e',
      color: categoryColors[s.category] || '#94a3b8',
      icon:  categoryIcons[s.category]  || '📌',
    }))
    if (mapped.length > prevLengthRef.current && prevLengthRef.current !== 0) {
      const newIds = mapped.slice(prevLengthRef.current).map(s => s.id)
      setNewCardIds(newIds)
      setShowConfetti(true)
      setTimeout(() => setNewCardIds([]), 1200)
      setTimeout(() => setShowConfetti(false), 3000)
    }
    prevLengthRef.current = mapped.length
    setSchedules(mapped)
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const getInitials = (name) => {
    if (!name) return 'U'
    const p = name.trim().split(' ')
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase()
  }

  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  const currentUserData = registeredUsers.find(u => u.email === user?.email)
  const joinDate        = currentUserData?.joined || new Date().toLocaleDateString()
  const todayStr        = new Date().toISOString().split('T')[0]
  const todayEvents     = schedules.filter(s => s.date === todayStr).length
  const upcomingEvents  = schedules.filter(s => s.date > todayStr).length

  const categories = ['All', ...new Set(schedules.map(s => s.category))]
  const filtered   = filterCat === 'All' ? schedules : schedules.filter(s => s.category === filterCat)

  const navItems = [
    { icon: '🏠', label: 'Dashboard',    path: '/dashboard' },
    { icon: '📅', label: 'Calendar',     path: '/calendar'  },
    { icon: '➕', label: 'Add Schedule', path: '/add'       },
    { icon: '📁', label: 'My Schedules', path: '/schedules' },
    { icon: '🔐', label: 'RBAC Demo',    path: '/rbac'      },
    ...(can('access_admin') ? [{ icon: '👑', label: 'Admin Panel', path: '/admin' }] : []),
    { icon: '⚙️', label: 'Settings',     path: '/settings'  },
  ]

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '4px' }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '4px 8px' }}>
        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 16px rgba(79,70,229,0.5)', flexShrink: 0 }}>
          🗓️
        </div>
        <div>
          <span style={{ color: '#fff', fontSize: '17px', fontWeight: '800' }}>Smart </span>
          <span style={{ color: '#818cf8', fontSize: '17px', fontWeight: '800' }}>Scheduler</span>
        </div>
      </div>

      {/* Profile */}
      <div style={{ background: 'rgba(79,70,229,0.08)', borderRadius: '16px', padding: '14px', marginBottom: '8px', border: '1px solid rgba(79,70,229,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', flexShrink: 0, boxShadow: '0 4px 12px rgba(79,70,229,0.5)' }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
            <p style={{ color: '#475569', fontSize: '10px', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '8px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#818cf8', fontSize: '14px', fontWeight: '800', display: 'block' }}>{schedules.length}</span>
            <span style={{ color: '#475569', fontSize: '10px' }}>Tasks</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', height: '28px' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '800', display: 'block' }}>{todayEvents}</span>
            <span style={{ color: '#475569', fontSize: '10px' }}>Today</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      {navItems.map((item, i) => {
        const active = item.path === '/dashboard'
        return (
          <div
            key={i}
            onClick={() => { navigate(item.path); setSidebarOpen(false) }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', color: active ? '#a5b4fc' : '#64748b', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', background: active ? 'rgba(79,70,229,0.2)' : 'transparent', borderLeft: active ? '3px solid #4f46e5' : '3px solid transparent', fontWeight: active ? '700' : '400', marginBottom: '2px' }}
          >
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
            {active && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#4f46e5' }} />}
          </div>
        )
      })}

      <div style={{ flex: 1 }} />

      <div onClick={logout} style={{ padding: '11px 14px', borderRadius: '12px', color: '#f87171', background: 'rgba(239,68,68,0.08)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(239,68,68,0.12)', marginTop: '8px' }}>
        🚪 <span>Logout</span>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg,#07060f 0%,#0d0b1a 30%,#0a0f1e 60%,#0d0a18 100%)', position: 'relative', overflow: 'hidden' }}>
      <Confetti show={showConfetti} />

      {/* Background blobs */}
      <div style={{ position: 'fixed', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,70,229,0.07),transparent 70%)', top: '-150px', left: '-100px', pointerEvents: 'none', zIndex: 0, animation: 'blobFloat1 18s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)', bottom: '-100px', right: '-80px', pointerEvents: 'none', zIndex: 0, animation: 'blobFloat2 22s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.04),transparent 70%)', top: '40%', right: '20%', pointerEvents: 'none', zIndex: 0, animation: 'blobFloat3 26s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.04),transparent 70%)', bottom: '20%', left: '30%', pointerEvents: 'none', zIndex: 0, animation: 'blobFloat4 20s ease-in-out infinite' }} />

      <style>{`
        @keyframes blobFloat1 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,-20px) scale(1.05);} 66%{transform:translate(-20px,15px) scale(0.97);} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(-25px,20px) scale(1.03);} 66%{transform:translate(20px,-15px) scale(0.98);} }
        @keyframes blobFloat3 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(15px,25px) scale(1.04);} }
        @keyframes blobFloat4 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-15px,-20px) scale(1.02);} }
        @keyframes slideUp    { from{opacity:0;transform:translateY(32px) scale(0.96);} to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes popIn      { 0%{opacity:0;transform:scale(0.4) rotate(-5deg);} 65%{opacity:1;transform:scale(1.06) rotate(1deg);} 100%{opacity:1;transform:scale(1) rotate(0deg);} }
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1;} 100%{transform:translateY(105vh) rotate(720deg);opacity:0;} }
        @keyframes fadeInUp   { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse2     { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.7;transform:scale(0.97);} }
        @keyframes slideInLeft{ from{transform:translateX(-100%);} to{transform:translateX(0);} }
        .task-card:hover { transform:translateY(-6px) scale(1.01) !important; box-shadow:0 20px 48px rgba(0,0,0,0.4) !important; z-index:2; }
        .add-btn:hover   { transform:translateY(-2px) !important; box-shadow:0 10px 28px rgba(79,70,229,0.55) !important; }
        .stat-card:hover { transform:translateY(-3px) !important; }
        @media(max-width:900px){
          .desk-sb  { display:none !important; }
          .mob-bar  { display:flex !important; }
          .main-db  { margin-left:0 !important; padding:16px !important; }
          .stats-db { grid-template-columns:repeat(2,1fr) !important; }
          .cards-db { grid-template-columns:1fr 1fr !important; }
          .banner-db{ flex-direction:column !important; align-items:flex-start !important; }
          .banner-r { width:100% !important; justify-content:space-between !important; }
        }
        @media(max-width:560px){
          .cards-db  { grid-template-columns:1fr !important; }
          .cats-db   { overflow-x:auto !important; flex-wrap:nowrap !important; }
        }
      `}</style>

      {/* DESKTOP SIDEBAR */}
      <aside className="desk-sb" style={{ width: '268px', minHeight: '100vh', background: 'rgba(10,9,20,0.97)', backdropFilter: 'blur(20px)', padding: '24px 16px', position: 'fixed', left: 0, top: 0, borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 100, overflowY: 'auto', boxShadow: '4px 0 32px rgba(0,0,0,0.4)' }}>
        <SidebarContent />
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(4px)', display: 'flex' }} onClick={() => setSidebarOpen(false)}>
          <aside style={{ width: '285px', background: 'rgba(10,9,20,0.98)', padding: '24px 16px', overflowY: 'auto', animation: 'slideInLeft 0.25s ease', boxShadow: '8px 0 40px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* MAIN */}
      <main className="main-db" style={{ marginLeft: '268px', padding: '28px', flex: 1, minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {/* Mobile top bar */}
        <div className="mob-bar" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.25)', color: '#818cf8', borderRadius: '10px', padding: '8px 12px', fontSize: '18px', cursor: 'pointer' }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🗓️</span>
            <span style={{ color: '#fff', fontSize: '16px', fontWeight: '800' }}>Smart <span style={{ color: '#818cf8' }}>Scheduler</span></span>
          </div>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px' }}>
            {getInitials(user?.name)}
          </div>
        </div>

        {/* GREETING */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px', animation: 'fadeInUp 0.4s ease' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
              {greetEmoji} {greeting}, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p style={{ color: '#475569', marginTop: '4px', fontSize: '13px' }}>{today}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[{ mode: 'grid', icon: '⊞' },{ mode: 'list', icon: '☰' }].map(v => (
                <button key={v.mode} onClick={() => setViewMode(v.mode)} style={{ background: viewMode===v.mode ? '#4f46e5' : 'transparent', color: viewMode===v.mode ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s' }}>{v.icon}</button>
              ))}
            </div>
            {/* Add button */}
            <button className="add-btn" onClick={() => navigate('/add')} style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '11px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(79,70,229,0.4)', whiteSpace: 'nowrap' }}>
              <span>➕</span>
              <span>New Schedule</span>
            </button>
          </div>
        </div>

        {/* USER BANNER */}
        <div className="banner-db" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '18px 22px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', animation: 'fadeInUp 0.5s ease', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle,rgba(79,70,229,0.15),transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px', flexShrink: 0, boxShadow: '0 6px 20px rgba(79,70,229,0.5)' }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#fff', fontSize: '17px', fontWeight: '800', margin: 0 }}>{user?.name}</p>
            <p style={{ color: '#475569', fontSize: '12px', marginTop: '3px' }}>📧 {user?.email}</p>
          </div>
          <div className="banner-r" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            {[
              { val: schedules.length, lbl: 'Total',    color: '#818cf8' },
              { val: todayEvents,      lbl: 'Today',    color: '#10b981' },
              { val: upcomingEvents,   lbl: 'Upcoming', color: '#f59e0b' },
              { val: joinDate,         lbl: 'Joined',   color: '#06b6d4' },
            ].map((s,i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ color: s.color, fontSize: '16px', fontWeight: '800', margin: 0 }}>{s.val}</p>
                <p style={{ color: '#475569', fontSize: '10px', margin: '2px 0 0' }}>{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="stats-db" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Total Tasks', value: schedules.length, icon: '📋', color: '#6366f1', grad: 'linear-gradient(135deg,#1e1b4b,#312e81)' },
            { label: "Today's",     value: todayEvents,      icon: '⏰', color: '#10b981', grad: 'linear-gradient(135deg,#0d2d24,#064e3b)' },
            { label: 'Upcoming',    value: upcomingEvents,   icon: '🚀', color: '#f59e0b', grad: 'linear-gradient(135deg,#2d2010,#78350f)' },
            { label: 'Completed',   value: 0,                icon: '✅', color: '#a855f7', grad: 'linear-gradient(135deg,#1e1040,#4a044e)' },
          ].map((s,i) => (
            <div key={i} className="stat-card" style={{ background: s.grad, borderRadius: '18px', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '12px', border: `1px solid ${s.color}30`, boxShadow: '0 8px 24px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.05)', transition: 'transform 0.2s', animation: `fadeInUp 0.4s ease ${i*0.08}s both` }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: s.color+'25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: `0 4px 12px ${s.color}30` }}>
                {s.icon}
              </div>
              <div>
                <p style={{ color: s.color, fontSize: '28px', fontWeight: '800', margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0', fontWeight: '500' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CATEGORY FILTERS */}
        {schedules.length > 0 && (
          <div className="cats-db" style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: `1px solid ${filterCat===cat ? '#4f46e5' : 'rgba(255,255,255,0.08)'}`, background: filterCat===cat ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.04)', color: filterCat===cat ? '#fff' : '#64748b', whiteSpace: 'nowrap', boxShadow: filterCat===cat ? '0 4px 12px rgba(79,70,229,0.35)' : 'none' }}>
                {cat === 'All' ? '🌐 All' : `${categoryIcons[cat] || '📌'} ${cat}`}
              </button>
            ))}
          </div>
        )}

        {/* SECTION HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>📋 My Schedules</h2>
            <span style={{ background: 'rgba(79,70,229,0.15)', color: '#818cf8', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '700' }}>
              {filtered.length} tasks
            </span>
          </div>
          {showConfetti && (
            <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(16,185,129,0.3)', animation: 'pulse2 1s ease infinite' }}>
              🎉 Schedule added!
            </span>
          )}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '2px dashed rgba(255,255,255,0.07)', animation: 'fadeInUp 0.5s ease', backdropFilter: 'blur(10px)' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '2px solid rgba(79,70,229,0.2)', fontSize: '52px' }}>
              🗓️
            </div>
            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 8px' }}>No schedules yet!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px', textAlign: 'center', maxWidth: '300px' }}>
              Start organizing your day by adding your first schedule.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: '📅', text: 'Add meetings & tasks' },
                { icon: '⏰', text: 'Set time reminders'   },
                { icon: '📤', text: 'Export to calendar'   },
              ].map((tip,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '18px' }}>{tip.icon}</span>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{tip.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/add')} style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '14px', padding: '14px 32px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 24px rgba(79,70,229,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ➕ Add Your First Schedule
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {filtered.length > 0 && viewMode === 'grid' && (
          <div className="cards-db" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '18px' }}>
            {filtered.map((item, idx) => {
              const isNew = newCardIds.includes(item.id)
              return (
                <div
                  key={item.id}
                  className="task-card"
                  style={{ borderRadius: '20px', padding: 0, border: `1px solid ${item.color}40`, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', animation: isNew ? 'popIn 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards' : `fadeInUp 0.4s ease ${idx*0.06}s both`, transition: 'transform 0.25s,box-shadow 0.25s', boxShadow: `0 4px 24px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.04)`, background: item.bg, backdropFilter: 'blur(10px)' }}
                >
                  <div style={{ height: '4px', background: `linear-gradient(90deg,${item.color},${item.color}88)`, flexShrink: 0 }} />
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: item.color+'20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                          {item.icon}
                        </div>
                        <span style={{ background: item.color+'20', color: item.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                          {item.category}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isNew && <span style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', borderRadius: '20px', padding: '3px 8px', fontSize: '10px', fontWeight: '700' }}>✨ New</span>}
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.priority==='High' ? '#f43f5e' : item.priority==='Medium' ? '#f59e0b' : '#10b981', boxShadow: `0 0 6px ${item.priority==='High' ? '#f43f5e' : item.priority==='Medium' ? '#f59e0b' : '#10b981'}` }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', lineHeight: '1.4', margin: 0 }}>{item.title}</h3>
                    {item.description && (
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ height: '1px', background: item.color+'30' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>📅 {item.date}</span>
                      <span style={{ background: item.color+'25', color: item.color, padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>⏰ {item.time}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {filtered.length > 0 && viewMode === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((item, idx) => {
              const isNew = newCardIds.includes(item.id)
              return (
                <div
                  key={item.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `4px solid ${item.color}`, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', animation: isNew ? 'popIn 0.6s ease forwards' : `fadeInUp 0.3s ease ${idx*0.05}s both`, transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: item.color+'20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#fff', fontWeight: '700', fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: '3px 0 0' }}>📅 {item.date} · ⏰ {item.time}</p>
                  </div>
                  <span style={{ background: item.color+'20', color: item.color, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>
                    {item.category}
                  </span>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.priority==='High' ? '#f43f5e' : item.priority==='Medium' ? '#f59e0b' : '#10b981', flexShrink: 0, boxShadow: `0 0 6px ${item.priority==='High' ? '#f43f5e' : item.priority==='Medium' ? '#f59e0b' : '#10b981'}` }} />
                </div>
              )
            })}
          </div>
        )}

        <div style={{ height: '40px' }} />
      </main>
    </div>
  )
}