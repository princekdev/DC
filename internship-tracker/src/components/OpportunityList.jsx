import OpportunityCard from './OpportunityCard'
import EmptyState from './EmptyState'

export default function OpportunityList({ opportunities, hasAnyOpportunities, onEdit, onDelete, onMarkCompleted }) {
  if (opportunities.length === 0) {
    return <EmptyState hasOpportunities={hasAnyOpportunities} />
  }

  return (
    <ul className="card-list">
      {opportunities.map((opp) => (
        <OpportunityCard
          key={opp.id}
          opportunity={opp}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkCompleted={onMarkCompleted}
        />
      ))}
    </ul>
  )
}
