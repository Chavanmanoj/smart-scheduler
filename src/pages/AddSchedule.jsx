import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div style={styles.page}>
      <style>{`
        input:focus, textarea:focus, select:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.15) !important;
          outline: none !important;
        }
      `}</style>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.cardHeader}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
          <h2 style={styles.heading}>➕ Add New Schedule</h2>
          <p style={styles.sub}>Fill in the details below to add your schedule</p>
        </div>

        {success && (
          <div style={styles.successMsg}>🎉 Schedule added successfully! Redirecting...</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>📝 Title</label>
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Team Meeting, Assignment Due, Gym Session..."
              style={styles.input}
            />
          </div>

          {/* Date & Time */}
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>📅 Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} style={styles.input} />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>⏰ Time</label>
              <input name="time" type="time" value={form.time} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          {/* Category */}
          <div style={styles.field}>
            <label style={styles.label}>🏷️ Category</label>
            <div style={styles.catGrid}>
              {categories.map(cat => (
                <div
                  key={cat.label}
                  onClick={() => setForm({ ...form, category: cat.label })}
                  style={{
                    ...styles.catChip,
                    border:     `2px solid ${form.category === cat.label ? cat.color : '#2a2740'}`,
                    background: form.category === cat.label ? cat.color + '25' : '#1a1828',
                    color:      form.category === cat.label ? cat.color : '#94a3b8',
                  }}
                >
                  {cat.icon} {cat.label}
                </div>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div style={styles.field}>
            <label style={styles.label}>🚦 Priority</label>
            <div style={styles.row}>
              {['Low','Medium','High'].map(p => {
                const pc = p === 'High' ? '#f43f5e' : p === 'Medium' ? '#f59e0b' : '#10b981'
                return (
                  <div
                    key={p}
                    onClick={() => setForm({ ...form, priority: p })}
                    style={{
                      ...styles.priorityChip,
                      background: form.priority === p ? pc + '30' : '#1a1828',
                      color:      form.priority === p ? pc       : '#94a3b8',
                      border:     `2px solid ${form.priority === p ? pc : '#2a2740'}`,
                    }}
                  >
                    {p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'} {p}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>📄 Notes (optional)</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Add any extra notes or details..."
              style={{ ...styles.input, resize: 'none' }}
            />
          </div>

          {/* Live Preview */}
          {form.title && (
            <div style={{ ...styles.preview, borderColor: selected?.color + '66', background: selected?.color + '10' }}>
              <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '8px', fontWeight: '600', letterSpacing: '1px' }}>PREVIEW</p>
              <p style={{ color: '#fff', fontWeight: '600', fontSize: '15px', margin: '0 0 6px' }}>
                {selected?.icon} {form.title}
              </p>
              {form.date && (
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  📅 {form.date} {form.time && `⏰ ${form.time}`}
                </p>
              )}
              <span style={{ background: selected?.color + '25', color: selected?.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', marginTop: '8px', display: 'inline-block' }}>
                {form.category}
              </span>
            </div>
          )}

          <button type="submit" style={styles.submitBtn}>
            🎉 Save Schedule
          </button>

        </form>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0914', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '32px 16px' },
  card: { background: '#0f0e1a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', width: '100%', maxWidth: '600px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' },
  cardHeader: { background: 'rgba(79,70,229,0.1)', padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  backBtn:    { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', marginBottom: '12px' },
  heading:    { color: '#fff', fontSize: '22px', fontWeight: '700', margin: 0 },
  sub:        { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  successMsg: { background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '14px 24px', fontSize: '14px', borderBottom: '1px solid rgba(16,185,129,0.2)', fontWeight: '600' },
  form:       { padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  field:      { display: 'flex', flexDirection: 'column', gap: '8px' },
  label:      { color: '#94a3b8', fontSize: '13px', fontWeight: '600', letterSpacing: '0.3px' },
  input:      { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', width: '100%', boxSizing: 'border-box', transition: 'all 0.2s' },
  row:        { display: 'flex', gap: '16px' },
  catGrid:    { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' },
  catChip:    { padding: '10px', borderRadius: '10px', textAlign: 'center', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s' },
  priorityChip:{ flex: 1, padding: '10px', borderRadius: '10px', textAlign: 'center', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s' },
  preview:    { borderRadius: '12px', padding: '16px', border: '1px solid' },
  submitBtn:  { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(79,70,229,0.35)', letterSpacing: '0.3px' },
}