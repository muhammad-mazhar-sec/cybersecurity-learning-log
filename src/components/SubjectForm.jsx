import { useState } from 'react';
import ColorPicker from './ColorPicker';
import EmojiPicker from './EmojiPicker';

export default function SubjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    shortTitle: initial?.shortTitle || '',
    description: initial?.description || '',
    icon: initial?.icon || '🔐',
    color: initial?.color || '#1CB0F6',
  });
  const [errors, setErrors] = useState({});
  const [tab, setTab] = useState('basic');

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {initial ? 'Edit Subject' : 'New Subject'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none bg-transparent border-0 p-0">&times;</button>
          </div>

          <div className="flex gap-2 mb-6">
            {['basic', 'icon', 'color'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'basic' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. CompTIA Security+"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Short Title</label>
                  <input
                    type="text"
                    value={form.shortTitle}
                    onChange={e => setForm(f => ({ ...f, shortTitle: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Sec+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Brief description..."
                  />
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-3xl">{form.icon}</span>
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: form.color }} />
                  <span className="text-gray-300 text-sm">Preview</span>
                </div>
              </>
            )}

            {tab === 'icon' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Icon</label>
                <EmojiPicker value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} />
              </div>
            )}

            {tab === 'color' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Color</label>
                <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                {initial ? 'Save Changes' : 'Create Subject'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
