const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || 'http://127.0.0.1:5000').replace(/\/$/, '')

interface ApiErrorBody {
  message?: string
  errors?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  fields?: Record<string, string>

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string | null) {
  const headers = new Headers(options.headers)
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_ORIGIN}/api/v1${path}`, { ...options, headers })
  const body = (await response.json().catch(() => ({}))) as T & ApiErrorBody
  if (!response.ok) throw new ApiError(body.message || 'Request failed. Please try again.', response.status, body.errors)
  return body as T
}

export function resolveImageUrl(value: string | null | undefined, seed = 'football-kit') {
  if (!value) return `https://picsum.photos/seed/${seed}/900/900`
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('/uploads/')) return `${API_ORIGIN}${value}`
  const localPath = value.startsWith('/frontend/assets/') ? value.replace('/frontend', '') : value
  // Existing demo records and saved bags retain their original illustration URLs.
  if (/^\/assets\/images\/football\/product-(match-jersey|training-top|shorts|socks|goalkeeper-jersey|goalkeeper-gloves|shin-guards|match-ball)\.svg$/.test(localPath)) {
    return localPath.replace(/\.svg$/, '.png')
  }
  if (localPath !== value) return localPath
  return value
}

export function fallbackImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/900/900`
}
