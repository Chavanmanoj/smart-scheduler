import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PageLayout({ children, title, subtitle }) {
  const { user, logout, can } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)

  const getInitials = (name) => {
    if (!name) return 'U'
    const p = name.trim().split(' ')
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase()
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', flexShrink: 0 }} />
          <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '600' }}>Online</span>
        </div>
      </div>

      {/* Nav items */}
      {navItems.map((item, i) => {
        const active = location.pathname === item.path
        return (
          <div
            key={i}
            onClick={() => { navigate(item.path); setOpen(false) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '12px',
              color: active ? '#a5b4fc' : '#64748b',
              fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
              background: active ? 'rgba(79,70,229,0.2)' : 'transparent',
              borderLeft: active ? '3px solid #4f46e5' : '3px solid transparent',
              fontWeight: active ? '700' : '400', marginBottom: '2px',
            }}
          >
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
            {active && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#4f46e5' }} />}
          </div>
        )
      })}

      <div style={{ flex: 1 }} />

      {/* Logout */}
      <div
        onClick={logout}
        style={{ padding: '11px 14px', borderRadius: '12px', color: '#f87171', background: 'rgba(239,68,68,0.08)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(239,68,68,0.12)', transition: 'all 0.2s', marginTop: '8px' }}
      >
        🚪 <span>Logout</span>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg,#07060f 0%,#0d0b1a 30%,#0a0f1e 60%,#0d0a18 100%)', position: 'relative', overflow: 'hidden' }}>

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
        @keyframes pageSlideIn { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
        @keyframes slideInLeft { from{transform:translateX(-100%);} to{transform:translateX(0);} }
        .nav-link:hover { background:rgba(79,70,229,0.1) !important; color:#c7d2fe !important; transform:translateX(4px); }
        .logout-hover:hover { background:rgba(239,68,68,0.15) !important; }
        @media(max-width:900px){
          .desk-side { display:none !important; }
          .mob-bar   { display:flex !important; }
          .pg-main   { margin-left:0 !important; padding:16px !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="desk-side" style={{ width: '268px', minHeight: '100vh', background: 'rgba(10,9,20,0.97)', backdropFilter: 'blur(20px)', padding: '24px 16px', position: 'fixed', left: 0, top: 0, borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 100, overflowY: 'auto', boxShadow: '4px 0 32px rgba(0,0,0,0.4)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(4px)', display: 'flex' }} onClick={() => setOpen(false)}>
          <aside style={{ width: '285px', background: 'rgba(10,9,20,0.98)', padding: '24px 16px', overflowY: 'auto', animation: 'slideInLeft 0.25s ease', boxShadow: '8px 0 40px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="pg-main" style={{ marginLeft: '268px', padding: '28px', flex: 1, minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {/* Mobile bar */}
        <div className="mob-bar" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
          <button onClick={() => setOpen(true)} style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.25)', color: '#818cf8', borderRadius: '10px', padding: '8px 12px', fontSize: '18px', cursor: 'pointer' }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🗓️</span>
            <span style={{ color: '#fff', fontSize: '15px', fontWeight: '800' }}>Smart <span style={{ color: '#818cf8' }}>Scheduler</span></span>
          </div>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px' }}>
            {getInitials(user?.name)}
          </div>
        </div>

        {/* Page header */}
        {title && (
          <div style={{ marginBottom: '24px', animation: 'pageSlideIn 0.5s ease' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>{title}</h1>
            {subtitle && <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{subtitle}</p>}
          </div>
        )}

        {/* Content */}
        <div style={{ animation: 'pageSlideIn 0.5s ease 0.1s both' }}>
          {children}
        </div>

      </main>
    </div>
  )
}