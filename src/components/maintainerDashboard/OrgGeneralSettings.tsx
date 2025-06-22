// src/components/OrgGeneralSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Org {
  login: string;
  id: number;
  url: string;
  avatar_url: string;
}

export function OrgGeneralSettings() {
  const { user } = useUser();
  const contextUsername = user?.githubUsername ?? "";
  const token = user?.accessToken;

  // allow override if needed:
  const [githubUsername, setGithubUsername] = useState(contextUsername);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [orgsError, setOrgsError] = useState<string | null>(null);

  // keep input in sync if context changes
  useEffect(() => {
    if (contextUsername) {
      setGithubUsername(contextUsername);
    }
  }, [contextUsername]);

  const fetchOrgs = async () => {
    if (!githubUsername) {
      setOrgsError("Please enter a GitHub username");
      return;
    }
    if (!token) {
      setOrgsError("No auth token available – please log in again");
      return;
    }

    setLoadingOrgs(true);
    setOrgsError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8012"}` +
          `/api/maintainer/orgs-by-username?githubUsername=${encodeURIComponent(
            githubUsername
          )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const body = await res.json();
      console.log("📥 Raw response:", body);
      console.log("📥 Orgs array:", body.data);

      if (res.ok && body.success) {
        setOrgs(body.data);
      } else {
        throw new Error(body.message || "Failed to fetch orgs");
      }
    } catch (err: any) {
      setOrgsError(err.message);
    } finally {
      setLoadingOrgs(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* GitHub → Orgs lookup */}
      <Card>
        <CardHeader>
          <CardTitle>Fetch Your GitHub Organizations</CardTitle>
          <CardDescription>
            We’ll use your GitHub username (from your profile) and your auth
            token to look up all the orgs you belong to.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="github-username">GitHub Username</Label>
              <Input
                id="github-username"
                placeholder="octocat"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
              />
            </div>
            <Button onClick={fetchOrgs} disabled={loadingOrgs}>
              {loadingOrgs ? "Loading..." : "Fetch Orgs"}
            </Button>
          </div>
          {orgsError && <p className="text-sm text-red-600">{orgsError}</p>}
          {orgs.length > 0 && (
            <ul className="space-y-2">
              {orgs.map((o) => (
                <li key={o.id} className="flex items-center space-x-2">
                  <img
                    src={o.avatar_url}
                    alt={`${o.login} avatar`}
                    className="w-6 h-6 rounded-full"
                  />
                  <a
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {o.login}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Configure your organization's default settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-review new repositories</Label>
              <p className="text-sm text-gray-600">
                Automatically enable CodeRabbit for new repositories
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Email notifications</Label>
              <p className="text-sm text-gray-600">
                Receive email updates about code reviews
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly reports</Label>
              <p className="text-sm text-gray-600">
                Get weekly summary reports via email
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
