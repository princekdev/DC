import { useId } from 'react'

export default function SearchBar({
  query,
  onQueryChange,
  simulateError,
  onSimulateErrorChange,
  onSubmit,
  isLoading,
}) {
  const inputId = useId()
  const checkboxId = useId()

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search" aria-label="Search public GitHub repositories">
      <div className="search-bar__row">
        <label htmlFor={inputId} className="search-bar__label">
          Repository name, topic, or keyword
        </label>
        <div className="search-bar__controls">
          <input
            id={inputId}
            type="text"
            className="search-bar__input"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="e.g. react, tensorflow, static-site-generator"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" className="button button--primary" disabled={isLoading}>
            {isLoading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </div>

      <div className="search-bar__row search-bar__row--test">
        <input
          id={checkboxId}
          type="checkbox"
          checked={simulateError}
          onChange={(e) => onSimulateErrorChange(e.target.checked)}
        />
        <label htmlFor={checkboxId}>
          Simulate API error <span className="search-bar__hint">(for testing the error state, no network call is made)</span>
        </label>
      </div>
    </form>
  )
}
