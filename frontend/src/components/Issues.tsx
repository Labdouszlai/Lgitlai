'use client'

interface Props {
  items: Array<{ number: number; title: string; body: string; labels: string[] }>
}

const labelColors: Record<string, string> = {
  security: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  'high-priority': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  'code-quality': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  enhancement: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
}

export default function Issues({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-surface-400">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>No issues generated.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Generated Issues
      </h3>
      <div className="space-y-3">
        {items.map(issue => (
          <div key={issue.number} className="card p-4 animate-fade-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xs font-bold flex-shrink-0">
                #{issue.number}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-surface-800 dark:text-surface-200 mb-1.5">{issue.title}</h4>
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  {issue.labels.map(label => (
                    <span key={label} className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${labelColors[label] || 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}>
                      {label}
                    </span>
                  ))}
                </div>
                <pre className="text-xs text-surface-500 dark:text-surface-400 whitespace-pre-wrap font-sans leading-relaxed">
                  {issue.body}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
