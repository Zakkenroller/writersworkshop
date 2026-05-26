import { useState, useEffect } from 'react'
import TodayView from './components/TodayView'
import HistoryView from './components/HistoryView'
import { fetchTodayPrompt, fetchTodayEntry } from './api'

function formatHeading() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function App() {
  const [view, setView] = useState('today')
  const [prompt, setPrompt] = useState(null)
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([fetchTodayPrompt(), fetchTodayEntry()])
      .then(([{ prompt }, { entry }]) => {
        setPrompt(prompt)
        setEntry(entry)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-parchment/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Wordmark */}
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif text-xl font-medium tracking-tight text-stone-900">
              Longhand
            </span>
            {view === 'today' && (
              <span className="hidden text-sm text-stone-400 sm:block">{formatHeading()}</span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setView('today')}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                view === 'today'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setView('history')}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                view === 'history'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
              }`}
            >
              History
            </button>
          </nav>
        </div>

        {/* Mobile date line */}
        {view === 'today' && (
          <div className="border-t border-stone-100 px-4 py-2 sm:hidden">
            <p className="text-xs text-stone-400">{formatHeading()}</p>
          </div>
        )}
      </header>

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-6">
          <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700 ring-1 ring-red-200">
            <strong>Couldn't reach the server.</strong> {error}
          </div>
        </div>
      )}

      {/* Main */}
      <main>
        {view === 'today' ? (
          <TodayView
            prompt={prompt}
            entry={entry}
            onEntryUpdate={setEntry}
            onPromptSwap={setPrompt}
            loading={loading}
          />
        ) : (
          <HistoryView />
        )}
      </main>
    </div>
  )
}
