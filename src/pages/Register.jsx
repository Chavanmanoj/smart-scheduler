import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showCon, setShowCon]   = useState(false)
  const { register }            = useAuth()
  const navigate                = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password || !confirm) {
      setError('Please fill all fields'); return
    }
    if (password !== confirm) {
      setError('Passwords do not match'); return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters'); return
    }

    const result = register(name, email, password)
    if (!result.success) {
      setError(result.message); return
    }

    navigate('/dashboard')
  }

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeIn {
          from{ opacity:0; transform:translateY(20px); }
          to{ opacity:1; transform:translateY(0); }
        }

        input:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.2) !important;
          outline: none !important;
        }

        .reg-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(79,70,229,0.55);
        }

        /* Desktop */
        @media(min-width:769px){
          .reg-left { display:flex !important; }
          .reg-right { width:50% !important; }
        }

        /* MOBILE FIX */
        @media(max-width:768px){
          .reg-left { display:none !important; }

          .reg-right {
            width:100% !important;
            min-height:100vh !important;
            padding:16px !important;

            display:flex !important;
            justify-content:center !important;
            align-items:center !important;

            overflow-y:auto !important;
          }

          .reg-card {
            width:100% !important;
            max-width:380px !important;

            padding:22px 16px !important;
            margin:auto !important;

            border-radius:18px !important;
          }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="reg-left" style={s.left}>
        <h1 style={{color:'#fff'}}>Smart Scheduler</h1>
        <p style={{color:'#94a3b8'}}>Create your free account</p>
      </div>

      {/* RIGHT FORM */}
      <div className="reg-right" style={s.right}>
        <div className="reg-card" style={s.card}>

          <h2 style={s.title}>Create Account 🚀</h2>

          {error && <div style={s.error}>⚠️ {error}</div>}

          <form onSubmit={handleRegister}>

            <input
              style={s.input}
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input
              style={s.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            {/* PASSWORD */}
            <div style={{position:'relative'}}>
              <input
                style={s.input}
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={s.eye}
              >
                👁️
              </button>
            </div>

            {/* CONFIRM */}
            <div style={{position:'relative'}}>
              <input
                style={s.input}
                type={showCon ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCon(!showCon)}
                style={s.eye}
              >
                👁️
              </button>
            </div>

            <button className="reg-btn" style={s.button}>
              Create Account →
            </button>

          </form>

          <p style={s.footer}>
            Already have account? <Link to="/login">Login</Link>
          </p>

        </div>
      </div>
    </div>
  )
}

/* STYLES */
const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#07060f'
  },

  left: {
    display:'none',
    width:'50%',
    padding:'40px'
  },

  right: {
    width:'50%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },

  card: {
    background:'#111',
    padding:'30px',
    borderRadius:'20px',
    width:'100%',
    maxWidth:'420px'
  },

  title: {
    color:'#fff',
    marginBottom:'20px'
  },

  input: {
    width:'100%',
    padding:'12px',
    marginBottom:'12px',
    borderRadius:'10px',
    border:'1px solid #333',
    background:'#000',
    color:'#fff'
  },

  button: {
    width:'100%',
    padding:'12px',
    background:'#4f46e5',
    color:'#fff',
    border:'none',
    borderRadius:'10px',
    cursor:'pointer'
  },

  error: {
    background:'#330000',
    padding:'10px',
    borderRadius:'10px',
    marginBottom:'10px',
    color:'#ff6b6b'
  },

  footer: {
    marginTop:'10px',
    color:'#aaa'
  },

  eye: {
    position:'absolute',
    right:'10px',
    top:'12px',
    background:'none',
    border:'none',
    color:'#fff',
    cursor:'pointer'
  }
}