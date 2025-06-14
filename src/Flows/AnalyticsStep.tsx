"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function AnalyticsStep() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-center">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">324</div>
            <div className="text-sm text-gray-600">Total Contributors</div>
          </CardContent>
        </Card>
        {/* Add more metric cards as needed */}
      </div>

      <Card className="border">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Detailed Charts</h3>
          <p className="text-gray-600">
            (Placeholder) Insert activity graphs, PR velocity charts, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
