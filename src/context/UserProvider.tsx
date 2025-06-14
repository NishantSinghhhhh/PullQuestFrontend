// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email?: string
  role: "contributor" | "maintainer" | "company"
  githubUsername?: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)


  const updateUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if (storedUser && token) {
        try {
          const parsedUser: User = JSON.parse(storedUser)
          // Fetch fresh user info from backend
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/context/${encodeURIComponent(parsedUser.email || '')}`,
            { headers: { "Authorization": `Bearer ${token}` } }
          )
          if (response.ok) {
            const data = await response.json()
            updateUser(data)
          } else {
            updateUser(null)
          }
        } catch (err) {
          console.error("Error refreshing user context:", err)
          updateUser(null)
        }
      }
      setIsLoading(false)
    }
    initializeUser()
  }, [])

  const logout = () => {
    updateUser(null)
    window.location.href = '/login'
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser: updateUser,
      logout,
      isLoading,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
