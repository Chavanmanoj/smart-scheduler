import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

const ROLE_PERMISSIONS = {
  admin:   ['view_own_schedules','view_all_schedules','create_schedule','edit_own_schedule','edit_any_schedule','delete_own_schedule','delete_any_schedule','export_ics','view_users','manage_users','view_logs','access_admin'],
  teacher: ['view_own_schedules','view_all_schedules','create_schedule','edit_own_schedule','delete_own_schedule','export_ics','view_users'],
  student: ['view_own_schedules','create_schedule','edit_own_schedule','delete_own_schedule','export_ics'],
}

// Only admin email is fixed — everyone else is student by default
const ADMIN_EMAIL = 'admin@smart.com'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartscheduser')
      if (saved) setUser(JSON.parse(saved))
    } catch(e) {
      localStorage.removeItem('smartscheduser')
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Get all registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

    // Check admin
    if (email === ADMIN_EMAIL && password === 'admin123') {
      const userData = { id: 1, name: 'Admin', email, role: 'admin' }
      localStorage.setItem('smartscheduser', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    }

    // Check registered users
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, message: 'Invalid email or password' }

    const userData = { id: found.id, name: found.name, email: found.email, role: found.role || 'student' }
    localStorage.setItem('smartscheduser', JSON.stringify(userData))
    setUser(userData)

    // Save login log
    const logs = JSON.parse(localStorage.getItem('loginHistory') || '[]')
    logs.unshift({ ...userData, action: 'Logged in', time: new Date().toLocaleString() })
    localStorage.setItem('loginHistory', JSON.stringify(logs.slice(0, 100)))

    return { success: true }
  }

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const exists = users.find(u => u.email === email)
    if (exists) return { success: false, message: 'Email already registered' }

    const newUser = {
      id:       Date.now(),
      name,
      email,
      password,
      role:     'student',
      joined:   new Date().toLocaleDateString(),
    }
    users.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(users))

    const userData = { id: newUser.id, name, email, role: 'student' }
    localStorage.setItem('smartscheduser', JSON.stringify(userData))
    setUser(userData)

    // Save login log
    const logs = JSON.parse(localStorage.getItem('loginHistory') || '[]')
    logs.unshift({ ...userData, action: 'Registered & Logged in', time: new Date().toLocaleString() })
    localStorage.setItem('loginHistory', JSON.stringify(logs.slice(0, 100)))

    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('smartscheduser')
    setUser(null)
  }

  const can = (permission) => {
    if (!user) return false
    return (ROLE_PERMISSIONS[user.role] || []).includes(permission)
  }

  const myPermissions = () => {
    if (!user) return []
    return ROLE_PERMISSIONS[user.role] || []
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, can, myPermissions, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}