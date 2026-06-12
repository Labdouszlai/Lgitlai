'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import AnalyzeForm from '@/components/AnalyzeForm'
import Results from '@/components/Results'
import type { AnalyzeResponse } from '@/lib/api'

const LOADING_STEPS = [
  { label: 'Cloning repository', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
  { label: 'Detecting tech stack', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { label: 'Analyzing structure', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
  { label: 'Reviewing code quality', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { label: 'Scanning security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { label: 'Generating reports', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
]

export default function Home() {
  const [results, setResults] = useState<AnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const { theme, toggle } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!loading) { setCurrentStep(0); return }
    const interval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [loading])

  const handleDemo = useCallback(() => {
    setError(null)
    setLoading(true)
    setResults(null)
    import('@/lib/api').then(({ analyzeRepository }) => {
      analyzeRepository('https://github.com/django/django')
        .then(data => { setResults(data); setLoading(false) })
        .catch(() => {
          setError('Demo requires the backend server to be running. Please paste a URL manually.')
          setLoading(false)
        })
    })
  }, [])

  const handleLoadDemoData = useCallback(() => {
    setError(null)
    setLoading(true)
    setResults(null)
    const demoData: AnalyzeResponse = {
      repo_name: 'demo/project',
      tech_stack: {
        languages: { TypeScript: 45, Python: 30, JavaScript: 15, HTML: 5, CSS: 5 },
        frontend: ['React', 'Next.js', 'TailwindCSS'],
        backend: ['FastAPI', 'Node.js'],
        database: ['PostgreSQL', 'Redis'],
        infrastructure: ['Docker', 'AWS'],
      },
      structure: [
        { name: 'src', explanation: 'Application source code', children: ['components/', 'pages/', 'lib/'] },
        { name: 'backend', explanation: 'API server code', children: ['api/', 'models/', 'tests/'] },
        { name: 'public', explanation: 'Static assets', children: ['images/', 'fonts/'] },
      ],
      architecture: {
        layers: [
          { name: 'Client Browser', type: 'client' },
          { name: 'Next.js App', type: 'frontend' },
          { name: 'FastAPI Server', type: 'backend' },
          { name: 'PostgreSQL', type: 'database' },
        ],
        data_flow: [
          'Browser sends HTTP request to Next.js app',
          'Next.js renders UI or proxies API calls to FastAPI',
          'FastAPI processes requests, queries PostgreSQL',
          'Response flows back through the stack to the browser',
        ],
        stack_summary: {},
        description: 'A modern full-stack application with a React frontend served by Next.js and a Python backend using FastAPI with PostgreSQL for data persistence.',
      },
      code_review: [
        { type: 'complex_function', severity: 'medium', file: 'src/api/handler.ts', line: 42, message: 'Function is 45 lines long; consider breaking into smaller functions for testability.' },
        { type: 'missing_docstring', severity: 'low', file: 'src/lib/utils.ts', line: 15, message: 'Public function missing type annotations and docstring.' },
      ],
      security: [
        { type: 'hardcoded_secret', severity: 'critical', file: 'backend/config.py', line: 8, message: 'Potential API key hardcoded in source.', recommendation: 'Move secrets to environment variables or a .env file.' },
      ],
      documentation: {
        readme: '# Demo Project\n\nA sample project to showcase LgitLai capabilities.\n\n## Installation\n\n```bash\nnpm install\nnpm run dev\n```',
        api_documentation: '# API Documentation\n\n## GET /api/health\n\nHealth check endpoint.',
        developer_guide: '# Developer Guide\n\n## Getting Started\n\nClone the repo and install dependencies.',
      },
      health_score: {
        overall: 72,
        architecture: 80,
        security: 65,
        maintainability: 70,
        documentation: 75,
        testing: 60,
        rating: 'Good',
      },
      improvements: [
        { category: 'testing', priority: 'high', suggestion: 'Increase test coverage', details: 'Current coverage is low. Aim for at least 80%.' },
        { category: 'security', priority: 'high', suggestion: 'Use environment variables for secrets', details: 'Hardcoded secrets found in config files.' },
        { category: 'performance', priority: 'medium', suggestion: 'Add caching layer', details: 'Consider Redis for API response caching.' },
      ],
      issues: [
        { number: 1, title: 'Fix hardcoded API keys', body: 'Move secrets from config.py to environment variables.', labels: ['security', 'high-priority'] },
        { number: 2, title: 'Improve test coverage', body: 'Add unit tests for API handlers and utility functions.', labels: ['enhancement'] },
      ],
    }
    setTimeout(() => { setResults(demoData); setLoading(false) }, 3000)
  }, [])

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-primary-500/5 to-transparent rounded-full animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-pink-500/5 to-transparent rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/3 to-transparent rounded-full animate-pulse-slow" />
      </div>

      <header className="sticky top-0 z-50 border-b border-surface-200/80 dark:border-surface-800/80 bg-white/70 dark:bg-surface-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 animate-bounce-gentle">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
            </div>
            <span className="text-lg font-bold gradient-text">LgitLai</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDemoData}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg btn-secondary"
              title="View sample analysis"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Demo
            </button>
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-all hover:scale-110 active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400 transition-transform duration-500 hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-surface-600 transition-transform duration-500 hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!results && !loading && (
          <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium mb-6 animate-fade-in">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75" />
                <span className="relative rounded-full bg-primary-500 w-2 h-2" />
              </span>
              Live & ready
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
              Understand any<br />
              <span className="gradient-text">GitHub repository</span>
              <br />in minutes
            </h1>
            <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed max-w-lg mx-auto">
              Paste a GitHub URL and get instant architecture insights, code quality reports,
              security analysis, documentation, and more.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-surface-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                No sign-up required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Free & open source
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Results in seconds
              </span>
            </div>
          </div>
        )}

        <div className={results ? 'animate-fade-up' : ''}>
          <AnalyzeForm
            onResults={setResults}
            onLoading={setLoading}
            onError={setError}
            hasResults={!!results}
            inputRef={inputRef}
          />
        </div>

        {loading && (
          <div className="mt-12 animate-fade-in">
            <div className="max-w-xl mx-auto space-y-5">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="relative">
                  <div className="w-14 h-14 border-4 border-primary-200/30 dark:border-primary-900/30 rounded-full" />
                  <div className="absolute inset-0 w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 w-14 h-14 border-4 border-pink-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-surface-700 dark:text-surface-300">Analyzing repository...</p>
                  <p className="text-sm text-surface-400">This usually takes 5&ndash;30 seconds depending on size</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {LOADING_STEPS.map((step, i) => {
                  const status = i < currentStep ? 'complete' : i === currentStep ? 'active' : 'pending'
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                        status === 'active'
                          ? 'bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800/50 shadow-sm'
                          : status === 'complete'
                          ? 'opacity-60'
                          : 'opacity-30'
                      }`}
                    >
                      <div className={`step-dot flex-shrink-0 ${
                        status === 'active' ? 'step-dot-active animate-pulse-soft' :
                        status === 'complete' ? 'step-dot-complete' : 'step-dot-pending'
                      }`} />
                      <svg className={`w-4 h-4 flex-shrink-0 ${
                        status === 'complete' ? 'text-success' :
                        status === 'active' ? 'text-primary-500' : 'text-surface-400'
                      }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                      </svg>
                      <span className={`text-sm font-medium ${
                        status === 'active' ? 'text-primary-700 dark:text-primary-300' :
                        status === 'complete' ? 'text-surface-500' : 'text-surface-400'
                      }`}>
                        {step.label}
                      </span>
                      {status === 'complete' && (
                        <svg className="w-4 h-4 ml-auto text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {status === 'active' && (
                        <div className="ml-auto flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '200ms' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-center">
                <div className="skeleton h-2 w-48 rounded-full" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 animate-scale-in">
            <div className="max-w-xl mx-auto bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex items-start gap-3 shadow-lg shadow-red-500/5">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-700 dark:text-red-400 text-sm">Analysis failed</p>
                <p className="text-red-600 dark:text-red-300 text-sm mt-0.5">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 hover:text-red-600 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {results && !loading && (
          <div className="mt-8 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-surface-900 dark:text-surface-50">{results.repo_name}</h2>
                  <p className="text-xs text-surface-400">Analysis results</p>
                </div>
              </div>
              <button
                onClick={() => { setResults(null); setError(null) }}
                className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Analysis
              </button>
            </div>
            <Results data={results} />
          </div>
        )}
      </div>

      <footer className="border-t border-surface-200 dark:border-surface-800 py-6 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-400">
          <span>Built by <a href="https://github.com/labdouszlai" className="text-primary-500 hover:text-primary-600 transition-colors">labdouszlai</a></span>
          <span>MIT License &mdash; Free and open source</span>
        </div>
      </footer>
    </div>
  )
}
