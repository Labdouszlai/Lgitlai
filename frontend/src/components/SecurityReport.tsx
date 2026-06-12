'use client'

interface Props {
  items: Array<{
    type: string
    severity: string
    file: string
    line: number
    message: string
    recommendation?: string
  }>
}

export default function SecurityReport({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-surface-500">No security issues detected</p>
      </div>
    )
  }

  const severityStyle = (s: string) => {
    switch (s) {
      case 'critical': return 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900'
      case 'high': return 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900'
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-900'
      default: return 'bg-surface-50 dark:bg-surface-900 border-surface-200 dark:border-surface-700'
    }
  }

  const badgeStyle = (s: string) => {
    switch (s) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-surface-400'
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Security Analysis
        <span className="text-sm font-normal text-surface-400">({items.length} issues)</span>
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className={`border rounded-xl p-4 animate-fade-up ${severityStyle(item.severity)}`} style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${badgeStyle(item.severity)}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    item.severity === 'critical' ? 'text-red-600 dark:text-red-400' :
                    item.severity === 'high' ? 'text-orange-600 dark:text-orange-400' :
                    item.severity === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-surface-500'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="text-xs font-mono text-surface-400">{item.file}:{item.line}</span>
                  <span className="text-[10px] uppercase tracking-wider text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">{item.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{item.message}</p>
                {item.recommendation && (
                  <p className="text-xs mt-1.5 text-surface-500 dark:text-surface-400 flex items-start gap-1.5">
                    <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.recommendation}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
