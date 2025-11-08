import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()
  const loc = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await loginUser({ email, password })
      const dest = loc.state?.from?.pathname || '/admin'
      nav(dest, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold mb-2">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label">Correo</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="label">Contraseña</label>
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="btn w-full">Entrar</button>
      </form>
      <p className="text-sm mt-3">¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </div>
  )
}
