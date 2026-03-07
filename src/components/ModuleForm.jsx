import { useState } from 'react';
import ColorPicker from './ColorPicker';

export default function ModuleForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    shortTitle: initial?.shortTitle || '',
    color: initial?.color || '#1CB0F6',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErrors({ title: 'Title is required' }); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {initial ? 'Edit Module' : 'New Module'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none bg-transparent border-0 p-0">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Threats & Vulnerabilities"
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
                placeholder="e.g. Threats"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
              <ColorPicker value={form.color} onChange={v => setForm(f => ({ ...f, color: v }))} />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                {initial ? 'Save Changes' : 'Create Module'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
