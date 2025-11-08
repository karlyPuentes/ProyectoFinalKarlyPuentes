import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllNews, updateNews } from '../../services/db'
import { useAuth } from '../../context/AuthContext'

export default function AllNews() {
  const [items, setItems] = useState([])
  const { role } = useAuth()

  useEffect(() => {
    (async () => setItems(await getAllNews({})))()
  }, [])

  const setStatus = async (id, status) => {
    await updateNews(id, { status })
    setItems(items.map(i => i.id===id ? { ...i, status } : i))
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Todas las noticias</h1>
      <div className="grid gap-3">
        {items.map(n => (
          <div key={n.id} className="card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold">{n.title}</div>
                <div className="text-sm text-gray-600">{n.subtitle}</div>
                <div className="text-xs text-gray-500">Autor: {n.authorName}</div>
                <div className="badge mt-1">Estado: {n.status}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/admin/editar/${n.id}`} className="btn">Editar</Link>
                {role==='editor' && (
                  <>
                    <button className="btn" onClick={()=>setStatus(n.id,'Publicado')}>Publicar</button>
                    <button className="btn" onClick={()=>setStatus(n.id,'Desactivado')}>Desactivar</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
