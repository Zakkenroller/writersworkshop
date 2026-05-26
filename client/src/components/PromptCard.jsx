import { CraftBadge, DepthBadge } from './CraftBadge'

export default function PromptCard({ prompt, muted = false }) {
  if (!prompt) return null

  return (
    <div className={`card p-6 sm:p-8 ${muted ? 'opacity-60' : ''}`}>
      {/* Header row */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <CraftBadge area={prompt.craft_area} size="lg" />
        <DepthBadge depth={prompt.depth} />
      </div>

      {/* Exercise text */}
      <p className="prompt-text mb-6">{prompt.text}</p>

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
