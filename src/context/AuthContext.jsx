import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getUserDoc } from '../services/auth'
import { auth } from '../services/firebase'



const Ctx = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const profile = await getUserDoc(u.uid)
        setRole(profile?.role || null)
      } else {
        setRole(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const logout = async () => { await signOut(auth) }

  const value = { user, role, logout, loading }
  return <Ctx.Provider value={value}>{!loading && children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
