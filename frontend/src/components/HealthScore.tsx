'use client'

import { useEffect, useState } from 'react'

interface Props {
  score: {
    overall: number
    architecture: number
    security: number
    maintainability: number
    documentation: number
    testing: number
    rating: string
  }
}

function AnimatedValue({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (value === 0) { setDisplay(0); return }
    const duration = 1000
    const steps = 30
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.round(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])
  return <span className={className}>{display}</span>
}

export default function HealthScore({ score }: Props) {
  const ratingColors: Record<string, string> = {
    Excellent: 'from-green-500 to-emerald-500',
    Good: 'from-blue-500 to-cyan-500',
    Fair: 'from-yellow-500 to-orange-500',
    'Needs Improvement': 'from-red-500 to-pink-500',
  }

  const categoryColor = (v: number) => {
    if (v >= 80) return 'text-green-600 dark:text-green-400'
    if (v >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const barColor = (v: number) => {
    if (v >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500'
    if (v >= 60) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
    return 'bg-gradient-to-r from-red-500 to-pink-500'
  }

  const categories = [
    { label: 'Architecture', value: score.architecture },
    { label: 'Security', value: score.security },
    { label: 'Maintainability', value: score.maintainability },
    { label: 'Documentation', value: score.documentation },
    { label: 'Testing', value: score.testing },
  ]

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score.overall / 100) * circumference

  return (
    <div className="card p-6 bg-gradient-to-br from-surface-50/80 to-white dark:from-surface-900/80 dark:to-surface-950 border border-surface-200 dark:border-surface-800">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-200 dark:text-surface-800" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`${barColor(score.overall)} transition-all duration-1000 ease-out`}
              style={{ filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.3))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatedValue value={score.overall} className={`text-3xl font-bold ${categoryColor(score.overall)} animate-count-up`} />
            <span className="text-xs text-surface-400">/ 100</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4">
            <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-25" />
            <span className="relative block w-2 h-2 rounded-full bg-primary-500 mx-auto mt-1" />
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold flex items-center gap-2 justify-center sm:justify-start">
              Repository Health
            </h3>
            <span className={`inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${ratingColors[score.rating] || 'from-surface-500 to-surface-600'} text-white shadow-sm`}>
              {score.rating}
            </span>
          </div>
          <div className="mt-4 space-y-2.5">
            {categories.map((cat, i) => (
              <div key={cat.label} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-surface-500 dark:text-surface-400">{cat.label}</span>
                  <span className={`font-semibold ${categoryColor(cat.value)}`}>
                    <AnimatedValue value={cat.value} />
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor(cat.value)}`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
