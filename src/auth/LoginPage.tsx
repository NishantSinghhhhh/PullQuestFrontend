// src/auth/LoginPage.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, Github, ArrowRight, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/UseLogin";
import { toast } from "sonner";
import { useUser } from "@/context/UserProvider";

export default function LoginPage() {
  const [role, setRole] = useState<
    "contributor" | "maintainer" | "company" | ""
  >("");
  const [githubUsername, setGithubUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call the hook
    const result = await login({
      role,
      email,
      password: role === "company" ? password : undefined,
      githubUsername:
        role === "contributor" || role === "maintainer"
          ? githubUsername
          : undefined,
    });

    if (result.success) {
      // hook already did navigate for you; nothing more to do
    } else {
      // error is already set inside the hook; you can also show extra feedback here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <span className="text-xl font-semibold text-gray-900">
              Pull Quest
            </span>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Coins className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-900 p-4 text-white" />
            <h1 className="text-4xl font-bold mb-4">Welcome back</h1>
          </div>

          <Card className="border shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Role */}
                <Label>Who are you?</Label>
                <Select
                  value={role}
                  onValueChange={(value: string) =>
                    setRole(
                      value as "contributor" | "maintainer" | "company" | ""
                    )
                  }
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contributor">Contributor</SelectItem>
                    <SelectItem value="maintainer">Maintainer</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>

                {/* GitHub Username */}
                {(role === "contributor" || role === "maintainer") && (
                  <div>
                    <Label>GitHub Username</Label>
                    <Input
                      type="text"
                      placeholder="octocat"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gray-900 text-white"
                  disabled={
                    isLoading ||
                    !role ||
                    !email ||
                    (role !== "company" && !githubUsername) ||
                    (role === "company" && !password)
                  }
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Sign in"}
                  {!isLoading && (
                    <ArrowRight className="ml-2 h-4 w-4 inline-block" />
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={() =>
                    (window.location.href = "http://localhost:8012/auth/github")
                  }
                  disabled={isLoading}
                >
                  <Github className="mr-2" /> Sign in with GitHub
                </Button>
              </form>

              <p className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-gray-900 underline"
                  onClick={() => navigate("/signUp")}
                >
                  Sign up for free
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
