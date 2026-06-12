'use client'

import { useState } from 'react'

interface Props {
  docs: { readme: string; api_documentation: string; developer_guide: string }
  repoName: string
}

export default function Documentation({ docs, repoName }: Props) {
  const [activeDoc, setActiveDoc] = useState<'readme' | 'api' | 'guide'>('readme')

  const tabs = [
    { key: 'readme' as const, label: 'README.md', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'api' as const, label: 'API', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z' },
    { key: 'guide' as const, label: 'Guide', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ]

  const content = { readme: docs.readme, api: docs.api_documentation, guide: docs.developer_guide }

  const download = () => {
    const blob = new Blob([content[activeDoc]], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeDoc === 'readme' ? 'README' : activeDoc === 'api' ? 'API' : 'GUIDE'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Documentation
        </h3>
        <button onClick={download} className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
      </div>

      <div className="flex gap-1 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveDoc(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              activeDoc === tab.key
                ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card p-5 max-h-[500px] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-surface-700 dark:text-surface-300">
          {content[activeDoc]}
        </pre>
      </div>
    </div>
  )
}
