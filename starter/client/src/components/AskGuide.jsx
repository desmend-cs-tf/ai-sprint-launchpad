import { useState } from 'react';
import { askGuide, compareModels } from '../api.js';

export default function AskGuide() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]); // [{ role, content, provider?, sources? }]
  const [comparison, setComparison] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleAsk(e) {
    e.preventDefault();
    if (!message.trim()) return;

    const question = message.trim();
    setMessage('');
    setError('');
    setComparison(null);
    setBusy(true);
    setHistory((h) => [...h, { role: 'user', content: question }]);

    try {
      // Send only the last 6 turns (role + content) — keeps requests small
      const recent = history.slice(-6).map(({ role, content }) => ({ role, content }));
      const data = await askGuide(question, recent);
      setHistory((h) => [...h, { role: 'assistant', content: data.reply, provider: data.provider, sources: data.sources }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCompare() {
    if (!message.trim()) return;
    setBusy(true);
    setError('');
    try {
      setComparison(await compareModels(message.trim()));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="guide-heading">
      <h2 id="guide-heading">Ask the AI guide</h2>

      <div className="chat" aria-live="polite">
        {history.length === 0 && (
          <p className="muted small">Example: “My grandma needs a ride to the doctor in Chatham.”</p>
        )}
        {history.map((turn, i) => (
          <div key={i} className={`bubble bubble-${turn.role}`}>
            <p>{turn.content}</p>
            {turn.provider && (
              <p className="small muted">
                via {turn.provider}
                {turn.sources?.length > 0 && ` · used: ${turn.sources.map((s) => s.name).join(', ')}`}
              </p>
            )}
          </div>
        ))}
        {busy && <p className="muted small">Thinking…</p>}
      </div>

      <form onSubmit={handleAsk} className="ask-form">
        <label className="sr-only" htmlFor="ask">Your question</label>
        <input
          id="ask"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about food, jobs, housing…"
          maxLength={2000}
        />
        <button type="submit" disabled={busy}>Ask</button>
        <button type="button" className="secondary" onClick={handleCompare} disabled={busy} title="Ask every configured model at once">
          Compare models
        </button>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      {comparison && (
        <div className="compare">
          {comparison.length === 0 && <p className="muted small">Add at least one API key to compare models.</p>}
          {comparison.map((result) => (
            <div key={result.provider} className={`compare-card ${result.ok ? '' : 'failed'}`}>
              <h3>{result.provider} <span className="small muted">{result.model}</span></h3>
              <p>{result.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
