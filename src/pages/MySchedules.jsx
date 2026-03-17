import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const defaultSchedules = [
  { id: 1, title: 'Team Standup',     date: '2026-03-15', time: '10:00', category: 'Meeting',  color: '#10b981', priority: 'High'   },
  { id: 2, title: 'Project Deadline', date: '2026-03-16', time: '23:59', category: 'Deadline', color: '#f43f5e', priority: 'High'   },
  { id: 3, title: 'Workshop Session', date: '2026-03-17', time: '14:00', category: 'Study',    color: '#06b6d4', priority: 'Medium' },
  { id: 4, title: 'Lab Experiment',   date: '2026-03-18', time: '09:00', category: 'Lab',      color: '#f59e0b', priority: 'Medium' },
  { id: 5, title: 'Security Review',  date: '2026-03-19', time: '16:00', category: 'Work',     color: '#6366f1', priority: 'Low'    },
]

const bgMap = {
  Class:'#1e1b4b', Deadline:'#2d1b2e', Meeting:'#0d2d24',
  Lab:'#2d2010', Study:'#0d2530', Personal:'#1e1040', Work:'#1a2535', Other:'#1e1e2e',
}

export default function MySchedules() {
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState([])
  const [filter, setFilter]       = useState('All')
  const [search, setSearch]       = useState('')
  const [exportMsg, setExportMsg] = useState('')
  const [deleteId, setDeleteId]   = useState(null)
  const [viewMode, setViewMode]   = useState('grid')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('schedules') || '[]')
    setSchedules([...defaultSchedules, ...saved].map(s => ({ ...s, bg: bgMap[s.category] || '#1e1e2e' })))
  }, [])

  const cats     = ['All', ...new Set(schedules.map(s => s.category))]
  const filtered = schedules.filter(s => {
    const mc = filter === 'All' || s.category === filter
    const ms = s.title.toLowerCase().includes(search.toLowerCase())
    return mc && ms
  })

  const exportICS = () => {
    const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SmartScheduler//EN','CALSCALE:GREGORIAN']
    filtered.forEach(s => {
      const [yr,mo,dy] = s.date.split('-')
      const [hr,mn]    = s.time.split(':')
      lines.push('BEGIN:VEVENT')
      lines.push(`UID:${s.id}@smartscheduler`)
      lines.push(`DTSTART:${yr}${mo}${dy}T${hr}${mn}00`)
      lines.push(`DTEND:${yr}${mo}${dy}T${String(Number(hr)+1).padStart(2,'0')}${mn}00`)
      lines.push(`SUMMARY:${s.title}`)
      lines.push(`CATEGORIES:${s.category}`)
      lines.push('END:VEVENT')
    })
    lines.push('END:VCALENDAR')
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url; a.download = 'schedules.ics'; a.click()
    URL.revokeObjectURL(url)
    setExportMsg('✅ ICS file downloaded!')
    setTimeout(() => setExportMsg(''), 3000)
  }

  const handleDelete = (id) => {
    const updated  = schedules.filter(s => s.id !== id)
    const onlyUser = updated.filter(s => s.id > 5)
    localStorage.setItem('schedules', JSON.stringify(onlyUser))
    setSchedules(updated)
    setDeleteId(null)
  }

  const pc = p => p === 'High' ? '#f43f5e' : p === 'Medium' ? '#f59e0b' : '#10b981'

  return (
    <PageLayout title="📁 My Schedules" subtitle={`${filtered.length} of ${schedules.length} tasks`}>
      <style>{`
        @keyframes schFadeIn {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0); }
        }
        .sch-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.35) !important;
        }
        .sch-row:hover {
          background: rgba(255,255,255,0.05) !important;
          transform: translateX(4px) !important;
        }
        @media(max-width:768px){
          .sch-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Actions row */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', animation: 'schFadeIn 0.4s ease' }}>
        <button onClick={exportICS} style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '10px 18px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
          📤 Export ICS
        </button>
        <button onClick={() => navigate('/add')} style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,0.4)' }}>
          ➕ Add New
        </button>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)', marginLeft: 'auto' }}>
          {[{m:'grid',i:'⊞'},{m:'list',i:'☰'}].map(v => (
            <button key={v.m} onClick={() => setViewMode(v.m)} style={{ background: viewMode===v.m ? '#4f46e5' : 'transparent', color: viewMode===v.m ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s' }}>{v.i}</button>
          ))}
        </div>
      </div>

      {exportMsg && (
        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '12px', padding: '12px 18px', marginBottom: '16px', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(16,185,129,0.2)', animation: 'schFadeIn 0.3s ease' }}>
          {exportMsg}
        </div>
      )}

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', animation: 'schFadeIn 0.4s ease 0.1s both' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search schedules..."
          style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '11px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', animation: 'schFadeIn 0.4s ease 0.15s both' }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: `1px solid ${filter===cat ? '#4f46e5' : 'rgba(255,255,255,0.08)'}`, background: filter===cat ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.04)', color: filter===cat ? '#fff' : '#64748b', boxShadow: filter===cat ? '0 4px 12px rgba(79,70,229,0.35)' : 'none' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="sch-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', animation: 'schFadeIn 0.5s ease 0.2s both' }}>
          {filtered.map((item, idx) => (
            <div key={item.id} className="sch-card" style={{ background: item.bg, borderRadius: '20px', padding: '0', border: `1px solid ${item.color}40`, overflow: 'hidden', transition: 'all 0.25s', boxShadow: `0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)`, animation: `schFadeIn 0.4s ease ${idx*0.06}s both` }}>
              <div style={{ height: '3px', background: `linear-gradient(90deg,${item.color},${item.color}66)` }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ background: item.color+'25', color: item.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{item.category}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ background: pc(item.priority||'Medium')+'20', color: pc(item.priority||'Medium'), padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>{item.priority||'Medium'}</span>
                    <button onClick={() => setDeleteId(item.id)} style={{ background: 'rgba(239,68,68,0.12)', border: 'none', color: '#f87171', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                  </div>
                </div>
                <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: '0 0 10px', lineHeight: '1.4' }}>{item.title}</h3>
                <div style={{ height: '1px', background: item.color+'30', marginBottom: '10px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '11px' }}>📅 {item.date}</span>
                  <span style={{ background: item.color+'25', color: item.color, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>⏰ {item.time}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: '#475569' }}>
              <p style={{ fontSize: '40px' }}>📭</p>
              <p style={{ marginTop: '8px' }}>No schedules found</p>
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'schFadeIn 0.5s ease 0.2s both' }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', background: 'rgba(79,70,229,0.1)', borderRadius: '12px', color: '#64748b', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
            <span style={{ flex: 3 }}>TITLE</span>
            <span style={{ flex: 2 }}>DATE & TIME</span>
            <span style={{ flex: 1 }}>CATEGORY</span>
            <span style={{ flex: 1 }}>PRIORITY</span>
            <span style={{ flex: 1, textAlign: 'right' }}>ACTION</span>
          </div>
          {filtered.map((item, idx) => (
            <div key={item.id} className="sch-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `3px solid ${item.color}`, transition: 'all 0.2s', animation: `schFadeIn 0.3s ease ${idx*0.04}s both`, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}` }} />
                <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>{item.title}</span>
              </div>
              <div style={{ flex: 2 }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>📅 {item.date}</p>
                <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0' }}>⏰ {item.time}</p>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ background: item.color+'20', color: item.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{item.category}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ background: pc(item.priority||'Medium')+'20', color: pc(item.priority||'Medium'), padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{item.priority||'Medium'}</span>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setDeleteId(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#475569' }}>
              <p style={{ fontSize: '40px' }}>📭</p>
              <p style={{ marginTop: '8px' }}>No schedules found</p>
            </div>
          )}
        </div>
      )}

      {/* Stats footer */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', animation: 'schFadeIn 0.5s ease 0.3s both' }}>
        {[
          { label: 'Total',    value: schedules.length,                                      color: '#6366f1' },
          { label: 'High',     value: schedules.filter(s=>s.priority==='High').length,    color: '#f43f5e' },
          { label: 'Medium',   value: schedules.filter(s=>s.priority==='Medium').length,  color: '#f59e0b' },
          { label: 'Low',      value: schedules.filter(s=>s.priority==='Low').length,     color: '#10b981' },
        ].map((s,i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}30`, borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: s.color, fontSize: '20px', fontWeight: '800' }}>{s.value}</span>
            <span style={{ color: '#64748b', fontSize: '13px' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#13111f', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', padding: '36px', textAlign: 'center', maxWidth: '340px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', animation: 'schFadeIn 0.3s ease' }}>
            <p style={{ fontSize: '48px' }}>🗑️</p>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: '12px 0 8px' }}>Delete Schedule?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#f43f5e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}