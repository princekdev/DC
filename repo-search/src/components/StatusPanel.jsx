/**
 * Renders exactly one of the three required non-idle states. The wrapping
 * element uses aria-live="polite" (see App.jsx) so screen reader users hear
 * the state change without focus being moved.
 */
export function LoadingState() {
  return (
    <div className="status-panel status-panel--loading" role="status">
      <span className="spinner" aria-hidden="true" />
      <div>
        <p className="status-panel__title">Searching GitHub…</p>
        <p className="status-panel__body">Fetching matching repositories. This usually takes a second.</p>
      </div>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="status-panel status-panel--error" role="alert">
      <span className="status-panel__icon" aria-hidden="true">
        ⚠
      </span>
      <div>
        <p className="status-panel__title">The search couldn't be completed</p>
        <p className="status-panel__body">{message}</p>
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  )
}

export function EmptyState({ query }) {
  return (
    <div className="status-panel status-panel--empty" role="status">
      <span className="status-panel__icon" aria-hidden="true">
        ○
      </span>
      <div>
        <p className="status-panel__title">No repositories found</p>
        <p className="status-panel__body">
          The search for <strong>"{query}"</strong> completed successfully, but GitHub returned zero matching
          repositories. Try a broader or differently spelled term.
        </p>
      </div>
    </div>
  )
}

export function IdleState() {
  return (
    <div className="status-panel status-panel--idle">
      <div>
        <p className="status-panel__title">Search public GitHub repositories</p>
        <p className="status-panel__body">
          Enter a name, topic, or keyword above and select Search to see matching repositories, sorted by stars.
        </p>
      </div>
    </div>
  )
}
