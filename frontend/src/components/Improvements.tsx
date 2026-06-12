'use client'

interface Props {
  items: Array<{ category: string; priority: string; suggestion: string; details: string }>
}

export default function Improvements({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-surface-400 animate-fade-in">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p>No improvement suggestions.</p>
      </div>
    )
  }

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    low: 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700',
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Improvement Suggestions
        <span className="text-sm font-normal text-surface-400">({items.length})</span>
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="card p-4 animate-fade-up hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${priorityColors[item.priority] || ''}`}>
                    {item.priority}
                  </span>
                  <span className="text-xs text-surface-400 capitalize font-medium">{item.category}</span>
                </div>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{item.suggestion}</p>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5 leading-relaxed">{item.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
