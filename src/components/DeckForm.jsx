import { useState } from 'react';

export default function DeckForm({ initial, onSave, onClose }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    onSave({ title: title.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {initial ? 'Edit Deck' : 'New Deck'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none bg-transparent border-0 p-0">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Types of Malware"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                {initial ? 'Save Changes' : 'Create Deck'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
