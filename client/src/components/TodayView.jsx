import { useState } from 'react'
import PromptCard from './PromptCard'
import HardMorningMode from './HardMorningMode'
import EntryCapture from './EntryCapture'
import { fetchSwapPrompt } from '../api'

const SWAP_MODES = [
  { key: 'same', label: 'Same craft area' },
  { key: 'any', label: 'Anything' },
]

export default function TodayView({ prompt, entry, onEntryUpdate, onPromptSwap, loading }) {
  const [hardMorning, setHardMorning] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [swapMode, setSwapMode] = useState('same')
  const [showCapture, setShowCapture] = useState(!!entry)

  async function handleSwap() {
    if (!prompt) return
    setSwapping(true)
    try {
      const { prompt: next } = await fetchSwapPrompt(
        prompt.id,
        prompt.craft_area,
        swapMode === 'any' ? 'any' : undefined
      )
      if (next) onPromptSwap(next)
    } catch (err) {
      console.error(err)
    } finally {
      setSwapping(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-stone-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-stone-100" />
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
        <p className="font-serif text-lg text-stone-400">Couldn't load today's prompt.</p>
        <p className="mt-2 text-sm text-stone-400">Make sure the server is running.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-5">

      {/* Hard morning banner */}
      {hardMorning ? (
        <HardMorningMode onDismiss={() => setHardMorning(false)} />
      ) : (
        <button
          onClick={() => setHardMorning(true)}
          className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-left transition-colors hover:bg-amber-100"
        >
          <div>
            <span className="text-sm font-medium text-amber-900">Hard morning?</span>
            <span className="ml-2 text-sm text-amber-700">Get a gentler on-ramp →</span>
          </div>
          <svg
            className="h-4 w-4 text-amber-500"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Main prompt card */}
      <PromptCard prompt={prompt} />

      {/* Swap controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-stone-200 bg-white p-0.5">
          {SWAP_MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setSwapMode(m.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                swapMode === m.key
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSwap}
          disabled={swapping}
          className="btn-secondary text-sm"
        >
          <svg
            className={`h-3.5 w-3.5 ${swapping ? 'animate-spin' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M2 8a6 6 0 0112 0M14 8a6 6 0 01-12 0"
              strokeLinecap="round"
            />
            <path d="M2 8l2-2M2 8l2 2M14 8l-2-2M14 8l-2 2" strokeLinecap="round" />
          </svg>
          {swapping ? 'Finding one…' : 'Swap prompt'}
        </button>
      </div>

      {/* Entry capture */}
      {!showCapture && !entry ? (
        <div className="flex gap-3">
          <button
            onClick={() => setShowCapture(true)}
            className="btn-primary"
          >
            Start writing →
          </button>
        </div>
      ) : (
        <EntryCapture
          prompt={prompt}
          existingEntry={entry}
          onSaved={(saved) => {
            onEntryUpdate(saved)
            setShowCapture(true)
          }}
        />
      )}

      {/* Already-written banner */}
      {entry?.completed && !showCapture && (
        <div className="rounded-xl bg-green-50 px-5 py-4 ring-1 ring-green-100">
          <div className="flex items-center gap-3">
            <span className="text-green-600">✓</span>
            <div>
              <p className="text-sm font-medium text-green-800">You wrote today.</p>
              {entry.google_doc_url && (
                <a
                  href={entry.google_doc_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block text-xs text-green-700 underline underline-offset-2 hover:text-green-900"
                >
                  Reopen your doc ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
