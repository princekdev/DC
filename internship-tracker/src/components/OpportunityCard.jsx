import { normalizeLink } from '../utils/validation'

function formatDeadline(deadline) {
  if (!deadline) return { text: 'No deadline', overdue: false }
  const date = new Date(`${deadline}T00:00:00`)
  if (Number.isNaN(date.getTime())) return { text: 'No deadline', overdue: false }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdue = date < today
  const text = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  return { text, overdue }
}

const STATUS_CLASS = {
  Wishlist: 'badge--wishlist',
  Applied: 'badge--applied',
  Interview: 'badge--interview',
  Selected: 'badge--selected',
  Completed: 'badge--completed',
  Rejected: 'badge--rejected',
}

export default function OpportunityCard({ opportunity, onEdit, onDelete, onMarkCompleted }) {
  const { text: deadlineText, overdue } = formatDeadline(opportunity.deadline)
  const isCompleted = opportunity.status === 'Completed'
  const isRejected = opportunity.status === 'Rejected'

  return (
    <li className="card" data-status={opportunity.status}>
      <div className="card__main">
        <div className="card__heading">
          <h3 className="card__title">{opportunity.role}</h3>
          <span className={`badge ${STATUS_CLASS[opportunity.status] || ''}`}>{opportunity.status}</span>
        </div>
        <p className="card__company">{opportunity.company}</p>

        <dl className="card__meta">
          <div>
            <dt>Type</dt>
            <dd>{opportunity.type}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd className={overdue && !isCompleted && !isRejected ? 'text-overdue' : undefined}>
              {deadlineText}
              {overdue && !isCompleted && !isRejected ? ' (overdue)' : ''}
            </dd>
          </div>
          {opportunity.link && (
            <div>
              <dt>Link</dt>
              <dd>
                <a href={normalizeLink(opportunity.link)} target="_blank" rel="noopener noreferrer">
                  View posting
                </a>
              </dd>
            </div>
          )}
        </dl>

        {opportunity.notes && <p className="card__notes">{opportunity.notes}</p>}
      </div>

      <div className="card__actions">
        {!isCompleted && (
          <button type="button" className="btn btn--small btn--ghost" onClick={() => onMarkCompleted(opportunity.id)}>
            Mark completed
          </button>
        )}
        <button type="button" className="btn btn--small btn--ghost" onClick={() => onEdit(opportunity)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn--small btn--danger"
          onClick={() => onDelete(opportunity.id)}
          aria-label={`Delete ${opportunity.role} at ${opportunity.company}`}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
