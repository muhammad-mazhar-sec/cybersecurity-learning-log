import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSubjects } from '../context/SubjectsContext';
import DeckForm from '../components/DeckForm';
import ConfirmDialog from '../components/ConfirmDialog';

function DeckCard({ deck, module, subject, editMode, onEdit, onDelete, onClick }) {
  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 flex items-center justify-between gap-3 ${!editMode ? 'cursor-pointer hover:bg-gray-750 transition-all hover:scale-[1.005]' : ''}`}
      onClick={() => !editMode && onClick()}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-2 h-10 rounded-full shrink-0"
          style={{ backgroundColor: module.color || subject.color }}
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate">{deck.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {editMode ? (
          <>
            <button
              onClick={e => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors"
            >✏️</button>
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded bg-red-900/50 hover:bg-red-800 text-red-400 text-sm transition-colors"
            >🗑️</button>
          </>
        ) : (
          <button
            onClick={onClick}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: module.color || subject.color }}
          >
            Study →
          </button>
        )}
      </div>
    </div>
  );
}

export default function ModulePage() {
  const { subjectId, moduleId } = useParams();
  const navigate = useNavigate();
  const { getSubject, addDeck, updateDeck, deleteDeck } = useSubjects();
  const subject = getSubject(subjectId);
  const module = subject?.modules.find(m => m.id === moduleId);

  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editDeck, setEditDeck] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (!subject || !module) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Module not found.</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">← Go Home</Link>
        </div>
      </div>
    );
  }

  const handleSaveDeck = (data) => {
    if (editDeck) {
      updateDeck(subjectId, moduleId, editDeck.id, data);
    } else {
      addDeck(subjectId, moduleId, data);
    }
    setShowForm(false);
    setEditDeck(null);
  };

  const handleDeleteConfirm = () => {
    deleteDeck(subjectId, moduleId, confirmDelete.id);
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">🏠 Home</Link>
            <span>/</span>
            <Link to={`/subject/${subjectId}`} className="hover:text-white transition-colors">{subject.title}</Link>
            <span>/</span>
            <span className="text-white font-medium">{module.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/subject/${subjectId}`)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >←</button>
              <div
                className="w-3 h-6 rounded-full"
                style={{ backgroundColor: module.color || subject.color }}
              />
              <h1 className="text-xl font-bold text-white">{module.title}</h1>
            </div>
            <button
              onClick={() => setEditMode(m => !m)}
              className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Toggle edit mode"
            >✏️</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {editMode && (
          <div className="mb-4 px-3 py-2 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300 text-sm">
            ✏️ Edit mode active
          </div>
        )}

        {module.decks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🗂️</div>
            <h2 className="text-xl font-bold text-white mb-2">No decks yet</h2>
            <p className="text-gray-400 mb-4">Add a deck to start adding flashcards</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl text-white font-semibold transition-colors"
              style={{ backgroundColor: module.color || subject.color }}
            >
              + Add Deck
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {module.decks.map(deck => (
              <DeckCard
                key={deck.id}
                deck={deck}
                module={module}
                subject={subject}
                editMode={editMode}
                onClick={() => navigate(`/subject/${subjectId}/module/${moduleId}/deck/${deck.id}`)}
                onEdit={() => { setEditDeck(deck); setShowForm(true); }}
                onDelete={() => setConfirmDelete(deck)}
              />
            ))}
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={() => { setEditDeck(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: module.color || subject.color }}
          >
            + Add Deck
          </button>
        </div>
      </main>

      {showForm && (
        <DeckForm
          initial={editDeck}
          onSave={handleSaveDeck}
          onClose={() => { setShowForm(false); setEditDeck(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Deck"
          message={`Delete "${confirmDelete.title}" and all its cards?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
