"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Plus,
  Tag,
  Users,
  Target,
  AlertCircle,
  ArrowLeft,
  FileText,
  Coins,
} from "lucide-react";

interface CreateResp {
  success: boolean;
  number?: number;
  message?: string;
}


const PRESET_LABELS = [
  { name: "bug", color: "bg-red-100 text-red-800 border-red-200" },
  { name: "enhancement", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { name: "question", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { name: "documentation", color: "bg-green-100 text-green-800 border-green-200" },
  { name: "good first issue", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
];

export default function NewIssueForm() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { user, isLoading: userLoading } = useUser();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [assignees, setAssignees] = useState<string>("");
  const [milestone, setMilestone] = useState<string>("");
  const [stake, setStake] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug log
  useEffect(() => {
    console.log("🧑 user from context:", user);
  }, [user]);

  if (userLoading) {
    return <p className="text-center text-gray-500">Loading user…</p>;
  }
  if (!user) {
    return <p className="text-red-500">You must be logged in to create issues.</p>;
  }
  if (!owner || !repo) {
    return <p className="text-red-500">Missing repository parameters.</p>;
  }

  const toggleLabel = (l: string) =>
    setLabels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8012";

    const handleSubmit = async () => {
      if (!title.trim()) {
        setError("Title is required");
        return;
      }
      setSubmitting(true);
      setError(null);
      
    console.log("🎯 Current stake value:", stake); // Debug log
    console.log("🎯 Type of stake:", typeof stake); // Debug log

      // 1) build the payload for GitHub
      const createPayload = {
        owner,
        repo,
        title,
        body,
        labels,
        assignees: assignees
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        milestone: milestone || undefined,
        stake,
        githubToken: user.accessToken,
      };
      
      const appJwt = localStorage.getItem("token");
      const headers = {
        withCredentials: true,
        headers: { Authorization: appJwt ? `Bearer ${appJwt}` : undefined }
      };
      
      try {
        // 2) create on GitHub
        const { data: createRes } = await axios.post<CreateResp>(
          `${API_BASE}/api/maintainer/create-issue`,
          createPayload,
          headers
        );
        if (!createRes.success) {
          throw new Error(createRes.message || "GitHub issue creation failed");
        }
        const ghIssue = createRes.data!;
        
        console.log("GitHub issue created:", ghIssue);
        console.log("User data:", user);
        
        // 3) Enhanced ingest payload with aRepRepository Dashboardository Dashboardll required data
        const ingestPayload = {
          userId: user._id || user.id, // Make sure this field exists
          githubUsername: user.profile?.username || user.username || user.githubUsername,
          repository: { 
            owner, 
            repo 
          },
          issue: {
            ...ghIssue,
            // Add repository data that might be missing from GitHub response
            repository: {
              id: 0, // Will be handled by backend
              name: repo,
              owner: {
                login: owner
              },
              full_name: `${owner}/${repo}`,
              html_url: `https://github.com/${owner}/${repo}`,
              language: "", // Backend will handle fallback
              stargazers_count: 0,
              forks_count: 0,
              description: ""
            }
          },
          stakingRequired: stake,
          userAccessToken: user.accessToken, // Add this for repository fetching
        };
        
        console.log("Ingest payload:", ingestPayload);
        
        const { data: ingestRes } = await axios.post<{
          success: boolean;
          message?: string;
        }>(
          `http://localhost:8012/api/maintainer/ingest-issue`,
          ingestPayload,
          headers
        );
        
        if (!ingestRes.success) {
          throw new Error(ingestRes.message || "Failed to save issue locally");
        }
        
        // 4) on total success, navigate back
        navigate(`/maintainer/dashboard`);
      } catch (err: any) {
        console.error("❌ error creating/ingesting issue:", err);
        setError(err.response?.data?.message || err.message || "Unknown error");
      } finally {
        setSubmitting(false);
      }
    };
    
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back & Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Github className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Create New Issue</h1>
            <p className="text-gray-600">{owner}/{repo}</p>
          </div>
        </div>
      </div>

      <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
        <CardContent className="p-8 space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Title</label>
            </div>
            <Input
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              className="text-lg font-medium"
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Textarea
              placeholder="Steps to reproduce, expected behavior, context…"
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={submitting}
              className="leading-relaxed"
            />
          </div>

          {/* Labels */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <h3 className="text-lg font-semibold">Labels</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_LABELS.map(({ name, color }) => (
                <Badge
                  key={name}
                  onClick={() => toggleLabel(name)}
                  className={`cursor-pointer border ${
                    labels.includes(name)
                      ? color
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {name}
                </Badge>
              ))}
            </div>
            {labels.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {labels.join(", ")}
              </p>
            )}
          </div>

          {/* Assignees & Milestone */}
          <div className="border-t pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Assignees
                </label>
              </div>
              <Input
                placeholder="username1, username2"
                value={assignees}
                onChange={(e) => setAssignees(e.target.value)}
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                comma-separated GitHub logins
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Milestone
                </label>
              </div>
              <Input
                placeholder="Milestone title or number"
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">optional</p>
            </div>
          </div>

          <div className="border-t pt-6 flex items-center space-x-3">
            <Coins className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Stake (coins)
              </label>
              <Input
                type="number"
                min={15}
                max={30}
                value={stake}
                onChange={(e) => {
                  const value = Math.max(15, Math.min(30, Number(e.target.value)));
                  setStake(value);
                  console.log("🎯 Stake updated to:", value); // Debug log
                }}
                disabled={submitting}
                className="w-32"
                placeholder="15-30"
              />
              <p className="text-xs text-gray-500 mt-1">
                You must stake between 15 and 30 coins.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Current stake: {stake} coins
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-8 py-6 rounded-b-lg flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Issues track bugs, features & tasks
          </span>
          <div className="space-x-3">  
            <Button variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !title.trim()}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {submitting ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating…
                </span>
              ) : (
                <span className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Issue
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
