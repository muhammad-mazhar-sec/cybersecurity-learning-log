import { useState, useRef } from 'react';
import { useSubjects } from '../context/SubjectsContext';

export default function ExportImport() {
  const { exportData, importData } = useSubjects();
  const [status, setStatus] = useState(null);
  const fileRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importData(file);
      setStatus({ type: 'success', msg: 'Data imported successfully!' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
    e.target.value = '';
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm transition-colors"
        >
          <span>⬇️</span> Export
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm transition-colors"
        >
          <span>⬆️</span> Import
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>
      {status && (
        <p className={`text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {status.msg}
        </p>
      )}
    </div>
  );
}
