'use client'

interface Props {
  techStack: {
    languages: Record<string, number>
    frontend: string[]
    backend: string[]
    database: string[]
    infrastructure: string[]
  }
}

const sectionColors: Record<string, string> = {
  Languages: 'from-blue-500 to-cyan-500',
  Frontend: 'from-green-500 to-emerald-500',
  Backend: 'from-purple-500 to-violet-500',
  Database: 'from-orange-500 to-amber-500',
  Infrastructure: 'from-surface-500 to-surface-600',
}

const sectionIcons: Record<string, string> = {
  Languages: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  Frontend: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  Backend: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  Database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
  Infrastructure: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
}

export default function TechStack({ techStack }: Props) {
  const sections = [
    { title: 'Languages', items: Object.entries(techStack.languages).slice(0, 8).map(([k]) => k) },
    { title: 'Frontend', items: techStack.frontend },
    { title: 'Backend', items: techStack.backend },
    { title: 'Database', items: techStack.database },
    { title: 'Infrastructure', items: techStack.infrastructure },
  ].filter(s => s.items.length > 0)

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Tech Stack
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, i) => (
          <div key={section.title} className="card p-4 animate-fade-up hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${sectionColors[section.title] || 'from-primary-500 to-primary-600'}`} />
              <svg className={`w-4 h-4 ${section.title === 'Frontend' ? 'text-green-500' : section.title === 'Backend' ? 'text-purple-500' : section.title === 'Database' ? 'text-orange-500' : 'text-blue-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={sectionIcons[section.title] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
              </svg>
              <h4 className="text-sm font-medium text-surface-500 dark:text-surface-400">{section.title}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.items.length === 0 ? (
                <span className="text-xs text-surface-400 italic">None detected</span>
              ) : (
                section.items.map((item, j) => (
                  <span key={item} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all duration-200 cursor-default animate-scale-in" style={{ animationDelay: `${i * 80 + j * 30}ms` }}>
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
