"use client";

import { useState, useEffect } from "react";
import RepositoryCard from "@/components/RepositoryCard";
import { useUser } from "../context/UserProvider";
import axios from "axios";

interface Repo {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  updated_at: string;
  open_issues_count: number;
}

// Your local User type includes `profile`
export interface User {
  id: string;
  name: string;
  email: string;
  profile?: {
    username: string;
  };
}

export default function RepoStep() {
  // Grab whatever the context gives you…
  const { user: rawUser, isLoading: userLoading } = useUser();
  const user = rawUser as User | null; // …then cast it to your local `User`

  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLoading) return;

    setLoading(true);
    const githubUsername = user?.profile?.username || "";
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:8012"}/api/maintainer/repos-by-username?githubUsername=${githubUsername}&per_page=30&page=1`;
    const jwtToken = localStorage.getItem("token");

    const config = {
      withCredentials: true,
      headers: {
        Authorization: jwtToken ? `Bearer ${jwtToken}` : undefined,
      },
    };

    axios
      .get<{ success: boolean; data: Repo[] }>(url, config)
      .then((res) => {
        console.log("Fetched repositories from backend:", res.data);
        if (res.data.success) {
          setRepos(res.data.data);
        } else {
          setError("Failed to load repositories");
        }
      })
      .catch((err) => {
        console.error("Error fetching repositories:", err);
        setError(err.response?.data?.message || err.message || "Unknown error");
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
            // onClickIssues={() => handleRepoClick(r, "issues")}
            // onClickPRs={() => handleRepoClick(r, "prs")}
          />
        ))}
      </div>
    </div>
  );
}
