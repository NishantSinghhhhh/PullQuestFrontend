"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold text-gray-900">Pull Quest</span>
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
              Maintainer
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </header>
  )
}
