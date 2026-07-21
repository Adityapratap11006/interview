import { createContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

function loadStoredUser() {
  if (typeof window === 'undefined') return null

  try {
    const storedUser = localStorage.getItem('prepPilotUser') || sessionStorage.getItem('prepPilotUser')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

function persistUser(user, remember) {
  const target = remember ? localStorage : sessionStorage
  const fallback = remember ? sessionStorage : localStorage

  target.setItem('prepPilotUser', JSON.stringify(user))
  fallback.removeItem('prepPilotUser')
}

function persistToken(token, remember) {
  const target = remember ? localStorage : sessionStorage
  const fallback = remember ? sessionStorage : localStorage

  target.setItem('prepPilotToken', token)
  fallback.removeItem('prepPilotToken')
}

function clearAuthStorage() {
  localStorage.removeItem('prepPilotToken')
  localStorage.removeItem('prepPilotUser')
  sessionStorage.removeItem('prepPilotToken')
  sessionStorage.removeItem('prepPilotUser')
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser)

  const value = useMemo(
    () => ({
      user,
      login: (nextUser, token, remember = true) => {
        if (token) persistToken(token, remember)
        if (nextUser) persistUser(nextUser, remember)
        setUser(nextUser)
      },
      logout: () => {
        clearAuthStorage()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
