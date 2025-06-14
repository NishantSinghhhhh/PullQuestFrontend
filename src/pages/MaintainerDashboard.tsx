import React, { useEffect, useState } from "react"
import { useUser } from "../context/UserProvider"

interface Organization {
  id: number
  login: string
  name: string | null
  description: string | null
  htmlUrl: string
}

export default function MaintainerDashboard() {
  const { user } = useUser()
  const [orgs, setOrgs] = useState<Organization[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user?.githubUsername) return

    const fetchOrgs = async () => {
      setIsLoading(true)
      try {
        // Use your backend API URL instead of relative path
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/github/orgs/${encodeURIComponent(user.githubUsername)}`
        
        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include authorization header if needed
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!res.ok) {
          // Check if response is HTML (error page)
          const contentType = res.headers.get('content-type')
          if (contentType && contentType.includes('text/html')) {
            throw new Error(`API endpoint not found: ${res.status}`)
          }
          throw new Error(`Failed to load orgs: ${res.status}`)
        }

        const data: any[] = await res.json()
        const mapped = data.map(org => ({
          id: org.id,
          login: org.login,
          name: org.name,
          description: org.description,
          htmlUrl: org.html_url,
        }))
        setOrgs(mapped)
      } catch (err: any) {
        console.error("Error fetching orgs:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrgs()
  }, [user])

  // Show loading state while user is being loaded
  if (!user) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Loading...</h2>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Maintainer Dashboard</h2>
      
      {/* Debug user info */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">User Info</h3>
        <pre className="text-sm bg-gray-100 p-2 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <h3 className="text-lg font-medium mb-2">Organizations</h3>
      
      {!user.githubUsername && (
        <p className="text-yellow-600">No GitHub username found for this user.</p>
      )}
      
      {isLoading && <p>Loading organizations...</p>}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-red-700">Error: {error}</p>
          <p className="text-sm text-red-600 mt-1">
            Make sure your backend API endpoint exists at: 
            {import.meta.env.VITE_API_URL}/api/github/orgs/{user.githubUsername}
          </p>
        </div>
      )}
      
      {orgs && orgs.length > 0 && (
        <ul className="list-disc ml-6">
          {orgs.map(org => (
            <li key={org.id} className="mb-2">
              <a 
                href={org.htmlUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-blue-600 hover:underline"
              >
                {org.login}
              </a>
              {org.name && <span className="ml-2 text-gray-600">({org.name})</span>}
              {org.description && <p className="ml-4 text-gray-500">{org.description}</p>}
            </li>
          ))}
        </ul>
      )}
      
      {orgs && orgs.length === 0 && (
        <p className="text-gray-500">No organizations found.</p>
      )}
    </div>
  )
}