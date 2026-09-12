import { useCallback, useEffect, useRef, useState } from 'react'

// Wraps useState with localStorage persistence. Read/write failures
// (private browsing, quota exceeded, corrupted JSON) are caught and
// surfaced via `storageError` instead of crashing the app.
export function useLocalStorage(key, initialValue) {
  const [storageError, setStorageError] = useState(null)
  const isFirstRun = useRef(true)

  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return initialValue
      return JSON.parse(raw)
    } catch (err) {
      console.error('Failed to read from localStorage:', err)
      setStorageError('Could not load saved data. Starting with an empty tracker.')
      return initialValue
    }
  })

  useEffect(() => {
    // Skip the very first render's write; we just read this value.
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      setStorageError(null)
    } catch (err) {
      console.error('Failed to write to localStorage:', err)
      setStorageError('Could not save your changes. Your browser storage may be full or disabled.')
    }
  }, [key, value])

  const clearError = useCallback(() => setStorageError(null), [])

  return [value, setValue, storageError, clearError]
}
