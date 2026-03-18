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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg,#07060f 0%,#0d0b1a 50%,#0a0f1e 100%)', 
      padding: '16px 16px 24px' 
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          color: '#fff', 
          fontSize: 'clamp(20px, 5vw, 28px)', 
          fontWeight: '800', 
          margin: '0 0 8px', 
          letterSpacing: '-0.5px' 
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: '#64748b', fontSize: 'clamp(13px, 3vw, 15px)', margin: '0 0 24px' }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

export default function RBACDemo() {
  const { user, can, myPermissions } = useAuth()
  const roleInfo = ROLE_INFO[user?.role] || {}
  const myPerms = myPermissions()

  const liveTests = [
    { label: 'View all schedules?',  perm: 'view_all_schedules'  },
    { label: 'Delete any schedule?', perm: 'delete_any_schedule' },
    { label: 'Manage users?',        perm: 'manage_users'        },
    { label: 'Export ICS file?',     perm: 'export_ics'          },
    { label: 'Access admin panel?',  perm: 'access_admin'        },
    { label: 'View access logs?',    perm: 'view_logs'           },
  ]

  return (
    <PageLayout title="🔐 RBAC Demo" subtitle="Role-Based Access Control — Information Cyber Security">
      <style>{`
        @keyframes rbacFade {
          from{ opacity:0; transform:translateY(12px); }
          to  { opacity:1; transform:translateY(0); }
        }
        * { box-sizing: border-box; }
        .card {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 18px !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
          backdrop-filter: blur(12px) !important;
          animation: rbacFade 0.4s ease forwards !important;
          overflow: hidden;
        }
        
        /* Role Badge - Mobile Stack */
        .role-badge { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          align-items: flex-start; 
        }
        @media(min-width: 769px){
          .role-badge { flex-direction: row !important; justify-content: space-between !important; align-items: center !important; }
        }

        /* Grids */
        .rbac-tests { 
          display: grid; 
          gap: 12px; 
          grid-template-columns: 1fr; 
        }
        @media(min-width: 769px){
          .rbac-tests { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media(min-width: 1200px){
          .rbac-tests { grid-template-columns: repeat(2, 1fr) !important; }
        }

        .rbac-perms { 
          display: grid; 
          gap: 10px; 
          grid-template-columns: repeat(2, 1fr); 
          max-height: 400px;
          overflow-y: auto;
        }
        @media(min-width: 769px){
          .rbac-perms { 
            grid-template-columns: repeat(4, 1fr) !important; 
            max-height: none !important;
          }
        }

        .rbac-roles { 
          display: grid; 
          gap: 16px; 
          grid-template-columns: 1fr; 
        }
        @media(min-width: 769px){
          .rbac-roles { grid-template-columns: repeat(3, 1fr) !important; }
        }

        .rbac-points {
          display: grid;
          gap: 10px;
          grid-template-columns: 1fr;
        }
        @media(min-width: 769px){
          .rbac-points { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* Matrix */
        .rbac-matrix-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          margin-top: 12px;
        }
        .rbac-matrix {
          min-width: 650px;
          border-radius: 12px;
          overflow: hidden;
        }
        @media(max-width: 768px){
          .rbac-matrix { min-width: 500px !important; }
        }

        /* Scrollbar */
        .rbac-perms::-webkit-scrollbar {
          width: 4px;
        }
        .rbac-perms::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.03);
        }
        .rbac-perms::-webkit-scrollbar-thumb {
          background: rgba(129,140,248,0.3);
          border-radius: 2px;
        }

        input:focus, button:focus {
          outline: none !important;
        }
      `}</style>

      {/* Role Badge */}
      <div className="card role-badge" style={{ animationDelay: '0s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '14px', 
            background: roleInfo.color+'25', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '24px', 
            border: `1px solid ${roleInfo.color}40` 
          }}>
            {roleInfo.icon}
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 'clamp(14px, 4vw, 16px)', fontWeight: '800', margin: 0 }}>
              Your Role: <span style={{ color: roleInfo.color }}>{roleInfo.label}</span>
            </p>
            <p style={{ color: '#64748b', fontSize: 'clamp(11px, 3vw, 12px)', margin: '2px 0 0' }}>
              {myPerms.length} of {ALL_PERMISSIONS.length} permissions granted
            </p>
          </div>
        </div>
        <div style={{ 
          background: roleInfo.color+'20', color: roleInfo.color, 
          border: `1px solid ${roleInfo.color}44`, borderRadius: '12px', 
          padding: '8px 16px', fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: '700' 
        }}>
          {roleInfo.icon} {roleInfo.label}
        </div>
      </div>

      {/* Theory Box */}
      <div className="card" style={{ animationDelay: '0.05s' }}>
        <h3 style={{ color: '#fff', fontSize: 'clamp(14px, 4vw, 15px)', fontWeight: '800', marginBottom: '16px' }}>
          📚 What is RBAC?
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 'clamp(12px, 3.5vw, 13px)', lineHeight: '1.6', marginBottom: '16px' }}>
          <strong style={{ color: '#818cf8' }}>Role-Based Access Control (RBAC)</strong> is a security model where 
          permissions are assigned to <strong style={{ color: '#fff' }}>roles</strong>, and users are assigned to roles. 
          A user gets access only if their role has the required permission.
        </p>
        <div className="rbac-points">
          {[
            { icon: '👤', text: 'Users are assigned one role' },
            { icon: '🏷️', text: 'Roles hold permissions' },
            { icon: '🔑', text: 'Permissions grant specific actions' },
            { icon: '🚫', text: 'No permission = access denied' },
          ].map((p,i) => (
            <div key={i} style={{ 
              display: 'flex', gap: '10px', alignItems: 'flex-start', 
              background: 'rgba(255,255,255,0.04)', borderRadius: '12px', 
              padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)' 
            }}>
              <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{p.icon}</span>
              <span style={{ color: '#94a3b8', fontSize: 'clamp(12px, 3vw, 13px)' }}>{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="card" style={{ animationDelay: '0.1s' }}>
        <h3 style={{ color: '#fff', fontSize: 'clamp(14px, 4vw, 15px)', fontWeight: '800', marginBottom: '16px' }}>
          📊 Permission Matrix
        </h3>
        <div className="rbac-matrix-wrap">
          <div className="rbac-matrix">
            <div style={{ 
              display: 'flex', gap: '8px', padding: '12px 16px', 
              background: 'rgba(79,70,229,0.12)', color: '#64748b', 
              fontSize: 'clamp(11px, 3vw, 12px)', fontWeight: '700', 
              letterSpacing: '0.5px' 
            }}>
              <span style={{ flex: 3, fontSize: 'clamp(10px, 2.5vw, 11px)' }}>PERMISSION</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#f43f5e', fontSize: '14px' }}>👑 Admin</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#f59e0b', fontSize: '14px' }}>👨‍🏫 Teacher</span>
              <span style={{ flex: 1, textAlign: 'center', color: '#10b981', fontSize: '14px' }}>👨‍🎓 Student</span>
            </div>
            {ALL_PERMISSIONS.map((perm, i) => (
              <div key={perm} style={{ 
                display: 'flex', gap: '8px', padding: '10px 16px', 
                borderBottom: '1px solid rgba(255,255,255,0.04)', 
                background: i%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent', 
                fontSize: 'clamp(11px, 2.8vw, 12px)' 
              }}>
                <span style={{ flex: 3 }}>
                  <code style={{ 
                    background: 'rgba(79,70,229,0.1)', color: '#818cf8', 
                    padding: '2px 8px', borderRadius: '6px', fontSize: 'clamp(10px, 2.5vw, 11px)', 
                    fontFamily: 'monospace', display: 'inline-block' 
                  }}>{perm}</code>
                </span>
                <span style={{ flex: 1, textAlign: 'center', fontSize: '16px' }}>
                  {ROLE_PERMISSIONS.admin.includes(perm) ? '✅' : '❌'}
                </span>
                <span style={{ flex: 1, textAlign: 'center', fontSize: '16px' }}>
                  {ROLE_PERMISSIONS.teacher.includes(perm) ? '✅' : '❌'}
                </span>
                <span style={{ flex: 1, textAlign: 'center', fontSize: '16px' }}>
                  {ROLE_PERMISSIONS.student.includes(perm) ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Your Permissions */}
      <div className="card" style={{ animationDelay: '0.15s' }}>
        <h3 style={{ 
          color: '#fff', fontSize: 'clamp(14px, 4vw, 15px)', 
          fontWeight: '800', marginBottom: '16px', display: 'flex', 
          alignItems: 'center', gap: '10px', flexWrap: 'wrap' 
        }}>
          🔑 Your Permissions
          <span style={{ 
            background: roleInfo.color+'20', color: roleInfo.color, 
            borderRadius: '20px', padding: '4px 12px', 
            fontSize: 'clamp(11px, 3vw, 12px)', fontWeight: '700' 
          }}>
            {myPerms.length} / {ALL_PERMISSIONS.length}
          </span>
        </h3>
        <div className="rbac-perms">
          {ALL_PERMISSIONS.map(perm => {
            const granted = can(perm)
            return (
              <div key={perm} style={{ 
                borderRadius: '12px', padding: '12px 8px', 
                display: 'flex', flexDirection: 'column', gap: '6px', 
                background: granted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)', 
                border: `1px solid ${granted ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.05)'}`,
                opacity: granted ? 1 : 0.6,
                minHeight: '80px'
              }}>
                <span style={{ fontSize: '20px', textAlign: 'center' }}>
                  {granted ? '✅' : '🔒'}
                </span>
                <code style={{ 
                  fontSize: 'clamp(9px, 2.2vw, 10px)', 
                  color: granted ? '#10b981' : '#64748b', 
                  wordBreak: 'break-word', fontFamily: 'monospace', 
                  lineHeight: '1.3', textAlign: 'center',
                  maxWidth: '100%'
                }}>
                  {perm.replace(/_/g, ' ').replace(/\\b(\\w)/g, c => c.toUpperCase())}
                </code>
              </div>
            )
          })}
        </div>
      </div>

      {/* Live Test */}
      <div className="card" style={{ animationDelay: '0.2s' }}>
        <h3 style={{ color: '#fff', fontSize: 'clamp(14px, 4vw, 15px)', fontWeight: '800', marginBottom: '16px' }}>
          🧪 Live Permission Test
        </h3>
        <div className="rbac-tests">
          {liveTests.map((test, i) => {
            const result = can(test.perm)
            return (
              <div key={i} style={{ 
                borderRadius: '16px', padding: '16px', 
                border: `2px solid ${result ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                background: result ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' 
              }}>
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', 
                  alignItems: 'center', marginBottom: '10px' 
                }}>
                  <span style={{ fontSize: 'clamp(20px, 6vw, 24px)' }}>
                    {result ? '✅' : '❌'}
                  </span>
                  <span style={{ 
                    fontSize: 'clamp(10px, 3vw, 11px)', fontWeight: '800', 
                    color: result ? '#10b981' : '#f43f5e', 
                    background: result ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', 
                    padding: '4px 10px', borderRadius: '20px' 
                  }}>
                    {result ? 'ALLOWED' : 'DENIED'}
                  </span>
                </div>
                <p style={{ 
                  color: '#e2e8f0', fontSize: 'clamp(12px, 3.5vw, 13px)', 
                  fontWeight: '600', margin: '0 0 6px' 
                }}>
                  {test.label}
                </p>
                <code style={{ 
                  color: '#64748b', fontSize: 'clamp(10px, 2.8vw, 11px)', 
                  fontFamily: 'monospace', display: 'block', fontWeight: '500' 
                }}>
                  {test.perm}
                </code>
              </div>
            )
          })}
        </div>
      </div>

      {/* All Roles */}
      <div className="card" style={{ animationDelay: '0.25s' }}>
        <h3 style={{ color: '#fff', fontSize: 'clamp(14px, 4vw, 15px)', fontWeight: '800', marginBottom: '16px' }}>
          👥 All Roles Summary
        </h3>
        <div className="rbac-roles">
          {Object.entries(ROLE_INFO).map(([role, info]) => (
            <div key={role} style={{ 
              background: 'rgba(255,255,255,0.04)', borderRadius: '16px', 
              padding: '20px', border: `1px solid ${info.color}40`, 
              boxShadow: user?.role===role ? `0 0 0 3px ${info.color}30` : 'none' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: 'clamp(22px, 6vw, 28px)' }}>{info.icon}</span>
                <div>
                  <p style={{ color: info.color, fontSize: 'clamp(14px, 4vw, 16px)', fontWeight: '800', margin: 0 }}>
                    {info.label}
                  </p>
                  {user?.role === role && (
                    <span style={{ 
                      background: info.color+'25', color: info.color, 
                      padding: '4px 10px', borderRadius: '8px', 
                      fontSize: 'clamp(10px, 2.5vw, 11px)', fontWeight: '700' 
                    }}>
                      ← You are here
                    </span>
                  )}
                </div>
              </div>
              <p style={{ 
                color: '#94a3b8', fontSize: 'clamp(12px, 3.2vw, 13px)', 
                marginBottom: '14px', lineHeight: '1.6' 
              }}>
                {info.desc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ROLE_PERMISSIONS[role].slice(0,4).map(p => (
                  <span key={p} style={{ 
                    background: info.color+'20', color: info.color, 
                    padding: '4px 8px', borderRadius: '8px', 
                    fontSize: 'clamp(9px, 2.2vw, 10px)', fontWeight: '600' 
                  }}>
                    {p.replace(/_/g,' ').split(' ').map(w => 
                      w.charAt(0).toUpperCase() + w.slice(1)
                    ).join(' ')}
                  </span>
                ))}
                {ROLE_PERMISSIONS[role].length > 4 && (
                  <span style={{ 
                    background: info.color+'15', color: info.color+'80', 
                    padding: '4px 8px', borderRadius: '8px', 
                    fontSize: 'clamp(9px, 2.2vw, 10px)' 
                  }}>
                    +{ROLE_PERMISSIONS[role].length-4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
