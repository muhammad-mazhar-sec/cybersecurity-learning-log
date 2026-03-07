import { useState } from 'react';

const EMOJIS = [
  '🔐', '🛡️', '🌐', '🕷️', '🔬', '🐧', '📜', '💻',
  '🔑', '⚡', '🎯', '📊', '🔍', '🧩', '🚀', '🎓',
  '📚', '🏆', '🌟', '⚙️', '🔧', '🛠️', '🔒', '🔓',
  '📡', '🌍', '💡', '🎪', '🎭', '🏴‍☠️',
];

export default function EmojiPicker({ value, onChange }) {
  const [custom, setCustom] = useState('');

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-10 gap-1">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            className={`text-xl p-1.5 rounded-lg transition-colors hover:bg-gray-600 ${value === emoji ? 'bg-gray-600 ring-2 ring-blue-500' : ''}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl w-8 text-center">{value || '❓'}</span>
        <input
          type="text"
          value={custom}
          onChange={e => {
            setCustom(e.target.value);
            if (e.target.value) onChange(e.target.value);
          }}
          placeholder="Custom emoji or text..."
          className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
