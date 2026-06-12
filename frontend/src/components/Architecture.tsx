'use client'

interface Props {
  architecture: {
    layers: Array<{ name: string; type: string }>
    data_flow: string[]
    stack_summary: Record<string, string>
    description: string
  }
}

export default function Architecture({ architecture }: Props) {
  if (architecture.layers.length === 0) {
    return <p className="text-surface-400 text-center py-8">No architecture detected.</p>
  }

  const typeStyles: Record<string, string> = {
    client: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    frontend: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    backend: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    database: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
        Architecture
      </h3>

      <div className="flex flex-col items-center gap-0 mb-6">
        {architecture.layers.map((layer, i) => (
          <div key={layer.name} className="flex flex-col items-center animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`px-5 py-2.5 rounded-xl text-sm font-medium border ${typeStyles[layer.type] || 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700'} shadow-sm`}>
              {layer.name}
            </div>
            {i < architecture.layers.length - 1 && (
              <div className="flex flex-col items-center py-1">
                <svg className="w-5 h-5 text-surface-300 dark:text-surface-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {architecture.description && (
        <div className="card p-4">
          <h4 className="text-xs font-medium uppercase tracking-wider text-surface-400 mb-2">How it works</h4>
          <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">{architecture.description}</p>
        </div>
      )}

      {architecture.data_flow.length > 0 && (
        <div className="mt-4 card p-4">
          <h4 className="text-xs font-medium uppercase tracking-wider text-surface-400 mb-2">Data Flow</h4>
          <div className="space-y-1.5">
            {architecture.data_flow.map((flow, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                {flow}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
