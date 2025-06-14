"use client";

import { useState, useEffect } from "react";
import RepositoryCard from "@/components/RepositoryCard";
import { useUser } from "../context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface Repo {
  name: string;
  description: string;
  html_url: string;  // match GitHub field name
  language: string;
  stargazers_count: number;
  updated_at: string;
  open_issues_count: number;
  // ...any other fields you want from GitHub
}

export default function RepoStep() {
  const { user, isLoading: userLoading } = useUser();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoading) return;
    if (!user || !user.profile?.username) {
      setError("You need to log in first.");
      return;
    }

    setLoading(true);

    const githubUsername = user.profile.username;
    // Optionally change per_page/page if you want more/less
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:8012"}/api/maintainer/repos-by-username?githubUsername=${githubUsername}&per_page=30&page=1`;
    const jwtToken = localStorage.getItem("token");

    const config = {
      withCredentials: true,
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : undefined,
      },
    };

    // Log for debug
    console.log("Requesting user repos for:", githubUsername);
    console.log("Using JWT token:", jwtToken);

    axios
      .get<{ success: boolean; data: Repo[] }>(url, config)
      .then((res) => {
        console.log("Received repos response:", res.data);
        if (res.data.success) {
          setRepos(res.data.data);
        } else {
          setError(res.data.message || "Failed to load repositories");
        }
      })
      .catch((err) => {
        console.error("Error fetching repositories:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unknown error"
        );
      })
      .finally(() => setLoading(false));
  }, [user, userLoading]);

  if (userLoading || loading) {
    return <p className="text-center text-gray-500">Loading repositories…</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return ( 
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center">Repository Dashboard</h1>
      <div className="grid gap-6 max-w-5xl mx-auto">
        {repos.map((r) => (
          <RepositoryCard
            key={r.name}
            name={r.name}
            description={r.description}
            htmlUrl={r.html_url}
            language={r.language}
            stars={r.stargazers_count}
            lastCommit={r.updated_at}
            openIssues={r.open_issues_count}
            onClick={() =>
              navigate(`/maintainer/repo/${user.profile.username}/${r.name}/prs`)
            }
            
          />
        ))}
      </div>
    </div>
  );
}
