import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const defaultSchedules = [
  { id: 1, title: 'Team Standup',        date: '2026-03-15', time: '10:00', category: 'Meeting',  color: '#10b981' },
  { id: 2, title: 'Project Deadline',    date: '2026-03-16', time: '23:59', category: 'Deadline', color: '#f43f5e' },
  { id: 3, title: 'Workshop Session',    date: '2026-03-17', time: '14:00', category: 'Study',    color: '#06b6d4' },
  { id: 4, title: 'Lab Experiment',      date: '2026-03-18', time: '09:00', category: 'Lab',      color: '#f59e0b' },
  { id: 5, title: 'Security Review',     date: '2026-03-19', time: '16:00', category: 'Work',     color: '#6366f1' },
]

export default function CalendarPage() {
  const navigate = useNavigate()
  const [schedules, setSchedules]       = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentDate, setCurrentDate]   = useState(new Date(2026,2,1))
  const [hovered, setHovered]           = useState(null)

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

  return (
    <PageLayout title="📅 Calendar" subtitle="View and manage your schedule">
      <style>{`
        @keyframes calFadeIn {
          from{ opacity:0; transform:translateY(16px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes dayPop {
          from{ transform:scale(0.8); opacity:0; }
          to  { transform:scale(1);   opacity:1; }
        }
        .day-cell:hover {
          background: rgba(79,70,229,0.2) !important;
          border-color: #4f46e5 !important;
          transform: scale(1.05) !important;
          cursor: pointer !important;
        }
        .event-card:hover {
          transform: translateX(4px) !important;
          border-color: currentColor !important;
        }
        @media(max-width:900px){
          .cal-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', animation: 'calFadeIn 0.4s ease' }}>
        <button onClick={() => navigate('/add')} style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '11px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,0.4)' }}>
          ➕ New Schedule
        </button>
      </div>

      <div className="cal-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', animation: 'calFadeIn 0.5s ease 0.1s both' }}>

        {/* Calendar */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>

          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button onClick={() => setCurrentDate(new Date(year, month-1, 1))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', width: '38px', height: '38px', fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s' }}>‹</button>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>{MONTHS[month]} {year}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month+1, 1))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '10px', width: '38px', height: '38px', fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s' }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '8px', gap: '4px' }}>
            {DAYS.map(d => (
              <div key={d} style={{ color: '#4f46e5', fontSize: '12px', textAlign: 'center', padding: '6px 0', fontWeight: '700', letterSpacing: '0.5px' }}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
            {Array(firstDay).fill(null).map((_,i) => <div key={'e'+i} />)}
            {Array(daysInMonth).fill(null).map((_,i) => {
              const day    = i + 1
              const events = getEvents(day)
              const isToday   = today.getFullYear()===year && today.getMonth()===month && today.getDate()===day
              const isSelected= selectedDate === day
              return (
                <div
                  key={day}
                  className="day-cell"
                  onClick={() => setSelectedDate(day)}
                  style={{
                    borderRadius: '12px', height: '60px', padding: '6px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    border: `1px solid ${isSelected ? '#4f46e5' : isToday ? '#4f46e5' : 'rgba(255,255,255,0.06)'}`,
                    background: isSelected ? 'rgba(79,70,229,0.35)' : isToday ? 'rgba(79,70,229,0.12)' : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.2s',
                    animation: `dayPop 0.3s ease ${i*0.01}s both`,
                  }}
                >
                  <span style={{ color: isSelected ? '#fff' : isToday ? '#818cf8' : '#e2e8f0', fontSize: '13px', fontWeight: isToday || isSelected ? '800' : '500' }}>{day}</span>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {events.slice(0,3).map((ev,idx) => (
                      <span key={idx} style={{ width: '5px', height: '5px', borderRadius: '50%', background: ev.color, display: 'block' }} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
            {[
              {l:'Meeting', c:'#10b981'},{l:'Deadline', c:'#f43f5e'},
              {l:'Study',   c:'#06b6d4'},{l:'Work',    c:'#6366f1'},
              {l:'Lab',     c:'#f59e0b'},
            ].map(item => (
              <div key={item.l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: item.c, display: 'block', boxShadow: `0 0 6px ${item.c}` }} />
                <span style={{ color: '#64748b', fontSize: '12px' }}>{item.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events panel */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
          <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>
            {selectedDate ? `📋 ${MONTHS[month]} ${selectedDate}` : '📋 Select a date'}
          </h3>

          {!selectedDate && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569' }}>
              <p style={{ fontSize: '36px' }}>👆</p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>Click any date to see events</p>
            </div>
          )}

          {selectedDate && selectedEvents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontSize: '36px' }}>🗓️</p>
              <p style={{ color: '#475569', marginTop: '8px', fontSize: '13px' }}>No events this day</p>
              <button onClick={() => navigate('/add')} style={{ marginTop: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>➕ Add</button>
            </div>
          )}

          {selectedEvents.map(ev => (
            <div key={ev.id} className="event-card" style={{ borderRadius: '14px', padding: '14px', background: ev.color + '12', border: `1px solid ${ev.color}33`, transition: 'all 0.2s', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ background: ev.color+'25', color: ev.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{ev.category}</span>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: ev.color, display: 'block', marginTop: '4px', boxShadow: `0 0 8px ${ev.color}` }} />
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
            <p style={{ color: '#475569', fontSize: '12px', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.5px' }}>🔔 ALL UPCOMING</p>
            {schedules.map(ev => (
              <div key={ev.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ev.color, flexShrink: 0, marginTop: '4px', boxShadow: `0 0 6px ${ev.color}` }} />
                <div>
                  <p style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: '600', margin: 0 }}>{ev.title}</p>
                  <p style={{ color: '#475569', fontSize: '10px', marginTop: '2px' }}>{ev.date} · {ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  )
}