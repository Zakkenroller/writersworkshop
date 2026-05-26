import { useState, useEffect } from 'react'
import { fetchQuickPrompt } from '../api'
import { CraftBadge } from './CraftBadge'

export default function HardMorningMode({ onDismiss }) {
  const [prompt, setPrompt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuickPrompt()
      .then(({ prompt }) => setPrompt(prompt))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="card border-2 border-amber-200 bg-amber-50 p-6 sm:p-8">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-medium text-stone-900">
            Just start.
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            One line. Two minutes. That's the whole task.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 rounded-md p-1.5 text-stone-400 hover:bg-amber-100 hover:text-stone-600"
          aria-label="Dismiss hard-morning mode"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4L4 12M4 4l8 8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Quick prompt */}
      {loading ? (
        <div className="h-16 animate-pulse rounded-lg bg-amber-100" />
      ) : prompt ? (
        <div className="mb-4">
          <div className="mb-3">
            <CraftBadge area={prompt.craft_area} />
          </div>
          <p className="prompt-text text-base">{prompt.text}</p>
        </div>
      ) : null}

      {/* Permission to stop */}
      <p className="mt-4 rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-900">
        You have explicit permission to stop here. Getting started <em>is</em> the work today.
      </p>
    </div>
  )
}
