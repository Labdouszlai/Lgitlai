'use client'

import { useState } from 'react'
import type { AnalyzeResponse } from '@/lib/api'
import TechStack from './TechStack'
import Structure from './Structure'
import Architecture from './Architecture'
import CodeReview from './CodeReview'
import SecurityReport from './SecurityReport'
import Documentation from './Documentation'
import HealthScore from './HealthScore'
import Improvements from './Improvements'
import Issues from './Issues'
import Chat from './Chat'

interface Props {
  data: AnalyzeResponse
}

type Tab = 'overview' | 'structure' | 'code-review' | 'security' | 'docs' | 'improvements' | 'issues' | 'chat'

export default function Results({ data }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { key: 'structure', label: 'Structure', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { key: 'code-review', label: 'Code Review', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', count: data.code_review.length },
    { key: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', count: data.security.length },
    { key: 'docs', label: 'Docs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'improvements', label: 'Improve', icon: 'M13 10V3L4 14h7v7l9-11h-7z', count: data.improvements.length },
    { key: 'issues', label: 'Issues', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', count: data.issues.length },
    { key: 'chat', label: 'Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ]

  return (
    <div className="space-y-6">
      <HealthScore score={data.health_score} />

      <div className="relative">
        <nav className="flex gap-1 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.key
                  ? 'tab-active shadow-lg'
                  : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div key={activeTab} className="card p-6 animate-fade-in">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-up">
            <TechStack techStack={data.tech_stack} />
            <Architecture architecture={data.architecture} />
          </div>
        )}
        {activeTab === 'structure' && <Structure items={data.structure} />}
        {activeTab === 'code-review' && <CodeReview items={data.code_review} />}
        {activeTab === 'security' && <SecurityReport items={data.security} />}
        {activeTab === 'docs' && <Documentation docs={data.documentation} repoName={data.repo_name} />}
        {activeTab === 'improvements' && <Improvements items={data.improvements} />}
        {activeTab === 'issues' && <Issues items={data.issues} />}
        {activeTab === 'chat' && <Chat repoUrl={`https://github.com/${data.repo_name}`} />}
      </div>
    </div>
  )
}
