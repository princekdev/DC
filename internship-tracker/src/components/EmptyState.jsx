export default function EmptyState({ hasOpportunities }) {
  if (hasOpportunities) {
    return (
      <div className="empty-state">
        <h2>No matches</h2>
        <p>No opportunities match your search or filter. Try clearing them to see everything.</p>
      </div>
    )
  }

  return (
    <div className="empty-state">
      <h2>Nothing tracked yet</h2>
      <p>Add your first internship or opportunity above to start tracking deadlines and status.</p>
    </div>
  )
}
