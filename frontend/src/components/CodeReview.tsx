'use client'

interface Props {
  items: Array<{
    type: string
    severity: string
    file: string
    line: number
    message: string
  }>
}

export default function CodeReview({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-surface-500">No code quality issues found</p>
      </div>
    )
  }

  const severityStyle = (s: string) => {
    switch (s) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
      default: return 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700'
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Code Review
        <span className="text-sm font-normal text-surface-400">({items.length} issues)</span>
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="card p-4 animate-fade-up" style={{ animationDelay: `${i * 30}ms` }}>
            <div className="flex items-start gap-3">
              <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${severityStyle(item.severity)}`}>
                {item.severity}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-surface-400">{item.file}:{item.line}</span>
                  <span className="text-[10px] uppercase tracking-wider text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">{item.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-sm text-surface-700 dark:text-surface-300">{item.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
