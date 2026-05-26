import { useState } from 'react'
import { createOrUpdateEntry } from '../api'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function EntryCapture({ prompt, existingEntry, onSaved }) {
  const [docUrl, setDocUrl] = useState(existingEntry?.google_doc_url ?? '')
  const [projectLabel, setProjectLabel] = useState(existingEntry?.project_label ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { entry } = await createOrUpdateEntry({
        date: todayStr(),
        prompt_id: prompt.id,
        craft_area: prompt.craft_area,
        google_doc_url: docUrl.trim() || null,
        project_label: projectLabel.trim() || null,
        completed: !!docUrl.trim(),
      })
      onSaved(entry)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (saved && !existingEntry) {
    return (
      <div className="card border-green-200 bg-green-50 p-5 ring-green-100">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm font-medium text-green-800">Entry saved. Good work today.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
        Record your session
      </h3>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Doc URL */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700" htmlFor="doc-url">
            Google Doc link <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <input
            id="doc-url"
            type="url"
            className="input"
            placeholder="https://docs.google.com/document/d/..."
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-stone-400">
            Open Google Docs, write there, paste the link back here when you're done.
          </p>
        </div>

        {/* Project label */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700" htmlFor="project">
            Project / theme <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <input
            id="project"
            type="text"
            className="input"
            placeholder="e.g. Novel draft, Grief sequence…"
            value={projectLabel}
            onChange={(e) => setProjectLabel(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : existingEntry ? 'Update entry' : 'Save entry'}
          </button>
          {existingEntry?.google_doc_url && (
            <a
              href={existingEntry.google_doc_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Open doc ↗
            </a>
          )}
        </div>
      </form>
    </div>
  )
}
