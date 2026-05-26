import { useState, useEffect } from 'react'
import { fetchEntries } from '../api'
import { CraftBadge, DepthBadge } from './CraftBadge'

const AREAS = [
  { value: '', label: 'All areas' },
  { value: 'character', label: 'Character' },
  { value: 'sensory', label: 'Sensory' },
  { value: 'dialogue', label: 'Dialogue' },
  { value: 'theme', label: 'Theme' },
]

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function HistoryView() {
  const [entries, setEntries] = useState([])
  const [area, setArea] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchEntries(area || undefined)
      .then(({ entries }) => setEntries(entries))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [area])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {AREAS.map((a) => (
          <button
            key={a.value}
            onClick={() => setArea(a.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              area === a.value
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Entries */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-serif text-lg text-stone-400">No entries yet.</p>
          <p className="mt-2 text-sm text-stone-400">Start writing and they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="card p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-stone-600">
                  {formatDate(entry.date)}
                </span>
                <div className="flex items-center gap-2">
                  <CraftBadge area={entry.craft_area} />
                  <DepthBadge depth={entry.prompt_depth} />
                  {entry.completed ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      ✓ Written
                    </span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">
                      Opened
                    </span>
                  )}
                </div>
              </div>

              <p className="line-clamp-2 font-serif text-sm leading-relaxed text-stone-700">
                {entry.prompt_text}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {entry.google_doc_url && (
                  <a
                    href={entry.google_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-stone-500 underline underline-offset-2 hover:text-stone-700"
                  >
                    Open doc ↗
                  </a>
                )}
                {entry.project_label && (
                  <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                    {entry.project_label}
                  </span>
                )}
                {entry.word_count && (
                  <span className="text-xs text-stone-400">{entry.word_count} words</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
