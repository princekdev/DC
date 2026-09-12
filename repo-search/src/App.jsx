import { useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import RepoList from './components/RepoList.jsx'
import { LoadingState, ErrorState, EmptyState, IdleState } from './components/StatusPanel.jsx'
import { useRepoSearch } from './hooks/useRepoSearch.js'
import './App.css'

export default function App() {
  const [query, setQuery] = useState('')
  const [simulateError, setSimulateError] = useState(false)
  const { status, results, errorMessage, lastQuery, search } = useRepoSearch()

  function runSearch() {
    search(query, { simulateError })
  }

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">GitHub REST API</p>
        <h1 className="page__title">Public Repository Search</h1>
        <p className="page__intro">
          Look up public repositories on GitHub by name, topic, or keyword, and compare them by stars and primary
          language.
        </p>
      </header>

      <main className="page__main">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          simulateError={simulateError}
          onSimulateErrorChange={setSimulateError}
          onSubmit={runSearch}
          isLoading={status === 'loading'}
        />

        <div aria-live="polite" className="page__results">
          {status === 'idle' && <IdleState />}
          {status === 'loading' && <LoadingState />}
          {status === 'error' && <ErrorState message={errorMessage} onRetry={runSearch} />}
          {status === 'empty' && <EmptyState query={lastQuery} />}
          {status === 'success' && <RepoList repos={results} query={lastQuery} />}
        </div>
      </main>

      <footer className="page__footer">
        <p>Data from the public, unauthenticated GitHub Search API. No backend or API key required.</p>
      </footer>
    </div>
  )
}
