import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import AddSchedule  from './pages/AddSchedule'
import CalendarPage from './pages/CalendarPage'
import MySchedules  from './pages/MySchedules'
import AdminPanel   from './pages/AdminPanel'
import RBACDemo     from './pages/RBACDemo'
import Settings     from './pages/Settings'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/"          element={<Navigate to="/dashboard" />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add"       element={<PrivateRoute><AddSchedule /></PrivateRoute>} />
          <Route path="/calendar"  element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
          <Route path="/schedules" element={<PrivateRoute><MySchedules /></PrivateRoute>} />
          <Route path="/admin"     element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
          <Route path="/rbac"      element={<PrivateRoute><RBACDemo /></PrivateRoute>} />
          <Route path="/settings"  element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App