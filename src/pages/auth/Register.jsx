import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/auth'

export default function Register() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('reportero') // Para pruebas rápidas
  const [error, setError] = useState('')
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await registerUser({ email, password, displayName, role })
      nav('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold mb-2">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Nombre</label>
          <input className="input" value={displayName} onChange={e=>setDisplayName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Correo</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="label">Contraseña</label>
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        <div>
          <label className="label">Rol (sólo pruebas)</label>
          <select className="select" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="reportero">Reportero</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="btn w-full">Registrarme</button>
      </form>
      <p className="text-sm mt-3">¿Ya tienes cuenta? <Link to="/login">Entrar</Link></p>
    </div>
  )
}
