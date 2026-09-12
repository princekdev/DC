function formatStars(count) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`
  }
  return String(count)
}

export default function RepoCard({ repo }) {
  return (
    <li className="repo-card">
      <div className="repo-card__main">
        <h3 className="repo-card__name">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.full_name}
          </a>
        </h3>
        {repo.description && <p className="repo-card__description">{repo.description}</p>}
      </div>

      <dl className="repo-card__meta">
        <div className="repo-card__meta-item" title={`${repo.stargazers_count.toLocaleString()} stars`}>
          <dt className="visually-hidden">Stars</dt>
          <dd>
            <span aria-hidden="true">★</span> {formatStars(repo.stargazers_count)}
          </dd>
        </div>
        {repo.language && (
          <div className="repo-card__meta-item">
            <dt className="visually-hidden">Language</dt>
            <dd>{repo.language}</dd>
          </div>
        )}
      </dl>
    </li>
  )
}
