import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const defaultSchedules = [
  { id: 1, title: 'Team Standup',     date: '2026-03-15', time: '10:00', category: 'Meeting',  color: '#10b981' },
  { id: 2, title: 'Project Deadline', date: '2026-03-16', time: '23:59', category: 'Deadline', color: '#f43f5e' },
  { id: 3, title: 'Workshop Session', date: '2026-03-17', time: '14:00', category: 'Study',    color: '#06b6d4' },
  { id: 4, title: 'Lab Experiment',   date: '2026-03-18', time: '09:00', category: 'Lab',      color: '#f59e0b' },
  { id: 5, title: 'Security Review',  date: '2026-03-19', time: '16:00', category: 'Work',     color: '#6366f1' },
]

export default function CalendarPage() {
  const navigate = useNavigate()
  const [schedules, setSchedules]         = useState([])
  const [selectedDate, setSelectedDate]   = useState(null)
  const [currentDate, setCurrentDate]     = useState(new Date(2026, 2, 1))
  const [showPanel, setShowPanel]         = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('schedules') || '[]')
    setSchedules([...defaultSchedules, ...saved])
  }, [])

  const year        = currentDate.getFullYear()
  const month       = currentDate.getMonth()
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today       = new Date()

  const getEvents = (day) => {
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return schedules.filter(s => s.date === ds)
  }

  const selectedEvents = selectedDate ? getEvents(selectedDate) : []

  const handleDayClick = (day) => {
    setSelectedDate(day)
    setShowPanel(true)
  }

  return (
    <PageLayout title="📅 Calendar" subtitle="View and manage your schedule">
      <style>{`
        @keyframes calFadeIn {
          from{ opacity:0; transform:translateY(16px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes panelSlide {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes dayPop {
          from{ transform:scale(0.85); opacity:0; }
          to  { transform:scale(1);    opacity:1; }
        }
        .day-cell:hover {
          background: rgba(79,70,229,0.2) !important;
          border-color: #4f46e5 !important;
          transform: scale(1.05) !important;
          cursor: pointer !important;
        }
        .nav-month:hover {
          background: rgba(79,70,229,0.2) !important;
        }
        .event-card-cal:hover {
          transform: translateX(4px) !important;
        }
        .mini-event:hover {
          background: rgba(255,255,255,0.05) !important;
        }

        /* Desktop layout */
        @media(min-width:901px){
          .cal-layout  { display:grid !important; grid-template-columns:1fr 300px !important; gap:20px !important; }
          .mob-panel-btn { display:none !important; }
          .events-panel  { display:flex !important; }
        }

        /* Mobile layout */
        @media(max-width:900px){
          .cal-layout  { display:block !important; }
          .events-panel {
            display: none !important;
            position: fixed !important;
            inset: 0 !important;
            z-index: 300 !important;
            padding: 20px 16px !important;
            overflow-y: auto !important;
            background: rgba(7,6,15,0.97) !important;
            backdropFilter: blur(20px) !important;
          }
          .events-panel.open {
            display:flex !important;
          }
          .mob-panel-btn { display:flex !important; }
          .cal-box { padding:16px !important; }
          .day-cell { height:48px !important; }
          .day-num  { font-size:12px !important; }
          .legend-row { gap:10px !important; flex-wrap:wrap !important; }
        }

        @media(max-width:480px){
          .day-cell { height:40px !important; padding:4px !important; }
          .day-header-txt { font-size:10px !important; }
          .month-title { font-size:16px !important; }
        }
      `}</style>

      {/* Add button */}
      <div style={{ marginBottom: '20px', animation: 'calFadeIn 0.4s ease', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/add')}
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '11px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ➕ New Schedule
        </button>
      </div>

      {/* Calendar + Panel layout */}
      <div className="cal-layout" style={{ animation: 'calFadeIn 0.5s ease 0.1s both' }}>

        {/* ── CALENDAR BOX ── */}
        <div className="cal-box" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', marginBottom: '20px' }}>

          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button
              className="nav-month"
              onClick={() => setCurrentDate(new Date(year, month-1, 1))}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', width: '38px', height: '38px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
            >‹</button>

            <h2 className="month-title" style={{ color: '#fff', fontSize: '18px', fontWeight: '800', textAlign: 'center' }}>
              {MONTHS[month]} {year}
            </h2>

            <button
              className="nav-month"
              onClick={() => setCurrentDate(new Date(year, month+1, 1))}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', width: '38px', height: '38px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
            >›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '8px', gap: '4px' }}>
            {DAYS.map(d => (
              <div key={d} className="day-header-txt" style={{ color: '#4f46e5', fontSize: '12px', textAlign: 'center', padding: '6px 0', fontWeight: '800', letterSpacing: '0.5px' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
            {/* Empty cells */}
            {Array(firstDay).fill(null).map((_,i) => (
              <div key={'e'+i} />
            ))}

            {/* Day cells */}
            {Array(daysInMonth).fill(null).map((_,i) => {
              const day      = i + 1
              const events   = getEvents(day)
              const isToday  = today.getFullYear()===year && today.getMonth()===month && today.getDate()===day
              const isSel    = selectedDate === day

              return (
                <div
                  key={day}
                  className="day-cell"
                  onClick={() => handleDayClick(day)}
                  style={{
                    borderRadius: '10px',
                    height: '60px',
                    padding: '6px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '4px',
                    border: `1px solid ${isSel ? '#4f46e5' : isToday ? '#4f46e5' : 'rgba(255,255,255,0.06)'}`,
                    background: isSel
                      ? 'rgba(79,70,229,0.4)'
                      : isToday
                      ? 'rgba(79,70,229,0.12)'
                      : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.2s',
                    animation: `dayPop 0.3s ease ${i*0.008}s both`,
                    position: 'relative',
                  }}
                >
                  <span className="day-num" style={{ color: isSel ? '#fff' : isToday ? '#818cf8' : '#e2e8f0', fontSize: '13px', fontWeight: isSel || isToday ? '800' : '500', lineHeight: 1 }}>
                    {day}
                  </span>

                  {/* Event dots */}
                  <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {events.slice(0,3).map((ev,idx) => (
                      <span key={idx} style={{ width: '5px', height: '5px', borderRadius: '50%', background: ev.color, display: 'block', boxShadow: `0 0 4px ${ev.color}` }} />
                    ))}
                    {events.length > 3 && (
                      <span style={{ color: '#818cf8', fontSize: '8px', fontWeight: '700' }}>+{events.length-3}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="legend-row" style={{ display: 'flex', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
            {[
              { l:'Meeting',  c:'#10b981' },
              { l:'Deadline', c:'#f43f5e' },
              { l:'Study',    c:'#06b6d4' },
              { l:'Work',     c:'#6366f1' },
              { l:'Lab',      c:'#f59e0b' },
            ].map(item => (
              <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: item.c, display: 'block', boxShadow: `0 0 6px ${item.c}` }} />
                <span style={{ color: '#64748b', fontSize: '12px' }}>{item.l}</span>
              </div>
            ))}
          </div>

          {/* Mobile: show events button */}
          {selectedDate && (
            <button
              className="mob-panel-btn"
              onClick={() => setShowPanel(true)}
              style={{ display: 'none', width: '100%', marginTop: '16px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(79,70,229,0.4)' }}
            >
              📋 View Events for {MONTHS[month]} {selectedDate} ({selectedEvents.length})
            </button>
          )}

          {/* Mobile: inline events when date selected */}
          {selectedDate && (
            <div style={{ marginTop: '16px', display: 'none' }} className="mob-inline-events">
              {selectedEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: '28px', marginBottom: '6px' }}>🗓️</p>
                  <p style={{ fontSize: '13px' }}>No events on {MONTHS[month]} {selectedDate}</p>
                  <button onClick={() => navigate('/add')} style={{ marginTop: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>➕ Add Event</button>
                </div>
              ) : (
                selectedEvents.map(ev => (
                  <div key={ev.id} style={{ borderRadius: '12px', padding: '12px', background: ev.color+'12', border: `1px solid ${ev.color}33`, marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ background: ev.color+'25', color: ev.color, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{ev.category}</span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ev.color, display: 'block', marginTop: '4px', boxShadow: `0 0 6px ${ev.color}` }} />
                    </div>
                    <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: '700', margin: '0 0 6px' }}>{ev.title}</h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '2px 8px', borderRadius: '6px', fontSize: '11px' }}>📅 {ev.date}</span>
                      <span style={{ background: ev.color+'20', color: ev.color, padding: '2px 8px', borderRadius: '6px', fontSize: '11px' }}>⏰ {ev.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── EVENTS PANEL — desktop always visible, mobile as overlay ── */}
        <div
          className={`events-panel${showPanel ? ' open' : ''}`}
          style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '70vh', overflowY: 'auto', animation: 'panelSlide 0.3s ease' }}
        >
          {/* Panel header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', margin: 0 }}>
              {selectedDate ? `📋 ${MONTHS[month]} ${selectedDate}` : '📋 Select a date'}
            </h3>
            {/* Close button — mobile only */}
            <button
              onClick={() => setShowPanel(false)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}
            >
              ✕
            </button>
          </div>

          {/* No date selected */}
          {!selectedDate && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569' }}>
              <p style={{ fontSize: '40px' }}>👆</p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>Click any date to see events</p>
            </div>
          )}

          {/* No events */}
          {selectedDate && selectedEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
              <p style={{ fontSize: '36px' }}>🗓️</p>
              <p style={{ color: '#475569', marginTop: '8px', fontSize: '13px' }}>No events on this day</p>
              <button
                onClick={() => navigate('/add')}
                style={{ marginTop: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
              >
                ➕ Add Event
              </button>
            </div>
          )}

          {/* Events for selected date */}
          {selectedEvents.map(ev => (
            <div
              key={ev.id}
              className="event-card-cal"
              style={{ borderRadius: '14px', padding: '14px', background: ev.color+'12', border: `1px solid ${ev.color}33`, transition: 'all 0.2s', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ background: ev.color+'25', color: ev.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{ev.category}</span>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: ev.color, display: 'block', boxShadow: `0 0 8px ${ev.color}` }} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: '700', margin: '0 0 8px' }}>{ev.title}</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', padding: '3px 8px', borderRadius: '6px', fontSize: '11px' }}>📅 {ev.date}</span>
                <span style={{ background: ev.color+'20', color: ev.color, padding: '3px 8px', borderRadius: '6px', fontSize: '11px' }}>⏰ {ev.time}</span>
              </div>
            </div>
          ))}

          {/* All upcoming */}
          <div style={{ marginTop: '8px' }}>
            <p style={{ color: '#475569', fontSize: '11px', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.5px' }}>🔔 ALL UPCOMING</p>
            {schedules.length === 0 && (
              <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', padding: '16px 0' }}>No schedules yet</p>
            )}
            {schedules.map(ev => (
              <div key={ev.id} className="mini-event" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '9px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', transition: 'all 0.15s', cursor: 'pointer' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ev.color, flexShrink: 0, marginTop: '4px', boxShadow: `0 0 5px ${ev.color}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</p>
                  <p style={{ color: '#475569', fontSize: '10px', marginTop: '2px' }}>{ev.date} · {ev.time}</p>
                </div>
                <span style={{ background: ev.color+'20', color: ev.color, padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{ev.category}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mobile overlay backdrop */}
      {showPanel && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 299, backdropFilter: 'blur(4px)', display: 'none' }}
          className="mob-backdrop"
          onClick={() => setShowPanel(false)}
        />
      )}

      <style>{`
        @media(max-width:900px){
          .mob-backdrop { display:block !important; }
          .events-panel {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: auto !important;
            border-radius: 20px 20px 0 0 !important;
            max-height: 75vh !important;
            z-index: 300 !important;
            animation: panelSlide 0.3s ease !important;
            border-bottom: none !important;
          }
          .events-panel:not(.open) {
            display: none !important;
          }
        }
        @keyframes panelSlide {
          from{ opacity:0; transform:translateY(30px); }
          to  { opacity:1; transform:translateY(0); }
        }
      `}</style>

    </PageLayout>
  )
}