import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const defaultSchedules = [
  { id: 1, title: 'Team Standup', date: '2026-03-15', time: '10:00', category: 'Meeting', color: '#10b981', priority: 'High' },
  { id: 2, title: 'Project Deadline', date: '2026-03-16', time: '23:59', category: 'Deadline', color: '#f43f5e', priority: 'High' },
  { id: 3, title: 'Workshop Session', date: '2026-03-17', time: '14:00', category: 'Study', color: '#06b6d4', priority: 'Medium' },
]

const bgMap = {
  Meeting:'#0d2d24', Deadline:'#2d1b2e', Study:'#0d2530'
}

export default function MySchedules() {
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('schedules') || '[]')
    setSchedules([...defaultSchedules, ...saved])
  }, [])

  const filtered = schedules.filter(s =>
    (filter === 'All' || s.category === filter) &&
    s.title.toLowerCase().includes(search.toLowerCase())
  )

  const cats = ['All', ...new Set(schedules.map(s => s.category))]

  return (
    <PageLayout title="📁 My Schedules">

      <style>{`
        @media(max-width:768px){

          .actions {
            flex-direction:column;
            gap:10px;
          }

          .actions button,
          .actions input {
            width:100%;
          }

          .grid {
            display:flex !important;
            flex-direction:column !important;
            gap:12px;
          }

          .card {
            width:100%;
            border-radius:14px;
          }

          .cats {
            overflow-x:auto;
            flex-wrap:nowrap;
          }

          .cats button {
            flex-shrink:0;
          }
        }
      `}</style>

      {/* ACTIONS */}
      <div className="actions" style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
        
        <button
          onClick={() => navigate('/add')}
          style={btn}
        >
          ➕ Add
        </button>

        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={input}
        />

      </div>

      {/* FILTER */}
      <div className="cats" style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            style={{
              ...filterBtn,
              background: filter === c ? '#4f46e5' : '#111'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="grid" style={{
        display:'grid',
        gridTemplateColumns:'repeat(3,1fr)',
        gap:'16px'
      }}>

        {filtered.map(item => (
          <div key={item.id} className="card" style={{
            background: bgMap[item.category] || '#111',
            padding:'14px',
            borderRadius:'16px',
            color:'#fff'
          }}>

            <h3>{item.title}</h3>

            <p style={{ fontSize:'12px', color:'#aaa' }}>
              📅 {item.date} | ⏰ {item.time}
            </p>

            <span style={{
              background:item.color,
              padding:'4px 8px',
              borderRadius:'6px',
              fontSize:'11px'
            }}>
              {item.category}
            </span>

          </div>
        ))}

      </div>

    </PageLayout>
  )
}

/* STYLES */

const btn = {
  padding:'10px',
  background:'#4f46e5',
  color:'#fff',
  border:'none',
  borderRadius:'10px',
  cursor:'pointer'
}

const input = {
  flex:1,
  padding:'10px',
  borderRadius:'10px',
  border:'1px solid #333',
  background:'#000',
  color:'#fff'
}

const filterBtn = {
  padding:'6px 12px',
  borderRadius:'20px',
  border:'none',
  color:'#fff',
  cursor:'pointer'
}