"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useUser } from "../context/UserProvider"
import axios from "axios"
import {
  GitPullRequest,
  ArrowLeft,
  AlertCircle,
  Search,
  Filter,
  Plus,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MarkdownPreview from "@/components/MarkdownPreview"
import PRCard from "@/components/PRsCard"

interface RawPR {
  number: number
  title: string
  body: string
  user: { login: string; avatar_url?: string }
  state: "open" | "closed"
  created_at: string
  updated_at: string
  comments: number
  html_url: string
  labels: { name: string; color?: string }[]
  draft?: boolean
  mergeable_state?: string
  assignees?: { login: string; avatar_url?: string }[]
  requested_reviewers?: { login: string; avatar_url?: string }[]
  additions?: number
  deletions?: number
  changed_files?: number
}

interface Repo {
  name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  updated_at: string
  open_issues_count: number
  owner: {
    login: string
  }
}

export default function RepoPrs() {
  const location = useLocation()
  const { user, isLoading: userLoading } = useUser()
  const repoData = (location.state as { repo: Repo })?.repo

  const owner = repoData?.owner?.login
  const repo = repoData?.name

  const [prs, setPrs] = useState<RawPR[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPR, setSelectedPR] = useState<RawPR | null>(null)

  const [relatedIssue, setRelatedIssue] = useState<any | null>(null)
  const [issueLoading, setIssueLoading] = useState(false)
  const [issueError, setIssueError] = useState<string | null>(null)

  useEffect(() => {
    if (userLoading || !user || !owner || !repo) return

    setLoading(true)
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:8012"}/api/maintainer/repo-pulls?owner=${owner}&repo=${repo}&state=open&per_page=30&page=1`
    const jwt = localStorage.getItem("token")
    const config = {
      withCredentials: true,
      headers: { Authorization: jwt ? `Bearer ${jwt}` : undefined },
    }

    axios
      .get<{ success: boolean; data: RawPR[] }>(url, config)
      .then((res) => {
        if (res.data.success) setPrs(res.data.data)
        else setError("Failed to load pull requests")
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Unknown error")
      })
      .finally(() => setLoading(false))
  }, [user, userLoading, owner, repo])

  const fetchRelatedIssue = async (body: string) => {
    const match = body?.match(/#(\d+)/)
    const issueNumber = match?.[1]
    const hasPullQuestTag = body?.includes("#PullQuest")

    if (!issueNumber) return

    setIssueLoading(true)
    setIssueError(null)
    setRelatedIssue(null)

    const url = `${import.meta.env.VITE_API_URL || "http://localhost:8012"}/api/maintainer/issue-by-number?owner=${owner}&repo=${repo}&number=${issueNumber}`
    const jwt = localStorage.getItem("token")
    const config = {
      withCredentials: true,
      headers: { Authorization: jwt ? `Bearer ${jwt}` : undefined },
    }

    try {
      const res = await axios.get(url, config)
      if (res.data.success) setRelatedIssue(res.data.data)
      else setIssueError("Failed to fetch issue")
    } catch (err: any) {
      setIssueError(err.response?.data?.message || "Issue fetch failed")
    } finally {
      setIssueLoading(false)
    }
  }

  const filteredPRs = prs.filter(
    (pr) =>
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.user.login.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-gray-600">Loading pull requests...</span>
      </div>
    )
  }

  if (error || !owner || !repo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error || "Missing repository information"}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to repositories
          </Button>
          <div className="mt-6">
            <div className="flex items-center space-x-3 mb-2">
              <GitPullRequest className="w-6 h-6 text-gray-700" />
              <h1 className="text-4xl font-bold text-gray-900">Pull Requests</h1>
            </div>
            <p className="text-xl text-gray-600">{owner}/{repo}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Search pull requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>

        {/* PR Cards */}
        <div className="space-y-4">
          {filteredPRs.length ? (
            filteredPRs.map((pr) => (
              <PRCard
                key={pr.number}
                pr={pr}
                isSelected={selectedPR?.number === pr.number}
                onSelect={() => setSelectedPR(selectedPR?.number === pr.number ? null : pr)}
                onFetchIssue={() => fetchRelatedIssue(pr.body)}
              />
            ))
          ) : (
            <Card className="bg-white border border-dashed border-gray-200">
              <CardContent className="p-12 text-center">
                <GitPullRequest className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No open pull requests found.</p>
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://github.com/${owner}/${repo}/pulls`, "_blank")}
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Pull Request
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Issue */}
        {issueLoading && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <span className="text-blue-800">Fetching related issue...</span>
            </CardContent>
          </Card>
        )}

        {issueError && (
          <Card className="mt-6 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-800 font-medium">{issueError}</p>
            </CardContent>
          </Card>
        )}

        {relatedIssue && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardHeader className="pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Related Issue Found</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-800 hover:text-red-600"
                onClick={() => setRelatedIssue(null)}
              >
                Close
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <h4 className="font-semibold text-green-900">
                #{relatedIssue.number}: {relatedIssue.title}
              </h4>
              <MarkdownPreview content={relatedIssue.body || "*No description provided.*"} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
