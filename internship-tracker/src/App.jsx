import { useMemo, useState } from 'react'
import Dashboard from './components/Dashboard'
import OpportunityForm from './components/OpportunityForm'
import FilterBar from './components/FilterBar'
import OpportunityList from './components/OpportunityList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { STORAGE_KEY } from './utils/constants'

function createId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function App() {
  const [opportunities, setOpportunities, storageError, clearStorageError] = useLocalStorage(STORAGE_KEY, [])
  const [editingItem, setEditingItem] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [statusMessage, setStatusMessage] = useState('')

  function announce(message) {
    setStatusMessage(message)
    window.clearTimeout(announce._t)
    announce._t = window.setTimeout(() => setStatusMessage(''), 4000)
  }

  function handleSave(values) {
    if (editingItem) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === editingItem.id ? { ...o, ...values } : o)),
      )
      announce(`Saved changes to ${values.role} at ${values.company}.`)
      setEditingItem(null)
    } else {
      const newItem = { ...values, id: createId(), createdAt: new Date().toISOString() }
      setOpportunities((prev) => [newItem, ...prev])
      announce(`Added ${values.role} at ${values.company}.`)
    }
  }

  function handleEdit(item) {
    setEditingItem(item)
    document.getElementById('opportunity-form-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleCancelEdit() {
    setEditingItem(null)
  }

  function handleDelete(id) {
    const target = opportunities.find((o) => o.id === id)
    if (!target) return
    const confirmed = window.confirm(`Delete "${target.role}" at ${target.company}? This cannot be undone.`)
    if (!confirmed) return
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
    if (editingItem?.id === id) setEditingItem(null)
    announce(`Deleted ${target.role} at ${target.company}.`)
  }

  function handleMarkCompleted(id) {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Completed' } : o)))
    announce('Marked as completed.')
  }

  const filteredOpportunities = useMemo(() => {
    const term = search.trim().toLowerCase()
    return opportunities.filter((o) => {
      const matchesSearch =
        !term || o.company.toLowerCase().includes(term) || o.role.toLowerCase().includes(term)
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [opportunities, search, statusFilter])

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="app__header">
        <div className="app__header-inner">
          <h1>Ledger</h1>
          <p className="app__tagline">Internship &amp; Opportunity Tracker</p>
        </div>
      </header>

      <main id="main-content" className="app__main">
        <p className="visually-hidden" role="status" aria-live="polite">
          {statusMessage}
        </p>

        {storageError && (
          <div className="banner banner--error" role="alert">
            <p>{storageError}</p>
            <button type="button" className="btn btn--small btn--ghost" onClick={clearStorageError}>
              Dismiss
            </button>
          </div>
        )}

        <Dashboard opportunities={opportunities} />

        <section className="panel" aria-labelledby="opportunity-form-heading">
          <h2 id="opportunity-form-heading">{editingItem ? 'Edit opportunity' : 'Add an opportunity'}</h2>
          <OpportunityForm editingItem={editingItem} onSave={handleSave} onCancel={handleCancelEdit} />
        </section>

        <section className="panel" aria-labelledby="opportunity-list-heading">
          <h2 id="opportunity-list-heading">Your opportunities</h2>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            resultCount={filteredOpportunities.length}
          />
          <OpportunityList
            opportunities={filteredOpportunities}
            hasAnyOpportunities={opportunities.length > 0}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkCompleted={handleMarkCompleted}
          />
        </section>
      </main>

      <footer className="app__footer">
        <p>Data is stored only in this browser via localStorage. Nothing is sent to a server.</p>
      </footer>
    </div>
  )
}
