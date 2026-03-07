const PRESET_COLORS = [
  '#FF4B4B', '#FF6B6B', '#FF8C42', '#F9A825',
  '#58CC02', '#00C853', '#1CB0F6', '#4C97FF',
  '#7C4DFF', '#E91E8C', '#607D8B', '#455A64',
];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: value === color ? 'white' : 'transparent',
            }}
            title={color}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#1CB0F6'}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
        />
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#1CB0F6"
          className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
