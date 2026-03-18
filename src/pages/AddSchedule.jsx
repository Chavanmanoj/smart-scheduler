import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const categories = [
  { label: 'Meeting',  color: '#10b981', icon: '🤝' },
  { label: 'Study',    color: '#06b6d4', icon: '📖' },
  { label: 'Work',     color: '#3b82f6', icon: '💼' },
  { label: 'Personal', color: '#a855f7', icon: '👤' },
  { label: 'Class',    color: '#6366f1', icon: '📚' },
  { label: 'Other',    color: '#94a3b8', icon: '📌' },
]

export default function AddSchedule() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', date: '', time: '',
    category: 'Meeting', description: '', priority: 'Medium'
  })
  const [success, setSuccess] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.date || !form.time) return
    const newItem = {
      ...form,
      id:    Date.now(),
      color: categories.find(c => c.label === form.category)?.color || '#6366f1'
    }
    const existing = JSON.parse(localStorage.getItem('schedules') || '[]')
    localStorage.setItem('schedules', JSON.stringify([...existing, newItem]))
    setSuccess(true)
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  const selected = categories.find(c => c.label === form.category)

  return (
    <PageLayout title="➕ Add Schedule" subtitle="Fill in the details to create a new schedule">
      <style>{`
        @keyframes addFadeIn {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0); }
        }
        input:focus, textarea:focus, select:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.15) !important;
          outline: none !important;
        }
        .cat-chip:hover { opacity:0.85; }
        .submit-btn:hover {
          transform:translateY(-2px) !important;
          box-shadow:0 8px 24px rgba(79,70,229,0.5) !important;
        }
        @media(max-width:600px){
          .add-row  { flex-direction:column !important; }
          .cat-grid { grid-template-columns:repeat(2,1fr) !important; }
          .pri-row  { flex-direction:column !important; }
        }
      `}</style>

      <div style={{ maxWidth: '620px', margin: '0 auto', animation: 'addFadeIn 0.5s ease' }}>

        {/* Success banner */}
        {success && (
          <div style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', borderRadius: '14px', padding: '14px 20px', marginBottom: '20px', fontSize: '14px', fontWeight: '700', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🎉 Schedule added successfully! Redirecting...
          </div>
        )}

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>

          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Title */}
            <div>
              <label style={fs.label}>📝 TITLE</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Team Meeting, Assignment Due, Gym Session..."
                style={fs.input}
              />
            </div>

            {/* Date & Time */}
            <div className="add-row" style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={fs.label}>📅 DATE</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} style={fs.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={fs.label}>⏰ TIME</label>
                <input name="time" type="time" value={form.time} onChange={handleChange} style={fs.input} />
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={fs.label}>🏷️ CATEGORY</label>
              <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {categories.map(cat => (
                  <div
                    key={cat.label}
                    className="cat-chip"
                    onClick={() => setForm({ ...form, category: cat.label })}
                    style={{ padding: '11px 8px', borderRadius: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: `2px solid ${form.category===cat.label ? cat.color : 'rgba(255,255,255,0.08)'}`, background: form.category===cat.label ? cat.color+'25' : 'rgba(255,255,255,0.03)', color: form.category===cat.label ? cat.color : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label style={fs.label}>🚦 PRIORITY</label>
              <div className="pri-row" style={{ display: 'flex', gap: '10px' }}>
                {['Low','Medium','High'].map(p => {
                  const pc = p==='High' ? '#f43f5e' : p==='Medium' ? '#f59e0b' : '#10b981'
                  const em = p==='High' ? '🔴' : p==='Medium' ? '🟡' : '🟢'
                  return (
                    <div
                      key={p}
                      onClick={() => setForm({ ...form, priority: p })}
                      style={{ flex: 1, padding: '11px 8px', borderRadius: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', border: `2px solid ${form.priority===p ? pc : 'rgba(255,255,255,0.08)'}`, background: form.priority===p ? pc+'25' : 'rgba(255,255,255,0.03)', color: form.priority===p ? pc : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      {em} {p}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={fs.label}>📄 NOTES (optional)</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                rows={3} placeholder="Add any extra notes or details..."
                style={{ ...fs.input, resize: 'none', lineHeight: '1.5' }}
              />
            </div>

            {/* Preview */}
            {form.title && (
              <div style={{ borderRadius: '14px', padding: '14px', border: `1px solid ${selected?.color}44`, background: selected?.color+'10' }}>
                <p style={{ color: '#64748b', fontSize: '10px', fontWeight: '700', marginBottom: '8px', letterSpacing: '1px' }}>PREVIEW</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px' }}>{selected?.icon}</span>
                  <p style={{ color: '#fff', fontWeight: '700', fontSize: '15px', margin: 0 }}>{form.title}</p>
                </div>
                {form.date && (
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 8px' }}>
                    📅 {form.date} {form.time && `· ⏰ ${form.time}`}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: selected?.color+'25', color: selected?.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{form.category}</span>
                  <span style={{ background: (form.priority==='High'?'#f43f5e':form.priority==='Medium'?'#f59e0b':'#10b981')+'20', color: form.priority==='High'?'#f43f5e':form.priority==='Medium'?'#f59e0b':'#10b981', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{form.priority}</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button className="submit-btn" type="submit" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(79,70,229,0.4)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.3px' }}>
              🎉 Save Schedule
            </button>

          </form>
        </div>
      </div>
    </PageLayout>
  )
}

const fs = {
  label: { color: '#94a3b8', fontSize: '11px', fontWeight: '700', display: 'block', marginBottom: '7px', letterSpacing: '0.5px' },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.2s', display: 'block' },
}