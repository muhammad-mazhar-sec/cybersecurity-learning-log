import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubjects } from '../context/SubjectsContext';
import SubjectForm from '../components/SubjectForm';
import ConfirmDialog from '../components/ConfirmDialog';
import ExportImport from '../components/ExportImport';

function SubjectCard({ subject, editMode, onDelete, onEdit, onClick }) {
  const totalDecks = subject.modules.reduce((s, m) => s + m.decks.length, 0);
  const totalCards = subject.modules.reduce((sm, m) =>
    sm + m.decks.reduce((sd, d) => sd + d.cards.length, 0), 0);

  return (
    <div
      className="relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-750 transition-all hover:scale-[1.01] hover:shadow-lg"
      onClick={() => !editMode && onClick()}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: subject.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.icon}</span>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">{subject.title}</h3>
              {subject.shortTitle && <span className="text-xs text-gray-400">{subject.shortTitle}</span>}
            </div>
          </div>
          {editMode && (
            <div className="flex gap-1 shrink-0">
              {!subject.builtin && (
                <button
                  onClick={e => { e.stopPropagation(); onEdit(); }}
                  className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                  title="Edit"
                >✏️</button>
              )}
              <button
                onClick={e => { e.stopPropagation(); onDelete(); }}
                className="p-1.5 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-400 transition-colors"
                title="Delete"
              >🗑️</button>
            </div>
          )}
        </div>
        {subject.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{subject.description}</p>
        )}
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{subject.modules.length} module{subject.modules.length !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{totalDecks} deck{totalDecks !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{totalCards} card{totalCards !== 1 ? 's' : ''}</span>
        </div>
      </div>
      {!editMode && (
        <div className="px-5 pb-4">
          <button
            onClick={onClick}
            className="w-full py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: subject.color }}
          >
            Study →
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { subjects, hiddenBuiltins, builtinSubjects, addSubject, updateSubject, deleteSubject, restoreBuiltin, restoreAllBuiltins } = useSubjects();
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  const hiddenSubjects = builtinSubjects.filter(s => hiddenBuiltins.includes(s.id));

  const handleSaveSubject = (data) => {
    if (editSubject) {
      updateSubject(editSubject.id, data);
    } else {
      addSubject(data);
    }
    setShowForm(false);
    setEditSubject(null);
  };

  const handleDeleteConfirm = () => {
    deleteSubject(confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold text-white">CyberLearn</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(m => !m)}
              className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Toggle edit mode"
            >✏️</button>
            <button
              onClick={() => setShowSettings(s => !s)}
              className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Settings"
            >⚙️</button>
          </div>
        </div>
        {showSettings && (
          <div className="max-w-4xl mx-auto mt-4 p-4 bg-gray-700/50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Data Management</h3>
            <ExportImport />
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {editMode && (
          <div className="mb-4 px-3 py-2 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300 text-sm">
            ✏️ Edit mode active — click delete icons to remove subjects
          </div>
        )}

        {subjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start Your Learning Journey</h2>
            <p className="text-gray-400 mb-6">Add your first study subject to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              + Add Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                editMode={editMode}
                onClick={() => navigate(`/subject/${subject.id}`)}
                onEdit={() => { setEditSubject(subject); setShowForm(true); }}
                onDelete={() => setConfirmDelete(subject)}
              />
            ))}
          </div>
        )}

        {/* Hidden builtins */}
        {hiddenSubjects.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHidden(s => !s)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors bg-transparent border-0 p-0"
            >
              <span>{showHidden ? '▼' : '▶'}</span>
              Hidden built-in subjects ({hiddenSubjects.length})
            </button>
            {showHidden && (
              <div className="mt-3 p-4 bg-gray-800 rounded-xl space-y-2">
                {hiddenSubjects.map(s => (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{s.icon} {s.title}</span>
                    <button
                      onClick={() => restoreBuiltin(s.id)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-0 p-0"
                    >
                      Restore
                    </button>
                  </div>
                ))}
                <button
                  onClick={restoreAllBuiltins}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-0 p-0 mt-2"
                >
                  Restore All
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => { setEditSubject(null); setShowForm(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-2xl shadow-lg transition-all hover:scale-110 flex items-center justify-center"
        title="Add subject"
      >
        +
      </button>

      {showForm && (
        <SubjectForm
          initial={editSubject}
          onSave={handleSaveSubject}
          onClose={() => { setShowForm(false); setEditSubject(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Subject"
          message={`Are you sure you want to delete "${confirmDelete.title}"? ${confirmDelete.builtin ? 'It can be restored later.' : 'This cannot be undone.'}`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
