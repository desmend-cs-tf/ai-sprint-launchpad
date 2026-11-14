export default function ResourceList({ resources }) {
  if (resources.length === 0) {
    return <p className="muted">No resources match. Try a different word or category.</p>;
  }

  return (
    <ul className="cards">
      {resources.map((r) => (
        <li key={r.id} className="card">
          <div className="card-top">
            <span className={`pill pill-${r.category}`}>{r.category}</span>
            {r.neighborhood && <span className="muted small">{r.neighborhood}</span>}
          </div>
          <h3>{r.name}</h3>
          {r.description && <p>{r.description}</p>}
          {r.hours && <p className="small"><strong>Hours:</strong> {r.hours}</p>}
          {r.tags?.length > 0 && (
            <p className="tags">
              {r.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </p>
          )}
          {r.website && (
            <a href={r.website} target="_blank" rel="noreferrer">Website ↗</a>
          )}
        </li>
      ))}
    </ul>
  );
}
