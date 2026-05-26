const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const fetchTodayPrompt = () => request('/prompts/today')
export const fetchQuickPrompt = () => request('/prompts/quick')
export const fetchSwapPrompt = (exclude, area, mode) => {
  const params = new URLSearchParams({ exclude, area: area ?? '', mode: mode ?? 'same' })
  return request(`/prompts/swap?${params}`)
}

export const fetchTodayEntry = () => request('/entries/today')
export const fetchEntries = (area) => {
  const params = area ? `?area=${area}` : ''
  return request(`/entries${params}`)
}

export const createOrUpdateEntry = (body) =>
  request('/entries', { method: 'POST', body: JSON.stringify(body) })

export const patchEntry = (id, body) =>
  request(`/entries/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
