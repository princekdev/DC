import { STATUSES } from '../utils/constants'

export default function FilterBar({ search, onSearchChange, statusFilter, onStatusFilterChange, resultCount }) {
  return (
    <div className="filterbar" role="search">
      <div className="field field--inline">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search by company or role…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="field field--inline">
        <label htmlFor="statusFilter">Filter by status</label>
        <select id="statusFilter" value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="filterbar__count" aria-live="polite">
        {resultCount} {resultCount === 1 ? 'result' : 'results'}
      </p>
    </div>
  )
}
