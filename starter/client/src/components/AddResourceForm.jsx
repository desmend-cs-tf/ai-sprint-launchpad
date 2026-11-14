import { useState } from 'react';
import { createResource } from '../api.js';

const EMPTY = { name: '', category: '', neighborhood: '', description: '', hours: '', tags: '' };

export default function AddResourceForm({ categories, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // One change handler for every input: uses the input's "name" attribute as the key
  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        // "food, groceries" → ["food", "groceries"]
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const created = await createResource(payload);
      onCreated(created);
      setForm(EMPTY);
      setMessage('✅ Added!');
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="add-heading">
      <h2 id="add-heading">Add a resource</h2>
      <form onSubmit={handleSubmit} className="stack">
        <input name="name" placeholder="Name *" value={form.name} onChange={update} required />
        <select name="category" value={form.category} onChange={update} required>
          <option value="">Category *</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input name="neighborhood" placeholder="Neighborhood" value={form.neighborhood} onChange={update} />
        <textarea name="description" placeholder="What does it offer?" rows={3} value={form.description} onChange={update} />
        <input name="hours" placeholder="Hours (e.g. Mon–Fri 9–5)" value={form.hours} onChange={update} />
        <input name="tags" placeholder="Tags, comma separated" value={form.tags} onChange={update} />
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add resource'}</button>
      </form>
      {message && <p className="small">{message}</p>}
    </section>
  );
}
