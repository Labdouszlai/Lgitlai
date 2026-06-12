'use client'

interface Props {
  items: Array<{
    name: string
    explanation: string
    children: string[]
  }>
}

export default function Structure({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-surface-400 animate-fade-in">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <p>No directory structure detected.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        Repository Structure
        <span className="text-sm font-normal text-surface-400">({items.length} directories)</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((dir, i) => (
          <div key={dir.name} className="card p-4 animate-fade-up hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <code className="font-semibold text-primary-600 dark:text-primary-400 text-sm">{dir.name}/</code>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{dir.explanation}</p>
                {dir.children.length > 0 && (
                  <details className="mt-2 group">
                    <summary className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer transition-colors inline-flex items-center gap-1">
                      <svg className="w-3 h-3 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {dir.children.length} {dir.children.length === 1 ? 'item' : 'items'}
                    </summary>
                    <div className="mt-2 grid grid-cols-2 gap-1 bg-surface-50 dark:bg-surface-950/50 rounded-lg p-2">
                      {dir.children.map(child => (
                        <span key={child} className="text-xs font-mono text-surface-500 dark:text-surface-400 truncate hover:text-surface-700 dark:hover:text-surface-200 transition-colors">
                          {child.endsWith('/') ? (
                            <span className="text-yellow-600 dark:text-yellow-400">{child}</span>
                          ) : (
                            child
                          )}
                        </span>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
