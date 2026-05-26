import { useState } from 'react'
import { CraftBadge, DepthBadge } from './CraftBadge'

export default function PromptCard({ prompt, muted = false }) {
  const [showContext, setShowContext] = useState(false)

  if (!prompt) return null

  return (
    <div className={`card p-6 sm:p-8 ${muted ? 'opacity-60' : ''}`}>
      {/* Header row */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CraftBadge area={prompt.craft_area} size="lg" />
          <DepthBadge depth={prompt.depth} />
        </div>

        {prompt.context && (
          <button
            onClick={() => setShowContext((v) => !v)}
            aria-label={showContext ? 'Hide craft note' : 'Show craft note'}
            aria-expanded={showContext}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              showContext
                ? 'border-stone-400 bg-stone-100 text-stone-700'
                : 'border-stone-200 bg-white text-stone-400 hover:border-stone-300 hover:text-stone-600'
            }`}
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M8 7v5M8 5v.5" strokeLinecap="round" />
            </svg>
            Craft note
          </button>
        )}
      </div>

      {/* Exercise text */}
      <p className="prompt-text mb-6">{prompt.text}</p>

      {/* Expandable craft context */}
      {showContext && prompt.context && (
        <div className="mb-5 rounded-xl border border-stone-100 bg-stone-50 px-5 py-4">
          <p className="text-sm leading-relaxed text-stone-600">{prompt.context}</p>
        </div>
      )}

      {/* Trains note */}
      <div className="border-t border-stone-100 pt-4">
        <p className="text-sm text-stone-500">
          <span className="font-medium text-stone-600">Trains: </span>
          {prompt.trains}
        </p>
        {prompt.lineage && (
          <p className="mt-1 text-xs text-stone-400 italic">↳ {prompt.lineage}</p>
        )}
      </div>
    </div>
  )
}
