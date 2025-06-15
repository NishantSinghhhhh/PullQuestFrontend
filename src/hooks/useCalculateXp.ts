import { useCallback } from "react"

type FeedbackData = {
  ratings: Record<string, number>
  bonuses: Record<string, boolean>
  prComplexityWeight?: number // e.g., 1.0 (default), 1.5, 2.0
}

type XPResult = {
  baseScore: number
  bonusScore: number
  totalXP: number
  maintainerScore: number
  level: string
}

export function useCalculateXp() {
  const calculateXp = useCallback((feedback: FeedbackData): XPResult => {
    const baseScore = Object.values(feedback.ratings).reduce((sum, val) => sum + val, 0)

    const bonusPoints: Record<string, number> = {
      "Issue was bounty-backed": 10,
      "PR merged within 24–48 hrs": 5,
      "Contributor also reviewed other PRs": 5,
      "Contributor added meaningful tests": 10,
    }

    const bonusScore = Object.entries(feedback.bonuses).reduce((sum, [key, active]) => {
      return active ? sum + (bonusPoints[key] || 0) : sum
    }, 0)

    const prWeight = feedback.prComplexityWeight ?? 1
    const maintainerScore = baseScore * prWeight

    const totalXP = maintainerScore + bonusScore
    const level =
      totalXP >= 30 ? "Elite" : totalXP >= 20 ? "Pro" : totalXP >= 10 ? "Contributor" : "Beginner"

    return {
      baseScore,
      bonusScore,
      totalXP,
      maintainerScore,
      level,
    }
  }, [])

  return { calculateXp }
}
