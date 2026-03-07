import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSubjects } from '../context/SubjectsContext';
import CardForm from '../components/CardForm';
import ConfirmDialog from '../components/ConfirmDialog';

function FlipCard({ card, accentColor }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: '1000px', minHeight: '280px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '280px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Topic</div>
          <h2 className="text-2xl font-bold text-white text-center mb-4">{card.topic}</h2>
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {card.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-gray-500 text-sm mt-6">Click to reveal definition →</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-gray-800 rounded-xl p-6 overflow-y-auto"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Definition</div>
          <p className="text-white mb-4">{card.definition}</p>

          {card.keyPoints && card.keyPoints.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Key Points</div>
              <ul className="space-y-1.5">
                {card.keyPoints.map((kp, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="font-semibold shrink-0" style={{ color: accentColor }}>{kp.point}:</span>
                    <span className="text-gray-300">{kp.brief}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {card.examTip && (
            <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-lg p-3">
              <div className="text-xs text-yellow-400 font-semibold mb-1">💡 Exam Tip</div>
              <p className="text-yellow-200 text-sm">{card.examTip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CardListItem({ card, accentColor, editMode, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-750"
        onClick={() => !editMode && setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-1.5 h-6 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
          <span className="font-semibold text-white truncate">{card.topic}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
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
            <span className="text-gray-500 text-sm">{expanded ? '▲' : '▼'}</span>
          )}
        </div>
      </div>
      {expanded && !editMode && (
        <div className="px-4 pb-4 border-t border-gray-700 pt-3">
          <p className="text-gray-300 text-sm mb-3">{card.definition}</p>
          {card.keyPoints?.length > 0 && (
            <ul className="space-y-1 mb-3">
              {card.keyPoints.map((kp, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="font-semibold shrink-0" style={{ color: accentColor }}>{kp.point}:</span>
                  <span className="text-gray-400">{kp.brief}</span>
                </li>
              ))}
            </ul>
          )}
          {card.examTip && (
            <div className="bg-yellow-900/20 rounded-lg px-3 py-2">
              <span className="text-yellow-400 text-xs font-semibold">💡 </span>
              <span className="text-yellow-200 text-xs">{card.examTip}</span>
            </div>
          )}
          {card.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DeckPage() {
  const { subjectId, moduleId, deckId } = useParams();
  const navigate = useNavigate();
  const { getSubject, addCard, updateCard, deleteCard } = useSubjects();
  const subject = getSubject(subjectId);
  const module = subject?.modules.find(m => m.id === moduleId);
  const deck = module?.decks.find(d => d.id === deckId);

  const [editMode, setEditMode] = useState(false);
  const [view, setView] = useState('flashcard');
  const [cardIndex, setCardIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [studied, setStudied] = useState(new Set());

  if (!subject || !module || !deck) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Deck not found.</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">← Go Home</Link>
        </div>
      </div>
    );
  }

  const accentColor = module.color || subject.color;
  const cards = deck.cards;
  const currentCard = cards[cardIndex];

  const handleSaveCard = (data) => {
    if (editCard) {
      updateCard(subjectId, moduleId, deckId, editCard.id, data);
    } else {
      addCard(subjectId, moduleId, deckId, data);
    }
    setShowForm(false);
    setEditCard(null);
  };

  const handleDeleteConfirm = () => {
    deleteCard(subjectId, moduleId, deckId, confirmDelete.id);
    if (cardIndex >= cards.length - 1) setCardIndex(Math.max(0, cards.length - 2));
    setConfirmDelete(null);
  };

  const markStudied = () => {
    if (currentCard) {
      setStudied(s => new Set([...s, currentCard.id]));
    }
  };

  const goNext = () => {
    markStudied();
    setCardIndex(i => Math.min(i + 1, cards.length - 1));
  };

  const goPrev = () => {
    setCardIndex(i => Math.max(i - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-3 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">🏠</Link>
            <span>/</span>
            <Link to={`/subject/${subjectId}`} className="hover:text-white transition-colors">{subject.shortTitle || subject.title}</Link>
            <span>/</span>
            <Link to={`/subject/${subjectId}/module/${moduleId}`} className="hover:text-white transition-colors">{module.shortTitle || module.title}</Link>
            <span>/</span>
            <span className="text-white font-medium">{deck.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/subject/${subjectId}/module/${moduleId}`)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >←</button>
              <h1 className="text-xl font-bold text-white">{deck.title}</h1>
            </div>
            <button
              onClick={() => setEditMode(m => !m)}
              className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Toggle edit mode"
            >✏️</button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* View Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView('flashcard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'flashcard' ? 'text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            style={view === 'flashcard' ? { backgroundColor: accentColor } : {}}
          >
            🃏 Flashcards
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            style={view === 'list' ? { backgroundColor: accentColor } : {}}
          >
            📋 List
          </button>
        </div>

        {editMode && (
          <div className="mb-4 px-3 py-2 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300 text-sm">
            ✏️ Edit mode active
          </div>
        )}

        {cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🃏</div>
            <h2 className="text-xl font-bold text-white mb-2">No cards yet</h2>
            <p className="text-gray-400 mb-4">Add your first flashcard to start studying</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl text-white font-semibold transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              + Add Card
            </button>
          </div>
        ) : view === 'flashcard' ? (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
              <span>{cardIndex + 1} / {cards.length}</span>
              <span>{studied.size} studied</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-4">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${((cardIndex + 1) / cards.length) * 100}%`, backgroundColor: accentColor }}
              />
            </div>

            {currentCard && <FlipCard key={currentCard.id} card={currentCard} accentColor={accentColor} />}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4 gap-3">
              <button
                onClick={goPrev}
                disabled={cardIndex === 0}
                className="flex-1 py-3 rounded-xl font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-gray-800 hover:bg-gray-700 text-white"
              >
                ← Previous
              </button>
              <button
                onClick={goNext}
                disabled={cardIndex === cards.length - 1}
                className="flex-1 py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: accentColor }}
              >
                Next →
              </button>
            </div>

            {editMode && currentCard && (
              <div className="flex gap-2 mt-3 justify-end">
                <button
                  onClick={() => { setEditCard(currentCard); setShowForm(true); }}
                  className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm transition-colors"
                >
                  ✏️ Edit Card
                </button>
                <button
                  onClick={() => setConfirmDelete(currentCard)}
                  className="px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-400 text-sm transition-colors"
                >
                  🗑️ Delete Card
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map(card => (
              <CardListItem
                key={card.id}
                card={card}
                accentColor={accentColor}
                editMode={editMode}
                onEdit={() => { setEditCard(card); setShowForm(true); }}
                onDelete={() => setConfirmDelete(card)}
              />
            ))}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => { setEditCard(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            + Add Card
          </button>
        </div>
      </main>

      {showForm && (
        <CardForm
          initial={editCard}
          onSave={handleSaveCard}
          onClose={() => { setShowForm(false); setEditCard(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Card"
          message={`Delete the card "${confirmDelete.topic}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
