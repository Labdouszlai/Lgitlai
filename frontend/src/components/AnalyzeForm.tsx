'use client'

import { useState, RefObject } from 'react'
import { analyzeRepository, type AnalyzeResponse } from '@/lib/api'

const EXAMPLES = [
  'https://github.com/facebook/react',
  'https://github.com/django/django',
  'https://github.com/vercel/next.js',
  'https://github.com/tailwindlabs/tailwindcss',
  'https://github.com/vuejs/core',
  'https://github.com/expressjs/express',
]

interface Props {
  onResults: (data: AnalyzeResponse) => void
  onLoading: (loading: boolean) => void
  onError: (error: string | null) => void
  hasResults: boolean
  inputRef?: RefObject<HTMLInputElement>
}

export default function AnalyzeForm({ onResults, onLoading, onError, hasResults, inputRef }: Props) {
  const [url, setUrl] = useState('')
  const [beginnerMode, setBeginnerMode] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [valid, setValid] = useState(true)

  const validateUrl = (value: string) => {
    if (!value) { setValid(true); return }
    setValid(/^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(value.trim()))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    if (!/^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(url.trim())) {
      setValid(false)
      return
    }
    onLoading(true)
    onError(null)
    setValid(true)
    try {
      const data = await analyzeRepository(url.trim(), beginnerMode)
      onResults(data)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${hasResults ? 'max-w-2xl' : 'max-w-3xl'} mx-auto transition-all duration-500`}>
      <div className="relative">
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-xl duration-500" />
            <div className="relative flex items-center">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); validateUrl(e.target.value) }}
                onFocus={() => setShowExamples(true)}
                onBlur={() => setTimeout(() => setShowExamples(false), 200)}
                placeholder="https://github.com/owner/repository"
                className={`w-full pl-12 pr-12 py-3.5 bg-white dark:bg-surface-900 border-2 rounded-xl text-surface-900 dark:text-surface-50 placeholder-surface-400 outline-none transition-all ${
                  valid
                    ? 'border-surface-200 dark:border-surface-700 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                    : 'border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                }`}
                required
              />
              {url && (
                <button type="button" onClick={() => { setUrl(''); setValid(true) }} className="absolute right-3 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {!valid && (
              <p className="text-xs text-red-500 mt-1.5 ml-1 flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)
              </p>
            )}

            {showExamples && !url && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl shadow-2xl p-2 z-10 animate-scale-in">
                <p className="px-3 py-1.5 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Try an example</p>
                {EXAMPLES.map(ex => (
                  <button
                    key={ex}
                    type="button"
                    onMouseDown={() => { setUrl(ex); setValid(true) }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors font-mono hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary px-6 py-3.5 rounded-xl whitespace-nowrap text-sm flex items-center gap-2 shadow-lg shadow-primary-500/10"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Analyze
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <label className="flex items-center gap-2.5 text-sm text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer transition-colors group">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            beginnerMode
              ? 'bg-primary-500 border-primary-500 shadow-sm shadow-primary-500/30'
              : 'border-surface-300 dark:border-surface-600 group-hover:border-primary-400'
          }`}>
            {beginnerMode && (
              <svg className="w-2.5 h-2.5 text-white animate-scale-in" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
              </svg>
            )}
          </div>
          <input type="checkbox" checked={beginnerMode} onChange={(e) => setBeginnerMode(e.target.checked)} className="hidden" />
          Beginner Mode
          <svg className="w-3.5 h-3.5 text-surface-300 dark:text-surface-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </label>

        <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-surface-300 dark:text-surface-600">
          <kbd className="px-1.5 py-0.5 rounded border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 font-mono text-[10px]">/</kbd>
          to focus
        </span>
      </div>
    </form>
  )
}
