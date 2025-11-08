import { useEffect, useState } from 'react'
import { createSection, deleteSection, getSections } from '../../services/db'
import { useAuth } from '../../context/AuthContext'

export default function Sections() {
  const { role } = useAuth()
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  useEffect(()=>{
    (async () => setItems(await getSections()))()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!name || !slug) return
    await createSection({ name, slug })
    setItems(await getSections())
    setName(''); setSlug('')
  }

  const del = async (id) => {
    await deleteSection(id)
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Secciones</h1>
      <form onSubmit={add} className="card grid sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Nombre</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Slug</label>
          <input className="input" value={slug} onChange={e=>setSlug(e.target.value)} />
        </div>
        <div className="flex items-end">
          <button className="btn w-full">Agregar</button>
        </div>
      </form>
      <div className="grid gap-2">
        {items.map(s => (
          <div key={s.id} className="card flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-500">/{s.slug}</div>
            </div>
            {role==='editor' && <button className="btn" onClick={()=>del(s.id)}>Eliminar</button>}
          </div>
        ))}
        {items.length===0 && <div className="text-gray-500">No hay secciones.</div>}
      </div>
    </div>
  )
}
