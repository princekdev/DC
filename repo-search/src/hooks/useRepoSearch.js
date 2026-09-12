import { useCallback, useRef, useState } from 'react'

const API_URL = 'https://api.github.com/search/repositories'

/**
 * Encapsulates search state + the GitHub REST API call.
 *
 * status is one of: 'idle' | 'loading' | 'success' | 'empty' | 'error'
 * - 'idle'    -> no search has been run yet
 * - 'loading' -> request in flight
 * - 'success' -> request succeeded, results.length > 0
 * - 'empty'   -> request succeeded, results.length === 0
 * - 'error'   -> request failed (network error, bad response, or simulated)
 */
export function useRepoSearch() {
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [lastQuery, setLastQuery] = useState('')

  // Guards against a slow, stale request overwriting a newer one.
  const requestIdRef = useRef(0)

  const search = useCallback(async (rawQuery, { simulateError = false } = {}) => {
    const query = rawQuery.trim()
    if (!query) {
      setStatus('error')
      setErrorMessage('Enter a search term before searching. Try a project name, topic, or keyword.')
      return
    }

    const requestId = ++requestIdRef.current
    setStatus('loading')
    setErrorMessage('')
    setLastQuery(query)

    try {
      if (simulateError) {
        // Deliberate, documented failure path for demoing the error state.
        // No network call is made; this mirrors what a real outage or rate
        // limit would look like from the UI's point of view.
        await new Promise((resolve) => setTimeout(resolve, 600))
        throw new Error(
          'Simulated failure: this request was intentionally blocked because "Simulate API error" is turned on.'
        )
      }

      const url = `${API_URL}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`
      const response = await fetch(url, {
        headers: { Accept: 'application/vnd.github+json' },
      })

      if (requestId !== requestIdRef.current) return // a newer search superseded this one

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            'GitHub API rate limit reached (unauthenticated requests are limited to 10 per minute). Wait a minute and try again.'
          )
        }
        if (response.status >= 500) {
          throw new Error('GitHub is temporarily unavailable (server error). Please try again shortly.')
        }
        throw new Error(`GitHub API request failed with status ${response.status}. Please try again.`)
      }

      const data = await response.json()
      const items = Array.isArray(data.items) ? data.items : []

      if (requestId !== requestIdRef.current) return

      setResults(items)
      setStatus(items.length === 0 ? 'empty' : 'success')
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      setResults([])
      setStatus('error')
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong reaching the GitHub API. Check your connection and try again.'
      )
    }
  }, [])

  return { status, results, errorMessage, lastQuery, search }
}
