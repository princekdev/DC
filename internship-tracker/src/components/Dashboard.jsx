export default function Dashboard({ opportunities }) {
  const total = opportunities.length
  const applied = opportunities.filter((o) => o.status !== 'Wishlist').length
  const pending = opportunities.filter(
    (o) => o.status === 'Applied' || o.status === 'Interview',
  ).length
  const selectedOrCompleted = opportunities.filter(
    (o) => o.status === 'Selected' || o.status === 'Completed',
  ).length

  const hasOpportunities = opportunities.length > 0

  const stats = [
    { label: 'Total opportunities', value: total },
    { label: 'Applied', value: applied },
    { label: 'Pending decision', value: pending },
    { label: 'Selected / completed', value: selectedOrCompleted },
  ]

  return (
    <section className="dashboard" aria-label="Summary statistics">
      {!hasOpportunities && (
        <div className="dashboard__empty">
          <h3>No internship opportunities yet</h3>
          <p>
            Add your first opportunity to start tracking your applications.
          </p>
        </div>
      )}

      <dl className="dashboard__grid">
        {stats.map((stat) => (
          <div className="dashboard__stat" key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
