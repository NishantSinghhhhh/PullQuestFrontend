"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Settings } from "lucide-react"
import RepoStep from "./RepoStep"
import ReviewPrStep from "./RepoIssuesStep"
import AnalyticsStep from "./AnalyticsStep"

const TOTAL_STEPS = 3
const STEP_NAMES = [
  "Manage Repositories",
  "Review Pull Requests", 
  "Analytics Dashboard",
]

export default function MaintainerFlow() {
  const [step, setStep] = useState(0)
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)

  /* ---------- Navigation helpers ---------- */
  const next = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1))
  const prev = () => setStep((s) => Math.max(0, s - 1))
  const canNext = step < TOTAL_STEPS - 1
  const canPrev = step > 0

  /* ---------- Render current step ---------- */
  let content
  switch (step) {
    case 0:
      content = <RepoStep />
      break
    case 1:
      content = <ReviewPrStep />
      break
    case 2:
      content = <AnalyticsStep />
      break
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* top bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold">Pull Quest</span>
            <Badge variant="secondary" className="text-xs">Maintainer</Badge>
          </div>
          <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-1" />Settings</Button>
        </div>
      </nav>

      {/* progress */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex space-x-2 overflow-x-auto">
          {STEP_NAMES.map((name, i) => (
            <div key={i} className="flex items-center space-x-2 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= i ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-400"}`}>
                {i + 1}
              </div>
              <span className={`text-sm ${step >= i ? "text-gray-900" : "text-gray-400"}`}>{name}</span>
              {i < STEP_NAMES.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* page */}
      <main className="flex-1 max-w-7xl mx-auto p-8 space-y-8">
        {content}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={prev} disabled={!canPrev}>Previous</Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Step {step + 1}/{TOTAL_STEPS}</span>
            <Button onClick={next} disabled={!canNext}>Next</Button>
          </div>
        </div>
      </main>
    </div>
  )
}