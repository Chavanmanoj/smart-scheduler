import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import PageLayout from '../components/PageLayout'

const ROLE_INFO = {
  admin:   { label: 'Admin',   icon: '👑', color: '#f43f5e' },
  teacher: { label: 'Teacher', icon: '👨‍🏫', color: '#f59e0b' },
  student: { label: 'Student', icon: '👨‍🎓', color: '#10b981' },
}

export default function Settings() {
  const { user } = useAuth()
  const roleInfo = ROLE_INFO[user?.role] || { label: 'User', icon: '👤', color: '#6366f1' }

  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved]         = useState(false)

  const [profile, setProfile] = useState({
    name:    user?.name  || '',
    email:   user?.email || '',
    phone:   '',
    college: 'Mumbai University',
    dept:    'Computer Science',
    year:    'Third Year',
  })

  const [notif, setNotif] = useState({
    emailAlerts:    true,
    pushAlerts:     false,
    reminderBefore: '30',
    weeklyReport:   true,
  })

  const [appearance, setAppearance] = useState({
    theme:        'dark',
    colorAccent:  '#4f46e5',
    compactView:  false,
    showWeekends: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const p = name.trim().split(' ')
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase()
  }

  const tabs = [
    { id: 'profile',    icon: '👤', label: 'Profile'      },
    { id: 'notif',      icon: '🔔', label: 'Notifications' },
    { id: 'appearance', icon: '🎨', label: 'Appearance'   },
    { id: 'security',   icon: '🔒', label: 'Security'     },
    { id: 'about',      icon: 'ℹ️', label: 'About'        },
  ]

  return (
    <PageLayout title="⚙️ Settings" subtitle="Manage your account and preferences">
      <style>{`
        @keyframes setFadeIn {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes tabSlide {
          from{ opacity:0; transform:translateX(12px); }
          to  { opacity:1; transform:translateX(0); }
        }
        @keyframes modalPop {
          from{ opacity:0; transform:scale(0.9); }
          to  { opacity:1; transform:scale(1); }
        }
        input:focus, textarea:focus, select:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.15) !important;
          outline: none !important;
        }
        .tab-item:hover {
          background: rgba(79,70,229,0.1) !important;
          color: #c7d2fe !important;
        }
        .save-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(79,70,229,0.45) !important;
        }
        .toggle-row:hover {
          background: rgba(255,255,255,0.04) !important;
        }

        /* Desktop */
        @media(min-width:769px){
          .set-layout { grid-template-columns:200px 1fr !important; }
          .tab-menu   { flex-direction:column !important; }
          .mob-tab-select { display:none !important; }
        }

        /* Mobile */
        @media(max-width:768px){
          .set-layout    { grid-template-columns:1fr !important; gap:12px !important; }
          .tab-menu      { flex-direction:row !important; flex-wrap:wrap !important; gap:6px !important; padding:12px !important; }
          .tab-item      { padding:8px 12px !important; font-size:12px !important; flex:1 !important; min-width:calc(50% - 6px) !important; justify-content:center !important; }
          .set-content   { padding:20px !important; }
          .form-grid-set { grid-template-columns:1fr !important; }
          .rbac-grid-set { grid-template-columns:1fr 1fr 1fr !important; }
          .theme-cards   { flex-direction:column !important; }
          .color-dots    { flex-wrap:wrap !important; }
          .feat-grid-set { grid-template-columns:1fr !important; }
          .info-rows     { padding:14px !important; }
          .avatar-banner { flex-direction:column !important; align-items:flex-start !important; }
        }
        @media(max-width:480px){
          .tab-item      { min-width:calc(50% - 6px) !important; }
          .rbac-grid-set { grid-template-columns:1fr !important; gap:8px !important; }
        }
      `}</style>

      {/* Save toast */}
      {saved && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', left: '20px', maxWidth: '340px', margin: '0 auto', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '14px', padding: '14px 20px', fontSize: '14px', fontWeight: '700', zIndex: 999, backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', animation: 'setFadeIn 0.3s ease', textAlign: 'center' }}>
          ✅ Changes saved successfully!
        </div>
      )}

      <div className="set-layout" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', animation: 'setFadeIn 0.5s ease' }}>

        {/* TAB MENU */}
        <div className="tab-menu" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', height: 'fit-content', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              className="tab-item"
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab===tab.id ? '700' : '400', transition: 'all 0.2s', background: activeTab===tab.id ? 'rgba(79,70,229,0.2)' : 'transparent', color: activeTab===tab.id ? '#a5b4fc' : '#64748b', borderLeft: activeTab===tab.id ? '3px solid #4f46e5' : '3px solid transparent' }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="set-content" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', animation: 'tabSlide 0.3s ease' }}>

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={ts.tabTitle}>👤 Profile Information</h2>

              {/* Avatar banner */}
              <div className="avatar-banner" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(79,70,229,0.08)', borderRadius: '16px', padding: '18px', marginBottom: '22px', border: '1px solid rgba(79,70,229,0.15)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle,rgba(79,70,229,0.2),transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '24px', flexShrink: 0, boxShadow: '0 8px 20px rgba(79,70,229,0.5)' }}>
                  {getInitials(user?.name)}
                </div>
                <div>
                  <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: '0 0 6px' }}>{user?.name}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: roleInfo.color+'20', border: `1px solid ${roleInfo.color}44`, borderRadius: '20px', padding: '4px 12px', marginBottom: '4px' }}>
                    <span>{roleInfo.icon}</span>
                    <span style={{ color: roleInfo.color, fontSize: '12px', fontWeight: '700' }}>{roleInfo.label}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{user?.email}</p>
                </div>
              </div>

              {/* Form */}
              <div className="form-grid-set" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                {[
                  { label: '👤 Full Name',   key: 'name',    type: 'text'  },
                  { label: '📧 Email',        key: 'email',   type: 'email' },
                  { label: '📱 Phone',        key: 'phone',   type: 'text'  },
                  { label: '🏫 College',      key: 'college', type: 'text'  },
                  { label: '📚 Department',   key: 'dept',    type: 'text'  },
                  { label: '📅 Year',         key: 'year',    type: 'text'  },
                ].map(f => (
                  <div key={f.key}>
                    <label style={ts.label}>{f.label}</label>
                    <input style={ts.input} type={f.type} value={profile[f.key]} onChange={e => setProfile({ ...profile, [f.key]: e.target.value })} />
                  </div>
                ))}
              </div>

              <button className="save-btn" style={ts.saveBtn} onClick={handleSave}>💾 Save Profile</button>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notif' && (
            <div>
              <h2 style={ts.tabTitle}>🔔 Notification Settings</h2>

              {[
                { key: 'emailAlerts',  label: 'Email Alerts',  sub: 'Get schedule reminders via email', icon: '📧' },
                { key: 'pushAlerts',   label: 'Push Alerts',   sub: 'Browser push notifications',       icon: '📲' },
                { key: 'weeklyReport', label: 'Weekly Report', sub: 'Receive weekly schedule summary',  icon: '📊' },
              ].map(item => (
                <div key={item.key} className="toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px 16px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(79,70,229,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', margin: 0 }}>{item.label}</p>
                      <p style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{item.sub}</p>
                    </div>
                  </div>
                  <div onClick={() => setNotif({ ...notif, [item.key]: !notif[item.key] })} style={{ width: '46px', height: '25px', borderRadius: '13px', background: notif[item.key] ? '#4f46e5' : 'rgba(255,255,255,0.08)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0, boxShadow: notif[item.key] ? '0 0 10px rgba(79,70,229,0.4)' : 'none' }}>
                    <div style={{ position: 'absolute', top: '3px', left: notif[item.key] ? '22px' : '3px', width: '19px', height: '19px', borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '16px' }}>
                <label style={ts.label}>⏰ Reminder Before Event</label>
                <select style={{ ...ts.input, cursor: 'pointer' }} value={notif.reminderBefore} onChange={e => setNotif({ ...notif, reminderBefore: e.target.value })}>
                  {['5','10','15','30','60'].map(v => (
                    <option key={v} value={v} style={{ background: '#13111f' }}>{v} minutes before</option>
                  ))}
                </select>
              </div>

              <button className="save-btn" style={{ ...ts.saveBtn, marginTop: '20px' }} onClick={handleSave}>💾 Save Notifications</button>
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <div>
              <h2 style={ts.tabTitle}>🎨 Appearance</h2>

              <label style={ts.label}>🌙 Theme</label>
              <div className="theme-cards" style={{ display: 'flex', gap: '12px', marginBottom: '22px' }}>
                {[
                  { val: 'dark',  label: 'Dark Mode',  icon: '🌙', bg: '#07060f' },
                  { val: 'light', label: 'Light Mode', icon: '☀️', bg: '#f0f2ff' },
                ].map(t => (
                  <div key={t.val} onClick={() => setAppearance({ ...appearance, theme: t.val })} style={{ flex: 1, borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', background: t.bg, border: `2px solid ${appearance.theme===t.val ? '#4f46e5' : 'rgba(255,255,255,0.08)'}`, position: 'relative', transition: 'all 0.2s', boxShadow: appearance.theme===t.val ? '0 0 0 1px #4f46e5,0 8px 20px rgba(79,70,229,0.2)' : 'none', minHeight: '80px', justifyContent: 'center' }}>
                    <span style={{ fontSize: '26px' }}>{t.icon}</span>
                    <span style={{ color: appearance.theme===t.val ? '#818cf8' : '#94a3b8', fontSize: '13px', fontWeight: '600' }}>{t.label}</span>
                    {appearance.theme===t.val && <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '50%', background: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>✓</div>}
                  </div>
                ))}
              </div>

              <label style={ts.label}>🎨 Accent Color</label>
              <div className="color-dots" style={{ display: 'flex', gap: '12px', marginBottom: '22px', flexWrap: 'wrap' }}>
                {['#4f46e5','#7c3aed','#06b6d4','#10b981','#f59e0b','#f43f5e','#a855f7','#ec4899'].map(c => (
                  <div key={c} onClick={() => setAppearance({ ...appearance, colorAccent: c })} style={{ width: '34px', height: '34px', borderRadius: '50%', background: c, cursor: 'pointer', transition: 'all 0.2s', border: appearance.colorAccent===c ? '3px solid #fff' : '3px solid transparent', transform: appearance.colorAccent===c ? 'scale(1.2)' : 'scale(1)', boxShadow: appearance.colorAccent===c ? `0 0 14px ${c}` : 'none' }} />
                ))}
              </div>

              {[
                { key: 'compactView',  label: 'Compact View',   sub: 'Smaller cards and tighter spacing',      icon: '📐' },
                { key: 'showWeekends', label: 'Show Weekends',  sub: 'Display Saturday and Sunday in calendar', icon: '📅' },
              ].map(item => (
                <div key={item.key} className="toggle-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px 16px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(79,70,229,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', margin: 0 }}>{item.label}</p>
                      <p style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{item.sub}</p>
                    </div>
                  </div>
                  <div onClick={() => setAppearance({ ...appearance, [item.key]: !appearance[item.key] })} style={{ width: '46px', height: '25px', borderRadius: '13px', background: appearance[item.key] ? '#4f46e5' : 'rgba(255,255,255,0.08)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s', flexShrink: 0, boxShadow: appearance[item.key] ? '0 0 10px rgba(79,70,229,0.4)' : 'none' }}>
                    <div style={{ position: 'absolute', top: '3px', left: appearance[item.key] ? '22px' : '3px', width: '19px', height: '19px', borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
                  </div>
                </div>
              ))}

              <button className="save-btn" style={{ ...ts.saveBtn, marginTop: '8px' }} onClick={handleSave}>💾 Save Appearance</button>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div>
              <h2 style={ts.tabTitle}>🔒 Security Settings</h2>

              {/* RBAC card */}
              <div style={{ background: 'rgba(79,70,229,0.08)', borderRadius: '16px', border: '1px solid rgba(79,70,229,0.2)', padding: '18px', marginBottom: '22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'radial-gradient(circle,rgba(79,70,229,0.2),transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🔐</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: '800', margin: 0 }}>RBAC Access Control Active</p>
                    <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0' }}>Smart Scheduler — Information Cyber Security</p>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '4px 12px', flexShrink: 0 }}>
                    <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '700' }}>● Active</span>
                  </div>
                </div>
                <div className="rbac-grid-set" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                  {[
                    { label: 'Your Role',    value: `${roleInfo.icon} ${roleInfo.label}`, color: roleInfo.color },
                    { label: 'Permissions', value: user?.role==='admin' ? '12' : user?.role==='teacher' ? '7' : '5', color: '#818cf8' },
                    { label: 'Status',      value: '✓ Active', color: '#10b981' },
                  ].map((s,i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <p style={{ color: s.color, fontSize: '14px', fontWeight: '800', margin: 0 }}>{s.value}</p>
                      <p style={{ color: '#64748b', fontSize: '10px', margin: '4px 0 0' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Change password */}
              <h3 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', marginBottom: '12px', letterSpacing: '1px' }}>🔑 CHANGE PASSWORD</h3>
              {['Current Password','New Password','Confirm New Password'].map((label,i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <label style={ts.label}>{label}</label>
                  <input style={ts.input} type="password" placeholder="••••••••" />
                </div>
              ))}

              {/* Session */}
              <h3 style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', margin: '20px 0 12px', letterSpacing: '1px' }}>📱 CURRENT SESSION</h3>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '22px' }}>🖥️</span>
                  <div>
                    <p style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', margin: 0 }}>Web Browser</p>
                    <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0' }}>localhost:5173 · Active now</p>
                  </div>
                </div>
                <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(16,185,129,0.25)' }}>● Active</span>
              </div>

              <button className="save-btn" style={ts.saveBtn} onClick={handleSave}>💾 Update Password</button>
            </div>
          )}

          {/* ABOUT */}
          {activeTab === 'about' && (
            <div>
              <h2 style={ts.tabTitle}>ℹ️ About This Project</h2>

              {/* App card */}
              <div style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.15),rgba(124,58,237,0.1))', borderRadius: '18px', padding: '28px', textAlign: 'center', marginBottom: '20px', border: '1px solid rgba(79,70,229,0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '180px', height: '180px', background: 'radial-gradient(circle,rgba(79,70,229,0.2),transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', boxShadow: '0 8px 28px rgba(79,70,229,0.5)' }}>🗓️</div>
                <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 4px' }}>Smart Scheduler</h3>
                <p style={{ color: '#818cf8', fontSize: '13px', marginBottom: '8px' }}>Cloud-Based Scheduling Platform</p>
                <span style={{ background: 'rgba(79,70,229,0.2)', color: '#a5b4fc', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Version 1.0.0</span>
              </div>

              {/* Info rows */}
              <div className="info-rows" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '16px' }}>
                {[
                  { label: 'Project Type', value: 'Capstone Project',           icon: '🎓' },
                  { label: 'Subject',      value: 'Information Cyber Security', icon: '🔒' },
                  { label: 'Topic',        value: 'Access Control (RBAC)',      icon: '🔐' },
                  { label: 'Tech Stack',   value: 'React + Vite',               icon: '⚡' },
                  { label: 'Cloud',        value: 'Cloud-Based Architecture',   icon: '☁️' },
                  { label: 'Developer',    value: user?.name || 'Developer',    icon: '👨‍💻' },
                  { label: 'University',   value: 'Mumbai University',          icon: '🏫' },
                ].map((item,i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i<6 ? '1px solid rgba(255,255,255,0.04)' : 'none', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.icon} {item.label}
                    </span>
                    <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '600' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Features grid */}
              <div className="feat-grid-set" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  '✅ Role-Based Access Control',
                  '✅ Cloud-Based Architecture',
                  '✅ Smart Calendar View',
                  '✅ ICS File Export',
                  '✅ Admin Panel & Logs',
                  '✅ Dark Theme UI/UX',
                  '✅ Protected Routes',
                  '✅ Mobile Responsive',
                  '✅ Animated UI',
                  '✅ User Data Tracking',
                ].map((f,i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(79,70,229,0.08)', borderRadius: '10px', padding: '9px 12px', border: '1px solid rgba(79,70,229,0.12)' }}>
                    <span style={{ color: '#a5b4fc', fontSize: '12px', fontWeight: '500' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </PageLayout>
  )
}

const ts = {
  tabTitle: { color: '#fff', fontSize: '17px', fontWeight: '800', marginBottom: '20px' },
  label:    { color: '#94a3b8', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '7px', letterSpacing: '0.5px' },
  input:    { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '11px 14px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.2s', display: 'block' },
  saveBtn:  { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(79,70,229,0.4)', transition: 'all 0.2s' },
}