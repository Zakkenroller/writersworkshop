const AREA_STYLES = {
  character: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    label: 'Character',
  },
  sensory: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    dot: 'bg-teal-500',
    label: 'Sensory',
  },
  dialogue: {
    bg: 'bg-violet-100',
    text: 'text-violet-800',
    dot: 'bg-violet-500',
    label: 'Dialogue',
  },
  theme: {
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    dot: 'bg-rose-500',
    label: 'Theme & Structure',
  },
}

const DEPTH_STYLES = {
  quick: { bg: 'bg-green-100', text: 'text-green-800', label: 'Quick' },
  focused: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Focused' },
  deep: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Deep' },
}

export function CraftBadge({ area, size = 'sm' }) {
  const s = AREA_STYLES[area] ?? AREA_STYLES.character
  const base = size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-0.5'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${base} ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export function DepthBadge({ depth }) {
  const s = DEPTH_STYLES[depth] ?? DEPTH_STYLES.focused
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
      title={`Depth: ${s.label}`}
    >
      {s.label}
    </span>
  )
}
