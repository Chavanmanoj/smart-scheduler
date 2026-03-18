import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageLayout from '../components/PageLayout'

const ALL_PERMISSIONS = [
  'view_own_schedules', 'view_all_schedules', 'create_schedule',
  'edit_own_schedule',  'edit_any_schedule',  'delete_own_schedule',
  'delete_any_schedule','export_ics',          'view_users',
  'manage_users',       'view_logs',           'access_admin',
]

const ROLE_PERMISSIONS = {
  admin:   ['view_own_schedules','view_all_schedules','create_schedule','edit_own_schedule','edit_any_schedule','delete_own_schedule','delete_any_schedule','export_ics','view_users','manage_users','view_logs','access_admin'],
  teacher: ['view_own_schedules','view_all_schedules','create_schedule','edit_own_schedule','delete_own_schedule','export_ics','view_users'],
  student: ['view_own_schedules','create_schedule','edit_own_schedule','delete_own_schedule','export_ics'],
}

const ROLE_INFO = {
  admin:   { label: 'Admin',   icon: '👑', color: '#f43f5e', desc: 'Full system access. Can manage all users and schedules.' },
  teacher: { label: 'Teacher', icon: '👨‍🏫', color: '#f59e0b', desc: 'Can view all schedules, create and manage own schedules.' },
  student: { label: 'Student', icon: '👨‍🎓', color: '#10b981', desc: 'Can only view and manage own schedules.' },
}

export default function RBACDemo() {
  const { user, can, myPermissions } = useAuth()
  const roleInfo = ROLE_INFO[user?.role] || {}
  const myPerms  = myPermissions()

  const liveTests = [
    { label: 'Can view all schedules?',  perm: 'view_all_schedules'  },
    { label: 'Can delete any schedule?', perm: 'delete_any_schedule' },
    { label: 'Can manage users?',        perm: 'manage_users'        },
    { label: 'Can export ICS file?',     perm: 'export_ics'          },
    { label: 'Can access admin panel?',  perm: 'access_admin'        },
    { label: 'Can view access logs?',    perm: 'view_logs'           },
  ]

  return (
    <PageLayout title="🔐 RBAC Demo" subtitle="Role-Based Access Control — Information Cyber Security">
      <style>{`
        @keyframes rbacFade {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── DESKTOP ── */
        @media(min-width:769px) {
          .rbac-tests  { grid-template-columns: repeat(3,1fr) !important; }
          .rbac-roles  { grid-template-columns: repeat(3,1fr) !important; }
          .rbac-perms  { grid-template-columns: repeat(4,1fr) !important; }
          .rbac-points { grid-template-columns: repeat(2,1fr) !important; }
          .role-top    { flex-direction: row !important; }
        }

        /* ── MOBILE ── */
        @media(max-width:768px) {
          .role-top         { flex-direction:column !important; align-items:flex-start !important; gap:12px !important; }
          .role-top-badge   { align-self:flex-start !important; }
          .rbac-matrix-wrap { overflow-x:auto !important; -webkit-overflow-scrolling:touch; padding-bottom:4px; }
          .rbac-matrix      { min-width:460px !important; }
          .rbac-tests       { grid-template-columns:1fr 1fr !important; gap:10px !important; }
          .rbac-roles       { grid-template-columns:1fr !important; }
          .rbac-perms       { grid-template-columns:repeat(2,1fr) !important; }
          .rbac-points      { grid-template-columns:1fr !important; }
          .rbac-box         { padding:16px !important; border-radius:16px !important; }
          .rbac-title       { font-size:14px !important; }
        }
        @media(max-width:480px) {
          .rbac-tests { grid-template-columns:1fr !important; }
          .rbac-perms { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      {/* ── ROLE BADGE TOP ── */}
      <div className="role-top" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', animation:'rbacFade 0.4s ease', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:roleInfo.color+'25', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', border:`1px solid ${roleInfo.color}44`, flexShrink:0 }}>
            {roleInfo.icon}
          </div>
          <div>
            <p style={{ color:'#fff', fontSize:'16px', fontWeight:'800', margin:0 }}>Your Role: {roleInfo.label}</p>
            <p style={{ color:'#64748b', fontSize:'12px', margin:'2px 0 0' }}>{myPerms.length} of {ALL_PERMISSIONS.length} permissions granted</p>
          </div>
        </div>
        <div className="role-top-badge" style={{ background:roleInfo.color+'20', color:roleInfo.color, border:`1px solid ${roleInfo.color}44`, borderRadius:'12px', padding:'8px 16px', fontSize:'13px', fontWeight:'700', flexShrink:0 }}>
          {roleInfo.icon} {roleInfo.label}
        </div>
      </div>

      {/* ── THEORY ── */}
      <div className="rbac-box" style={{ background:'rgba(255,255,255,0.03)', borderRadius:'18px', border:'1px solid rgba(255,255,255,0.06)', padding:'20px', marginBottom:'16px', backdropFilter:'blur(10px)', animation:'rbacFade 0.4s ease 0.05s both' }}>
        <h3 className="rbac-title" style={{ color:'#fff', fontSize:'15px', fontWeight:'800', marginBottom:'12px' }}>📚 What is RBAC?</h3>
        <p style={{ color:'#94a3b8', fontSize:'13px', lineHeight:'1.7', marginBottom:'14px' }}>
          <strong style={{ color:'#818cf8' }}>Role-Based Access Control (RBAC)</strong> is a security model where permissions are assigned to <strong style={{ color:'#fff' }}>roles</strong>, and users are assigned to roles. A user gets access only if their role has the required permission.
        </p>
        <div className="rbac-points" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'8px' }}>
          {[
            { icon:'👤', text:'Users are assigned one role'                  },
            { icon:'🏷️', text:'Roles hold a set of permissions'              },
            { icon:'🔑', text:'Permissions grant access to specific actions' },
            { icon:'🚫', text:'Access denied if role lacks permission'       },
          ].map((p,i) => (
            <div key={i} style={{ display:'flex', gap:'10px', alignItems:'center', background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'10px 12px', border:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize:'16px', flexShrink:0 }}>{p.icon}</span>
              <span style={{ color:'#94a3b8', fontSize:'12px', lineHeight:'1.4' }}>{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PERMISSION MATRIX ── */}
      <div className="rbac-box" style={{ background:'rgba(255,255,255,0.03)', borderRadius:'18px', border:'1px solid rgba(255,255,255,0.06)', padding:'20px', marginBottom:'16px', backdropFilter:'blur(10px)', animation:'rbacFade 0.4s ease 0.1s both' }}>
        <h3 className="rbac-title" style={{ color:'#fff', fontSize:'15px', fontWeight:'800', marginBottom:'14px' }}>📊 Permission Matrix</h3>
        <p style={{ color:'#64748b', fontSize:'11px', marginBottom:'10px' }}>👉 Scroll right on mobile to see full table</p>
        <div className="rbac-matrix-wrap">
          <div className="rbac-matrix" style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' }}>
            {/* Header */}
            <div style={{ display:'flex', gap:'12px', padding:'11px 14px', background:'rgba(79,70,229,0.12)', color:'#64748b', fontSize:'11px', fontWeight:'700', letterSpacing:'0.5px' }}>
              <span style={{ flex:3, minWidth:'160px' }}>PERMISSION</span>
              <span style={{ flex:1, textAlign:'center', color:'#f43f5e', minWidth:'70px' }}>👑 Admin</span>
              <span style={{ flex:1, textAlign:'center', color:'#f59e0b', minWidth:'70px' }}>👨‍🏫 Teacher</span>
              <span style={{ flex:1, textAlign:'center', color:'#10b981', minWidth:'70px' }}>👨‍🎓 Student</span>
            </div>
            {ALL_PERMISSIONS.map((perm, i) => (
              <div key={perm} style={{ display:'flex', gap:'12px', padding:'9px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:i%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <span style={{ flex:3, minWidth:'160px' }}>
                  <code style={{ background:'rgba(79,70,229,0.1)', color:'#818cf8', padding:'2px 7px', borderRadius:'4px', fontSize:'10px', fontFamily:'monospace', whiteSpace:'nowrap' }}>{perm}</code>
                </span>
                <span style={{ flex:1, textAlign:'center', fontSize:'14px', minWidth:'70px' }}>{ROLE_PERMISSIONS.admin.includes(perm)   ? '✅' : '❌'}</span>
                <span style={{ flex:1, textAlign:'center', fontSize:'14px', minWidth:'70px' }}>{ROLE_PERMISSIONS.teacher.includes(perm) ? '✅' : '❌'}</span>
                <span style={{ flex:1, textAlign:'center', fontSize:'14px', minWidth:'70px' }}>{ROLE_PERMISSIONS.student.includes(perm) ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── YOUR PERMISSIONS ── */}
      <div className="rbac-box" style={{ background:'rgba(255,255,255,0.03)', borderRadius:'18px', border:'1px solid rgba(255,255,255,0.06)', padding:'20px', marginBottom:'16px', backdropFilter:'blur(10px)', animation:'rbacFade 0.4s ease 0.15s both' }}>
        <h3 className="rbac-title" style={{ color:'#fff', fontSize:'15px', fontWeight:'800', marginBottom:'14px', display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
          🔑 Your Permissions
          <span style={{ background:roleInfo.color+'20', color:roleInfo.color, borderRadius:'20px', padding:'3px 10px', fontSize:'11px', fontWeight:'700' }}>
            {myPerms.length} / {ALL_PERMISSIONS.length} granted
          </span>
        </h3>
        <div className="rbac-perms" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
          {ALL_PERMISSIONS.map(perm => {
            const granted = can(perm)
            return (
              <div key={perm} style={{ borderRadius:'10px', padding:'10px', display:'flex', flexDirection:'column', gap:'6px', background:granted ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)', border:`1px solid ${granted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)'}`, opacity:granted ? 1 : 0.4, transition:'all 0.2s' }}>
                <span style={{ fontSize:'14px' }}>{granted ? '✅' : '🔒'}</span>
                <code style={{ fontSize:'9px', color:granted ? '#10b981' : '#64748b', wordBreak:'break-all', fontFamily:'monospace', lineHeight:'1.5' }}>
                  {perm}
                </code>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── LIVE TEST ── */}
      <div className="rbac-box" style={{ background:'rgba(255,255,255,0.03)', borderRadius:'18px', border:'1px solid rgba(255,255,255,0.06)', padding:'20px', marginBottom:'16px', backdropFilter:'blur(10px)', animation:'rbacFade 0.4s ease 0.2s both' }}>
        <h3 className="rbac-title" style={{ color:'#fff', fontSize:'15px', fontWeight:'800', marginBottom:'14px' }}>🧪 Live Permission Test</h3>
        <div className="rbac-tests" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
          {liveTests.map((test, i) => {
            const result = can(test.perm)
            return (
              <div key={i} style={{ borderRadius:'14px', padding:'14px', border:`1px solid ${result ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, background:result ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', animation:`rbacFade 0.3s ease ${i*0.05}s both` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                  <span style={{ fontSize:'20px' }}>{result ? '✅' : '❌'}</span>
                  <span style={{ fontSize:'10px', fontWeight:'800', color:result ? '#10b981' : '#f43f5e', background:result ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', padding:'2px 8px', borderRadius:'20px' }}>
                    {result ? 'ALLOWED' : 'DENIED'}
                  </span>
                </div>
                <p style={{ color:'#e2e8f0', fontSize:'12px', fontWeight:'600', margin:'0 0 4px', lineHeight:'1.4' }}>{test.label}</p>
                <code style={{ color:'#64748b', fontSize:'10px', fontFamily:'monospace' }}>{test.perm}</code>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── ALL ROLES ── */}
      <div className="rbac-box" style={{ background:'rgba(255,255,255,0.03)', borderRadius:'18px', border:'1px solid rgba(255,255,255,0.06)', padding:'20px', animation:'rbacFade 0.4s ease 0.25s both' }}>
        <h3 className="rbac-title" style={{ color:'#fff', fontSize:'15px', fontWeight:'800', marginBottom:'14px' }}>👥 All Roles Summary</h3>
        <div className="rbac-roles" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
          {Object.entries(ROLE_INFO).map(([role, info]) => (
            <div key={role} style={{ background:'rgba(255,255,255,0.03)', borderRadius:'16px', padding:'18px', border:`1px solid ${info.color}33`, boxShadow:user?.role===role ? `0 0 0 2px ${info.color}` : 'none', transition:'all 0.2s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                <span style={{ fontSize:'24px' }}>{info.icon}</span>
                <div>
                  <p style={{ color:info.color, fontSize:'14px', fontWeight:'800', margin:0 }}>{info.label}</p>
                  {user?.role === role && (
                    <span style={{ background:info.color+'20', color:info.color, padding:'1px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:'700' }}>← You</span>
                  )}
                </div>
              </div>
              <p style={{ color:'#64748b', fontSize:'11px', marginBottom:'12px', lineHeight:'1.5' }}>{info.desc}</p>
              <p style={{ color:'#475569', fontSize:'10px', fontWeight:'700', marginBottom:'8px', letterSpacing:'0.5px' }}>
                {ROLE_PERMISSIONS[role].length} PERMISSIONS
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                {ROLE_PERMISSIONS[role].map(p => (
                  <span key={p} style={{ background:info.color+'15', color:info.color, padding:'2px 7px', borderRadius:'6px', fontSize:'9px', fontWeight:'600' }}>
                    {p.replace(/_/g,' ')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </PageLayout>
  )
}