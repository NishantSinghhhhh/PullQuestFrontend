"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, ExternalLink, FileText, Video, Code, Zap } from "lucide-react"

const docCategories = [
  {
    title: "Getting Started",
    icon: Zap,
    articles: [
      {
        title: "Quick Start Guide",
        description: "Get up and running with CodeRabbit in 5 minutes",
        type: "guide",
        readTime: "5 min",
      },
      {
        title: "Installation & Setup",
        description: "Step-by-step installation instructions",
        type: "tutorial",
        readTime: "10 min",
      },
      {
        title: "First Code Review",
        description: "Learn how to perform your first automated code review",
        type: "tutorial",
        readTime: "8 min",
      },
    ],
  },
  {
    title: "API Documentation",
    icon: Code,
    articles: [
      {
        title: "REST API Reference",
        description: "Complete API documentation with examples",
        type: "reference",
        readTime: "15 min",
      },
      {
        title: "Authentication",
        description: "How to authenticate with the CodeRabbit API",
        type: "guide",
        readTime: "7 min",
      },
      {
        title: "Webhooks",
        description: "Set up webhooks for real-time notifications",
        type: "tutorial",
        readTime: "12 min",
      },
    ],
  },
  {
    title: "Integrations",
    icon: FileText,
    articles: [
      {
        title: "GitHub Integration",
        description: "Connect CodeRabbit with your GitHub repositories",
        type: "tutorial",
        readTime: "6 min",
      },
      {
        title: "GitLab Setup",
        description: "Configure CodeRabbit for GitLab projects",
        type: "tutorial",
        readTime: "8 min",
      },
      {
        title: "Slack Notifications",
        description: "Get CodeRabbit updates in your Slack channels",
        type: "guide",
        readTime: "5 min",
      },
    ],
  },
  {
    title: "Advanced Features",
    icon: BookOpen,
    articles: [
      {
        title: "Custom Rules",
        description: "Create custom code review rules for your team",
        type: "guide",
        readTime: "20 min",
      },
      {
        title: "Team Management",
        description: "Manage team members and permissions",
        type: "tutorial",
        readTime: "10 min",
      },
      {
        title: "Analytics & Reports",
        description: "Understanding your code quality metrics",
        type: "guide",
        readTime: "15 min",
      },
    ],
  },
]

const popularArticles = [
  { title: "How to Set Up Your First Repository", views: "12.5k", type: "tutorial" },
  { title: "Understanding Code Quality Scores", views: "8.2k", type: "guide" },
  { title: "API Rate Limits and Best Practices", views: "6.1k", type: "reference" },
  { title: "Troubleshooting Common Issues", views: "5.8k", type: "guide" },
]

export function DocsView() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Documentation</h1>
              <p className="text-sm text-gray-600 mt-1">
                Learn how to use CodeRabbit effectively with our comprehensive guides and tutorials.
              </p>
            </div>
            <Button variant="outline" className="border-gray-300">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Help Center
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {docCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                            <p className="text-sm text-gray-600">{article.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {article.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{article.readTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Articles</CardTitle>
                  <CardDescription>Most viewed documentation this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {popularArticles.map((article, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">{article.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {article.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{article.views} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                      <Video className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Video Tutorials</p>
                        <p className="text-xs text-gray-600">Watch step-by-step guides</p>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                      <Code className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Code Examples</p>
                        <p className="text-xs text-gray-600">Ready-to-use code snippets</p>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                      <FileText className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Changelog</p>
                        <p className="text-xs text-gray-600">Latest updates and features</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
