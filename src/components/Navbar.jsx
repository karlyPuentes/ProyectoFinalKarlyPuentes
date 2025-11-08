import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, role, logout } = useAuth()

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl text-sky-600">CMS Noticias</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className="text-sm">Inicio</NavLink>
          {user ? (
            <>
              <NavLink to="/admin" className="text-sm">Dashboard</NavLink>
              <span className="badge">Rol: {role || '—'}</span>
              <button onClick={logout} className="btn">Salir</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm">Ingresar</NavLink>
              <NavLink to="/register" className="text-sm">Crear cuenta</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
