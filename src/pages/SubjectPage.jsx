import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSubjects } from '../context/SubjectsContext';
import ModuleForm from '../components/ModuleForm';
import ConfirmDialog from '../components/ConfirmDialog';
import MindMap from '../components/MindMap';

function ModuleCard({ module, subject, editMode, onEdit, onDelete, onClick }) {
  const totalCards = module.decks.reduce((s, d) => s + d.cards.length, 0);

  return (
    <div
      className="relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-750 transition-all hover:scale-[1.01]"
      onClick={() => !editMode && onClick()}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: module.color || subject.color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white">{module.title}</h3>
          {editMode && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); onEdit(); }}
                className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors"
              >✏️</button>
              <button
                onClick={e => { e.stopPropagation(); onDelete(); }}
                className="p-1.5 rounded bg-red-900/50 hover:bg-red-800 text-red-400 text-sm transition-colors"
              >🗑️</button>
            </div>
          )}
        </div>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{module.decks.length} deck{module.decks.length !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{totalCards} card{totalCards !== 1 ? 's' : ''}</span>
        </div>
        {!editMode && (
          <button
            onClick={onClick}
            className="mt-3 w-full py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: module.color || subject.color }}
          >
            Open →
          </button>
        )}
      </div>
    </div>
  );
}

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { getSubject, addModule, updateModule, deleteModule, generateMindMap } = useSubjects();
  const subject = getSubject(subjectId);

  const [editMode, setEditMode] = useState(false);
  const [view, setView] = useState('modules');
  const [showForm, setShowForm] = useState(false);
  const [editModule, setEditModule] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Subject not found.</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">← Go Home</Link>
        </div>
      </div>
    );
  }

  const mindMapData = generateMindMap(subjectId);

  const handleSaveModule = (data) => {
    if (editModule) {
      updateModule(subjectId, editModule.id, data);
    } else {
      addModule(subjectId, data);
    }
    setShowForm(false);
    setEditModule(null);
  };

  const handleDeleteConfirm = () => {
    deleteModule(subjectId, confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <Link to="/" className="hover:text-white transition-colors">🏠 Home</Link>
            <span>/</span>
            <span className="text-white font-medium">{subject.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >←</button>
              <span className="text-2xl">{subject.icon}</span>
              <h1 className="text-xl font-bold text-white">{subject.title}</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(m => !m)}
                className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                title="Toggle edit mode"
              >✏️</button>
            </div>
          </div>
        </div>
      </header>

      {/* View toggle */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView('modules')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'modules' ? 'text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            style={view === 'modules' ? { backgroundColor: subject.color } : {}}
          >
            📚 Modules
          </button>
          <button
            onClick={() => setView('mindmap')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'mindmap' ? 'text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            style={view === 'mindmap' ? { backgroundColor: subject.color } : {}}
          >
            🗺️ Mind Map
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pb-24">
        {editMode && (
          <div className="mb-4 px-3 py-2 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300 text-sm">
            ✏️ Edit mode active
          </div>
        )}

        {view === 'modules' && (
          <>
            {subject.modules.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📂</div>
                <h2 className="text-xl font-bold text-white mb-2">No modules yet</h2>
                <p className="text-gray-400 mb-4">Add a module to organize your study decks</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 rounded-xl text-white font-semibold transition-colors"
                  style={{ backgroundColor: subject.color }}
                >
                  + Add Module
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subject.modules.map(mod => (
                  <ModuleCard
                    key={mod.id}
                    module={mod}
                    subject={subject}
                    editMode={editMode}
                    onClick={() => navigate(`/subject/${subjectId}/module/${mod.id}`)}
                    onEdit={() => { setEditModule(mod); setShowForm(true); }}
                    onDelete={() => setConfirmDelete(mod)}
                  />
                ))}
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={() => { setEditModule(null); setShowForm(true); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: subject.color }}
              >
                + Add Module
              </button>
            </div>
          </>
        )}

        {view === 'mindmap' && (
          <MindMap data={mindMapData} />
        )}
      </main>

      {showForm && (
        <ModuleForm
          initial={editModule}
          onSave={handleSaveModule}
          onClose={() => { setShowForm(false); setEditModule(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Module"
          message={`Delete "${confirmDelete.title}" and all its decks and cards?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
