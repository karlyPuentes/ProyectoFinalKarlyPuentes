import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/public/Home'
import NewsDetail from './pages/public/NewsDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import AllNews from './pages/dashboard/AllNews'
import MyNews from './pages/dashboard/MyNews'
import EditNews from './pages/dashboard/EditNews'
import Sections from './pages/dashboard/Sections'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Público */}
          <Route path="/" element={<Home />} />
          <Route path="/noticia/:id" element={<NewsDetail />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="mis-noticias" replace />} />
            <Route path="mis-noticias" element={<MyNews />} />
            <Route path="todas" element={<AllNews />} />
            <Route path="editar/:id" element={<EditNews />} />
            <Route path="crear" element={<EditNews isCreate />} />
            <Route path="secciones" element={<Sections />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
