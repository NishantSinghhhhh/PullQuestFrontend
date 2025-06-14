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
  const [user, setUserInternal] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const updateUser = (userData: User | null) => {
    setUserInternal(userData)
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData))
    } else {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedUser = localStorage.getItem("user")
      const authToken = localStorage.getItem("token")
      if (storedUser && authToken) {
        try {
          const parsedUser: User = JSON.parse(storedUser)
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/context/${encodeURIComponent(parsedUser.email || "")}`,
            { headers: { Authorization: `Bearer ${authToken}` } }
          )
          if (response.ok) {
            const userData = await response.json()
            updateUser(userData)
          } else {
            updateUser(null)
          }
        } catch (error) {
          console.error("Error refreshing user context:", error)
          updateUser(null)
        }
      }
      setLoading(false)
    }

    loadUserFromStorage()
  }, [])

  const logout = () => {
    updateUser(null)
    window.location.href = "/login"
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser: updateUser,
      logout,
      isLoading: loading,
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
