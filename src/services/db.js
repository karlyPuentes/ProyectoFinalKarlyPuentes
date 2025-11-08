import { db } from './firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  limit
} from 'firebase/firestore'

// Estados válidos
export const NEWS_STATUS = ['Edición', 'Terminado', 'Publicado', 'Desactivado']

// 🗂️ SECCIONES
export async function getSections() {
  const qs = await getDocs(query(collection(db, 'sections'), orderBy('name')))
  return qs.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createSection({ name, slug }) {
  return await addDoc(collection(db, 'sections'), {
    name,
    slug,
    createdAt: serverTimestamp(),
  })
}

export async function deleteSection(id) {
  return await deleteDoc(doc(db, 'sections', id))
}

// 🌍 NOTICIAS PÚBLICAS (por sección)
export async function getNewsPublicBySection(sectionId, max = 10) {
  const qs = await getDocs(query(
    collection(db, 'news'),
    where('status', '==', 'Publicado'),
    where('sectionId', '==', sectionId),
    orderBy('createdAt', 'desc'),
    limit(max)
  ))
  return qs.docs.map(d => ({ id: d.id, ...d.data() }))
}

// 📰 TODAS LAS NOTICIAS (dashboard)
export async function getAllNews({ onlyMine = false, authorId = null }) {
  try {
    let q
    if (onlyMine && authorId) {
      // 🔹 Cargar solo las del reportero actual
      q = query(
        collection(db, 'news'),
        where('authorId', '==', authorId),
        orderBy('createdAt', 'desc')
      )
      console.log('📄 Cargando solo noticias del usuario:', authorId)
    } else {
      // 🔹 Editor: todas las noticias
      q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
      console.log('📰 Cargando todas las noticias')
    }

    const qs = await getDocs(q)
    const result = qs.docs.map(d => ({ id: d.id, ...d.data() }))
    console.log('✅ Noticias encontradas:', result.length)
    return result
  } catch (err) {
    console.error('❌ Error al obtener noticias:', err)
    return []
  }
}

// 🗞️ Obtener una noticia específica
export async function getNews(id) {
  const snap = await getDoc(doc(db, 'news', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// ✍️ Crear noticia
export async function createNews(data) {
  return await addDoc(collection(db, 'news'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// 🔄 Actualizar noticia
export async function updateNews(id, data) {
  return await updateDoc(doc(db, 'news', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// 🗑️ Eliminar noticia
export async function deleteNews(id) {
  return await deleteDoc(doc(db, 'news', id))
}
