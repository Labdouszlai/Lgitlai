'use client'

import { useState, useRef, useEffect } from 'react'
import { chatWithRepository } from '@/lib/api'

interface Props { repoUrl: string }
interface Message { role: 'user' | 'assistant'; content: string; sources?: string[] }

export default function Chat({ repoUrl }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Ask me anything about this repository — architecture, code patterns, dependencies, or how things work.` }
  ])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [beginnerMode, setBeginnerMode] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || loading) return
    const q = question.trim()
    setQuestion('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const res = await chatWithRepository(repoUrl, q, beginnerMode)
      setMessages(prev => [...prev, { role: 'assistant', content: res.answer, sources: res.sources }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Make sure the chat feature is configured (OpenAI key or local LLM).' }])
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat with Repo
        </h3>
        <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer hover:text-surface-600 dark:hover:text-surface-300 transition-colors group">
          <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            beginnerMode
              ? 'bg-primary-500 border-primary-500 shadow-sm shadow-primary-500/30'
              : 'border-surface-300 dark:border-surface-600 group-hover:border-primary-400'
          }`}>
            {beginnerMode && <svg className="w-2 h-2 text-white animate-scale-in" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" /></svg>}
          </div>
          <input type="checkbox" checked={beginnerMode} onChange={e => setBeginnerMode(e.target.checked)} className="hidden" />
          Simple mode
        </label>
      </div>

      <div className="card overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`} style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`max-w-[80%] rounded-2xl p-3.5 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/20 dark:border-surface-600">
                    <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1 font-medium">Sources</p>
                    {msg.sources.map((src, j) => (
                      <code key={j} className="text-[11px] block opacity-70 font-mono truncate hover:opacity-100 transition-opacity">{src}</code>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl p-3.5">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-surface-200 dark:border-surface-700 p-3 flex gap-2">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question about the repository..."
            className="flex-1 px-4 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !question.trim()}
            className="btn-primary px-4 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
