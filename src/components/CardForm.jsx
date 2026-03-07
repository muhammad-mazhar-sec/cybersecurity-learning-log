import { useState } from 'react';

const EMPTY_KEYPOINT = { point: '', brief: '' };

export default function CardForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    topic: initial?.topic || '',
    definition: initial?.definition || '',
    keyPoints: initial?.keyPoints?.length ? initial.keyPoints : [{ ...EMPTY_KEYPOINT }],
    examTip: initial?.examTip || '',
    tags: initial?.tags?.join(', ') || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.topic.trim()) e.topic = 'Topic is required';
    if (!form.definition.trim()) e.definition = 'Definition is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const tags = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    const keyPoints = form.keyPoints.filter(kp => kp.point.trim());
    onSave({ ...form, tags, keyPoints });
  };

  const updateKeyPoint = (idx, field, value) => {
    setForm(f => ({
      ...f,
      keyPoints: f.keyPoints.map((kp, i) => i === idx ? { ...kp, [field]: value } : kp),
    }));
  };

  const addKeyPoint = () => {
    setForm(f => ({ ...f, keyPoints: [...f.keyPoints, { ...EMPTY_KEYPOINT }] }));
  };

  const removeKeyPoint = (idx) => {
    setForm(f => ({ ...f, keyPoints: f.keyPoints.filter((_, i) => i !== idx) }));
  };

  const tagList = form.tags.split(',').map(t => t.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {initial ? 'Edit Card' : 'New Card'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none bg-transparent border-0 p-0">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Topic *</label>
              <input
                type="text"
                value={form.topic}
                onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Ransomware"
              />
              {errors.topic && <p className="text-red-400 text-sm mt-1">{errors.topic}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Definition *</label>
              <textarea
                value={form.definition}
                onChange={e => setForm(f => ({ ...f, definition: e.target.value }))}
                rows={3}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Clear, concise definition..."
              />
              {errors.definition && <p className="text-red-400 text-sm mt-1">{errors.definition}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Key Points</label>
                <button
                  type="button"
                  onClick={addKeyPoint}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-0 p-0"
                >
                  + Add Point
                </button>
              </div>
              <div className="space-y-2">
                {form.keyPoints.map((kp, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={kp.point}
                        onChange={e => updateKeyPoint(idx, 'point', e.target.value)}
                        className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={kp.brief}
                        onChange={e => updateKeyPoint(idx, 'brief', e.target.value)}
                        className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief explanation"
                      />
                    </div>
                    {form.keyPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyPoint(idx)}
                        className="text-red-400 hover:text-red-300 text-lg leading-none mt-2 bg-transparent border-0 p-0"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Exam Tip</label>
              <textarea
                value={form.examTip}
                onChange={e => setForm(f => ({ ...f, examTip: e.target.value }))}
                rows={2}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Optional exam tip..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. malware, encryption, threats"
              />
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tagList.map(tag => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                {initial ? 'Save Changes' : 'Create Card'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
