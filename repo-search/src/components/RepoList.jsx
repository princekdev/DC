import RepoCard from './RepoCard.jsx'

export default function RepoList({ repos, query }) {
  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" className="results-heading">
        Results for <span className="results-heading__query">"{query}"</span>
      </h2>
      <ul className="repo-list">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </ul>
    </section>
  )
}
