import { useAuth } from '../context/AuthContext'
import PageLayout from '../components/PageLayout'

const ALL_PERMISSIONS = [
  'view_own_schedules','view_all_schedules','create_schedule',
  'edit_own_schedule','edit_any_schedule','delete_own_schedule',
  'delete_any_schedule','export_ics','view_users',
  'manage_users','view_logs','access_admin',
]

const ROLE_PERMISSIONS = {
  admin: ALL_PERMISSIONS,
  teacher: [
    'view_own_schedules','view_all_schedules','create_schedule',
    'edit_own_schedule','delete_own_schedule','export_ics','view_users'
  ],
  student: [
    'view_own_schedules','create_schedule',
    'edit_own_schedule','delete_own_schedule','export_ics'
  ],
}

const ROLE_INFO = {
  admin:   { label:'Admin', icon:'👑', color:'#f43f5e' },
  teacher: { label:'Teacher', icon:'👨‍🏫', color:'#f59e0b' },
  student: { label:'Student', icon:'👨‍🎓', color:'#10b981' },
}

export default function RBACDemo() {
  const { user, can, myPermissions } = useAuth()
  const roleInfo = ROLE_INFO[user?.role] || {}
  const myPerms = myPermissions()

  return (
    <PageLayout title="🔐 RBAC Demo">

      <style>{`
        body { overflow-x:hidden; }

        .container {
          width:100%;
          max-width:1200px;
          margin:auto;
          padding:12px;
        }

        .card {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:16px;
          padding:16px;
          margin-bottom:14px;
        }

        .title {
          color:#fff;
          font-weight:700;
          margin-bottom:10px;
          font-size:14px;
        }

        /* MOBILE FIRST */
        .grid {
          display:grid;
          grid-template-columns:1fr;
          gap:10px;
        }

        .matrix-wrap {
          overflow-x:auto;
        }

        .matrix {
          min-width:500px;
        }

        .perm-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:8px;
        }

        .test-grid {
          display:grid;
          grid-template-columns:1fr;
          gap:10px;
        }

        .roles {
          display:grid;
          grid-template-columns:1fr;
          gap:10px;
        }

        /* TABLET */
        @media(min-width:600px){
          .test-grid { grid-template-columns:1fr 1fr; }
          .perm-grid { grid-template-columns:repeat(3,1fr); }
        }

        /* DESKTOP */
        @media(min-width:900px){
          .test-grid { grid-template-columns:repeat(3,1fr); }
          .perm-grid { grid-template-columns:repeat(4,1fr); }
          .roles { grid-template-columns:repeat(3,1fr); }
        }

      `}</style>

      <div className="container">

        {/* ROLE */}
        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{
              background:roleInfo.color,
              width:40,height:40,borderRadius:10,
              display:'flex',alignItems:'center',justifyContent:'center'
            }}>
              {roleInfo.icon}
            </div>
            <div>
              <p style={{color:'#fff',margin:0,fontWeight:700}}>
                {roleInfo.label}
              </p>
              <p style={{color:'#94a3b8',fontSize:12,margin:0}}>
                {myPerms.length} / {ALL_PERMISSIONS.length} permissions
              </p>
            </div>
          </div>
        </div>

        {/* MATRIX */}
        <div className="card">
          <p className="title">📊 Permission Matrix</p>

          <div className="matrix-wrap">
            <div className="matrix">

              {ALL_PERMISSIONS.map((perm,i)=>(
                <div key={i} style={{
                  display:'flex',
                  justifyContent:'space-between',
                  padding:'8px',
                  borderBottom:'1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{color:'#818cf8',fontSize:11}}>
                    {perm}
                  </span>

                  <div style={{display:'flex',gap:'20px'}}>
                    <span>{ROLE_PERMISSIONS.admin.includes(perm) ? '✅':'❌'}</span>
                    <span>{ROLE_PERMISSIONS.teacher.includes(perm) ? '✅':'❌'}</span>
                    <span>{ROLE_PERMISSIONS.student.includes(perm) ? '✅':'❌'}</span>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* YOUR PERMISSIONS */}
        <div className="card">
          <p className="title">🔑 Your Permissions</p>

          <div className="perm-grid">
            {ALL_PERMISSIONS.map(p=>{
              const ok = can(p)
              return(
                <div key={p} style={{
                  padding:'10px',
                  borderRadius:'10px',
                  background: ok ? '#10b98122':'#ffffff10',
                  fontSize:10
                }}>
                  {ok ? '✅':'🔒'} {p}
                </div>
              )
            })}
          </div>
        </div>

        {/* TEST */}
        <div className="card">
          <p className="title">🧪 Live Test</p>

          <div className="test-grid">
            {['manage_users','delete_any_schedule','access_admin'].map(t=>{
              const res = can(t)
              return(
                <div key={t} style={{
                  padding:'12px',
                  borderRadius:'12px',
                  background: res ? '#10b98122':'#ef444422'
                }}>
                  <p style={{margin:0,color:'#fff',fontSize:12}}>
                    {t}
                  </p>
                  <b>{res ? 'ALLOWED':'DENIED'}</b>
                </div>
              )
            })}
          </div>
        </div>

        {/* ROLES */}
        <div className="card">
          <p className="title">👥 Roles</p>

          <div className="roles">
            {Object.entries(ROLE_INFO).map(([r,info])=>(
              <div key={r} style={{
                padding:'14px',
                borderRadius:'12px',
                border:`1px solid ${info.color}`
              }}>
                <p style={{color:info.color,fontWeight:700}}>
                  {info.icon} {info.label}
                </p>
                <p style={{fontSize:11,color:'#94a3b8'}}>
                  {ROLE_PERMISSIONS[r].length} permissions
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  )
}