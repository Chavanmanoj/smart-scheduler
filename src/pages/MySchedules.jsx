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
  Lab:'#2d2010', Study:'#0d2530', Personal:'#1e1040',
  Work:'#1a2535', Other:'#1e1e2e',
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
    setSchedules([...defaultSchedules, ...saved].map(s => ({
      ...s, bg: bgMap[s.category] || '#1e1e2e'
    })))
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
    a.href = url; a.download = 'schedules.ics'; a.click()
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
        @keyframes modalPop {
          from{ opacity:0; transform:scale(0.9); }
          to  { opacity:1; transform:scale(1); }
        }
        .sch-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.35) !important;
        }
        .sch-row:hover {
          background: rgba(255,255,255,0.05) !important;
          transform: translateX(3px) !important;
        }
        .filter-btn:hover { opacity:0.85 !important; }
        .export-btn:hover { background:rgba(16,185,129,0.2) !important; }
        .del-btn:hover    { background:rgba(239,68,68,0.2) !important; }

        /* Responsive */
        @media(max-width:900px){
          .sch-grid    { grid-template-columns: 1fr 1fr !important; }
          .sch-actions { flex-wrap:wrap !important; }
          .sch-cats    { overflow-x:auto !important; flex-wrap:nowrap !important; padding-bottom:6px; -webkit-overflow-scrolling:touch; }
          .sch-stats   { flex-wrap:wrap !important; }
          .list-head   { display:none !important; }
        }
        @media(max-width:600px){
          .sch-grid    { grid-template-columns:1fr !important; }
          .sch-actions { flex-direction:column !important; align-items:stretch !important; }
          .view-toggle { align-self:flex-end !important; }
          .sch-stats   { gap:8px !important; }
          .stat-pill   { flex:1 !important; min-width:calc(50% - 4px) !important; }
        }
      `}</style>

      {/* Actions row */}
      <div className="sch-actions" style={{ display: 'flex', gap: '10px', marginBottom: '16px', animation: 'schFadeIn 0.4s ease', flexWrap: 'wrap' }}>
        <button
          onClick={exportICS}
          className="export-btn"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          📤 Export ICS
        </button>

        <button
          onClick={() => navigate('/add')}
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,0.4)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
        >
          ➕ Add New
        </button>

        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search schedules..."
          style={{ flex: 1, minWidth: '160px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' }}
        />

        {/* View toggle */}
        <div className="view-toggle" style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {[{m:'grid',i:'⊞'},{m:'list',i:'☰'}].map(v => (
            <button key={v.m} onClick={() => setViewMode(v.m)} style={{ background: viewMode===v.m ? '#4f46e5' : 'transparent', color: viewMode===v.m ? '#fff' : '#64748b', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s' }}>{v.i}</button>
          ))}
        </div>
      </div>

      {/* Export message */}
      {exportMsg && (
        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(16,185,129,0.2)', animation: 'schFadeIn 0.3s ease' }}>
          {exportMsg}
        </div>
      )}

      {/* Category filters */}
      <div className="sch-cats" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', animation: 'schFadeIn 0.4s ease 0.1s both' }}>
        {cats.map(cat => (
          <button
            key={cat}
            className="filter-btn"
            onClick={() => setFilter(cat)}
            style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: `1px solid ${filter===cat ? '#4f46e5' : 'rgba(255,255,255,0.08)'}`, background: filter===cat ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.04)', color: filter===cat ? '#fff' : '#64748b', boxShadow: filter===cat ? '0 4px 12px rgba(79,70,229,0.35)' : 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="sch-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px', animation: 'schFadeIn 0.5s ease 0.15s both' }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: '#475569', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '36px', marginBottom: '8px' }}>📭</p>
              <p style={{ fontSize: '14px' }}>No schedules found</p>
            </div>
          )}
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="sch-card"
              style={{ background: item.bg, borderRadius: '18px', border: `1px solid ${item.color}40`, overflow: 'hidden', transition: 'all 0.25s', boxShadow: `0 4px 20px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.04)`, animation: `schFadeIn 0.4s ease ${idx*0.05}s both` }}
            >
              <div style={{ height: '3px', background: `linear-gradient(90deg,${item.color},${item.color}66)` }} />
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ background: item.color+'25', color: item.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{item.category}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ background: pc(item.priority||'Medium')+'20', color: pc(item.priority||'Medium'), padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>{item.priority||'Medium'}</span>
                    <button
                      className="del-btn"
                      onClick={() => setDeleteId(item.id)}
                      style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s' }}
                    >🗑️</button>
                  </div>
                </div>
                <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: '0 0 10px', lineHeight: '1.4' }}>{item.title}</h3>
                <div style={{ height: '1px', background: item.color+'30', marginBottom: '10px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: '#64748b', fontSize: '11px' }}>📅 {item.date}</span>
                  <span style={{ background: item.color+'25', color: item.color, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>⏰ {item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div style={{ marginBottom: '24px', animation: 'schFadeIn 0.5s ease 0.15s both' }}>
          {/* Header — hidden on mobile */}
          <div className="list-head" style={{ display: 'flex', gap: '12px', padding: '11px 18px', background: 'rgba(79,70,229,0.1)', borderRadius: '12px', color: '#64748b', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '8px' }}>
            <span style={{ flex: 3 }}>TITLE</span>
            <span style={{ flex: 2 }}>DATE & TIME</span>
            <span style={{ flex: 1 }}>CATEGORY</span>
            <span style={{ flex: 1 }}>PRIORITY</span>
            <span style={{ flex: 1, textAlign: 'right' }}>ACTION</span>
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#475569', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '36px', marginBottom: '8px' }}>📭</p>
              <p>No schedules found</p>
            </div>
          )}

          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="sch-row"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `3px solid ${item.color}`, transition: 'all 0.2s', animation: `schFadeIn 0.3s ease ${idx*0.04}s both`, boxShadow: '0 2px 10px rgba(0,0,0,0.15)', marginBottom: '8px', flexWrap: 'wrap' }}
            >
              {/* Title */}
              <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: `0 0 5px ${item.color}` }} />
                <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
              </div>

              {/* Date */}
              <div style={{ flex: 2, minWidth: '100px' }}>
                <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>📅 {item.date}</p>
                <p style={{ color: '#64748b', fontSize: '10px', margin: '2px 0 0' }}>⏰ {item.time}</p>
              </div>

              {/* Category */}
              <div style={{ flex: 1 }}>
                <span style={{ background: item.color+'20', color: item.color, padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>{item.category}</span>
              </div>

              {/* Priority */}
              <div style={{ flex: 1 }}>
                <span style={{ background: pc(item.priority||'Medium')+'20', color: pc(item.priority||'Medium'), padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', whiteSpace: 'nowrap' }}>{item.priority||'Medium'}</span>
              </div>

              {/* Delete */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="del-btn"
                  onClick={() => setDeleteId(item.id)}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s' }}
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats footer */}
      <div className="sch-stats" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', animation: 'schFadeIn 0.5s ease 0.3s both' }}>
        {[
          { label: 'Total',  value: schedules.length,                                    color: '#6366f1' },
          { label: 'High',   value: schedules.filter(s=>s.priority==='High').length,   color: '#f43f5e' },
          { label: 'Medium', value: schedules.filter(s=>s.priority==='Medium').length, color: '#f59e0b' },
          { label: 'Low',    value: schedules.filter(s=>s.priority==='Low').length,    color: '#10b981' },
        ].map((s,i) => (
          <div
            key={i}
            className="stat-pill"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}30`, borderRadius: '12px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '80px' }}
          >
            <span style={{ color: s.color, fontSize: '18px', fontWeight: '800' }}>{s.value}</span>
            <span style={{ color: '#64748b', fontSize: '12px' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(6px)', padding: '16px' }}>
          <div style={{ background: '#0d0c18', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', padding: '32px', textAlign: 'center', maxWidth: '340px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', animation: 'modalPop 0.3s ease' }}>
            <p style={{ fontSize: '44px', marginBottom: '4px' }}>🗑️</p>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: '8px 0' }}>Delete Schedule?</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#f43f5e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}