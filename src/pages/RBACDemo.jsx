import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

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
  admin:   { label: 'Admin',   icon: '👑', color: '#f43f5e', bg: '#2d1b1b', desc: 'Full system access. Can manage all users and schedules.' },
  teacher: { label: 'Teacher', icon: '👨‍🏫', color: '#f59e0b', bg: '#2d2010', desc: 'Can view all schedules, create and manage own schedules.' },
  student: { label: 'Student', icon: '👨‍🎓', color: '#10b981', bg: '#0d2d24', desc: 'Can only view and manage own schedules.' },
}

function PageLayout({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#07060f 0%,#0d0b1a 50%,#0a0f1e 100%)', padding: '20px' }}>
      <style>{`
        @media(max-width:768px){
          * { maxWidth: 100% !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          {title}
        </h1>
        {subtitle && <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>{subtitle}</p>}
        <div style={{ height: '20px' }} />
        {children}
      </div>
    </div>
  )
}

export default function RBACDemo() {
  const { user, can, myPermissions } = useAuth()
  const navigate = useNavigate()
  const roleInfo = ROLE_INFO[user?.role] || {}
  const myPerms = myPermissions()

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
          from{ opacity:0; transform:translateY(16px); }
          to  { opacity:1; transform:translateY(0); }
        }
        .card {
          background: rgba(255,255,255,0.03) !important;
          border-radius: 18px !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          padding: 24px !important;
          margin-bottom: 24px !important;
          backdrop-filter: blur(10px) !important;
          animation: rbacFade 0.4s ease forwards !important;
        }
        .rbac-tests { 
          display: grid; 
          gap: 12px; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        }
        .rbac-perms { 
          display: grid; 
          gap: 10px; 
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); 
        }
        .rbac-roles { 
          display: grid; 
          gap: 16px; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        }
        .rbac-points {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .rbac-matrix-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .rbac-matrix {
          min-width: 650px;
          border-radius: 12px;
          overflow: hidden;
        }

        /* Mobile specific */
        @media(max-width:768px){
          .card { padding: 20px 16px !important; margin-bottom: 20px !important; }
          .rbac-tests { grid-template-columns: 1fr !important; }
          .rbac-perms { 
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important; 
          }
          .rbac-roles { grid-template-columns: 1fr !important; }
          .rbac-points { grid-template-columns: 1fr !important; }
          .rbac-matrix { min-width: 500px !important; }
          .role-badge-top { 
            flex-direction: column !important; 
            align-items: flex-start !important; 
            gap: 16px !important; 
            margin-bottom: 24px !important;
          }
        }
        @media(max-width:480px){
          .rbac-tests { grid-template-columns: 1fr !important; }
          .rbac-perms { grid-template-columns: repeat(2, 1fr) !important; }
          .rbac-matrix { min-width: 450px !important; }
        }
      `}</style>

      {/* Role badge */}
      <div className="role-badge-top card" style={{ animationDelay: '0s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: roleInfo.color+'25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: `1px solid ${roleInfo.color}40` }}>
              {roleInfo.icon}
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: '16px', fontWeight: '800', margin: 0 }}>Your Role: {roleInfo.label}</p>
              <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>{myPerms.length} of {ALL_PERMISSIONS.length} permissions granted</p>
            </div>
          </div>
          <div style={{ background: roleInfo.color+'20', color: roleInfo.color, border: `1px solid ${roleInfo.color}44`, borderRadius: '12px', padding: '8px 16px', fontSize: '13px', fontWeight: '700' }}>
            {roleInfo.icon} {roleInfo.label}
          </div>
        </div>
      </div>

      {/* Theory Box */}
      <div className="card" style={{ animationDelay: '0.05s' }}>
        <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>📚 What is RBAC?</h3>
        <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>
          <strong style={{ color: '#818cf8' }}>Role-Based Access Control (RBAC)</strong> is a security model where permissions are assigned to <strong style={{ color: '#fff' }}>roles</strong>, and users are assigned to roles. A user gets access only if their role has the required permission.
        </p>
        <div className="rbac-points">
          {[
            { icon: '👤', text: 'Users are assigned one role'                  },
            { icon: '🏷️', text: 'Roles hold a set of permissions'              },
            { icon: '🔑', text: 'Permissions grant access to specific actions' },
            { icon: '🚫', text: 'Access denied if role lacks the permission'   },
          ].map((p,i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{p.icon}</span>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="card" style={{ animationDelay: '0.1s' }}>
        <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>📊 Permission Matrix</h3>
        <div className="rbac-matrix-wrap">
          <div className="rbac-matrix">
            <div style={{ display: 'flex', gap: '12px', padding: '12px 16px', background: 'rgba(79,70,229,0.1)', color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
              <span style={{ flex: 3 }}>PERMISSION</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#f43f5e' }}>👑 Admin</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#f59e0b' }}>👨‍🏫 Teacher</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#10b981' }}>👨‍🎓 Student</span>
            </div>
            {ALL_PERMISSIONS.map((perm, i) => (
              <div key={perm} style={{ display: 'flex', gap: '12px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent', fontSize: '12px' }}>
                <span style={{ flex: 3 }}>
                  <code style={{ background: 'rgba(79,70,229,0.1)', color: '#818cf8', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace' }}>{perm}</code>
                </span>
                <span style={{ flex: 1, textAlign: 'center' }}>{ROLE_PERMISSIONS.admin.includes(perm)   ? '✅' : '❌'}</span>
                <span style={{ flex: 1, textAlign: 'center' }}>{ROLE_PERMISSIONS.teacher.includes(perm) ? '✅' : '❌'}</span>
                <span style={{ flex: 1, textAlign: 'center' }}>{ROLE_PERMISSIONS.student.includes(perm) ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Your Permissions */}
      <div className="card" style={{ animationDelay: '0.15s' }}>
        <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🔑 Your Permissions
          <span style={{ background: roleInfo.color+'20', color: roleInfo.color, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '700' }}>
            {myPerms.length} / {ALL_PERMISSIONS.length}
          </span>
        </h3>
        <div className="rbac-perms">
          {ALL_PERMISSIONS.map(perm => {
            const granted = can(perm)
            return (
              <div key={perm} style={{ borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', background: granted ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${granted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)'}`, opacity: granted ? 1 : 0.5 }}>
                <span style={{ fontSize: '18px' }}>{granted ? '✅' : '🔒'}</span>
                <code style={{ fontSize: '10px', color: granted ? '#10b981' : '#64748b', wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: '1.4', textAlign: 'center' }}>
                  {perm.replace(/_/g, ' ')}
                </code>
              </div>
            )
          })}
        </div>
      </div>

      {/* Live Test */}
      <div className="card" style={{ animationDelay: '0.2s' }}>
        <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>🧪 Live Permission Test</h3>
        <div className="rbac-tests">
          {liveTests.map((test, i) => {
            const result = can(test.perm)
            return (
              <div key={i} style={{ borderRadius: '16px', padding: '16px', border: `1px solid ${result ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, background: result ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>{result ? '✅' : '❌'}</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: result ? '#10b981' : '#f43f5e', background: result ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', padding: '4px 10px', borderRadius: '20px' }}>
                    {result ? 'ALLOWED' : 'DENIED'}
                  </span>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', margin: '0 0 6px' }}>{test.label}</p>
                <code style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace', display: 'block' }}>{test.perm}</code>
              </div>
            )
          })}
        </div>
      </div>

      {/* All Roles */}
      <div className="card" style={{ animationDelay: '0.25s' }}>
        <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>👥 All Roles Summary</h3>
        <div className="rbac-roles">
          {Object.entries(ROLE_INFO).map(([role, info]) => (
            <div key={role} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', border: `1px solid ${info.color}33`, boxShadow: user?.role===role ? `0 0 0 3px ${info.color}20` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '28px' }}>{info.icon}</span>
                <div>
                  <p style={{ color: info.color, fontSize: '16px', fontWeight: '800', margin: 0 }}>{info.label}</p>
                  {user?.role === role && (
                    <span style={{ background: info.color+'20', color: info.color, padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>← You are here</span>
                  )}
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '14px', lineHeight: '1.6' }}>{info.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ROLE_PERMISSIONS[role].slice(0,6).map(p => (
                  <span key={p} style={{ background: info.color+'15', color: info.color, padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '600' }}>
                    {p.replace(/_/g,' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                ))}
                {ROLE_PERMISSIONS[role].length > 6 && (
                  <span style={{ background: info.color+'10', color: info.color+'80', padding: '4px 8px', borderRadius: '8px', fontSize: '10px' }}>+{ROLE_PERMISSIONS[role].length-6} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
