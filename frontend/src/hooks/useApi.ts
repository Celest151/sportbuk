import { useEffect, useState } from 'react'
import { apiRequest } from '../lib/api'

export function useApi<T>(path: string | null, token?: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(Boolean(path))
  const [resolvedPath, setResolvedPath] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    setLoading(true)
    setError('')
    apiRequest<{ data: T }>(path, { signal: controller.signal }, token)
      .then((response) => {
        setData(response.data)
        setResolvedPath(path)
      })
      .catch((reason: Error) => {
        if (reason.name !== 'AbortError') setError(reason.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [path, token])

  return { data, loading: Boolean(path) && (loading || resolvedPath !== path), error }
}
