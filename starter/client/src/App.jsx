import { useEffect, useState } from 'react';
import { getCategories, getHealth, getResources } from './api.js';
import ResourceList from './components/ResourceList.jsx';
import AskGuide from './components/AskGuide.jsx';
import AddResourceForm from './components/AddResourceForm.jsx';

export default function App() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load categories + server status once, when the page first opens
  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
    getHealth().then(setHealth).catch(() => setHealth(null));
  }, []);

  // Re-fetch whenever the search text or category changes.
  // The 300ms timeout "debounces" typing so we don't hit the API on every keystroke.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getResources({ q: query, category })
        .then((data) => {
          setResources(data);
          setError('');
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, category]);

  function handleCreated(newResource) {
    setResources((current) => [newResource, ...current]);
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">CodeSquad · AI Community Sprint</p>
        <h1>Community Resource Finder</h1>
        <p className="lede">Search free local resources — or ask the AI guide in plain English.</p>
        {health && (
          <p className="status">
            Data: <strong>{health.database}</strong> · AI:{' '}
            <strong>{health.aiProviders.length ? health.aiProviders.join(' → ') : 'demo mode'}</strong>
          </p>
        )}
      </header>

      <main className="layout">
        <section aria-labelledby="browse-heading">
          <h2 id="browse-heading">Browse</h2>
          <div className="filters">
            <label className="sr-only" htmlFor="search">Search</label>
            <input
              id="search"
              type="search"
              placeholder="Try “pantry”, “coding”, or “Pilsen”"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <label className="sr-only" htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {error && <p className="error" role="alert">{error}</p>}
          {loading ? <p className="muted">Loading…</p> : <ResourceList resources={resources} />}
        </section>

        <aside className="sidebar">
          <AskGuide />
          <AddResourceForm categories={categories} onCreated={handleCreated} />
        </aside>
      </main>

      <footer className="footer">
        Sample data is fictional — replace it with verified, real resources before you launch.
      </footer>
    </div>
  );
}
