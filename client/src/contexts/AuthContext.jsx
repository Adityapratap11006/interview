import { createContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const value = useMemo(
    () => ({
      user,
      login: (nextUser) => setUser(nextUser),
      logout: () => setUser(null),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
