import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { builtinSubjects } from '../data/builtinSubjects';

const STORAGE_KEY = 'cyberlearn_subjects';
const HIDDEN_BUILTIN_KEY = 'cyberlearn_hidden_builtins';

const SubjectsContext = createContext(null);

export function SubjectsProvider({ children }) {
  const [customSubjects, setCustomSubjects] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [hiddenBuiltins, setHiddenBuiltins] = useState(() => {
    try {
      const stored = localStorage.getItem(HIDDEN_BUILTIN_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customSubjects));
  }, [customSubjects]);

  useEffect(() => {
    localStorage.setItem(HIDDEN_BUILTIN_KEY, JSON.stringify(hiddenBuiltins));
  }, [hiddenBuiltins]);

  const visibleBuiltins = builtinSubjects.filter(s => !hiddenBuiltins.includes(s.id));
  const subjects = [...visibleBuiltins, ...customSubjects];

  const getSubject = useCallback((id) =>
    subjects.find(s => s.id === id), [subjects]);

  const generateId = () => `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // Subject CRUD
  const addSubject = useCallback((data) => {
    const newSubject = {
      id: generateId(),
      ...data,
      builtin: false,
      modules: []
    };
    setCustomSubjects(prev => [...prev, newSubject]);
    return newSubject.id;
  }, []);

  const updateSubject = useCallback((id, data) => {
    const isBuiltin = builtinSubjects.some(s => s.id === id);
    if (isBuiltin) return;
    setCustomSubjects(prev =>
      prev.map(s => s.id === id ? { ...s, ...data } : s)
    );
  }, []);

  const deleteSubject = useCallback((id) => {
    const isBuiltin = builtinSubjects.some(s => s.id === id);
    if (isBuiltin) {
      setHiddenBuiltins(prev => [...prev, id]);
    } else {
      setCustomSubjects(prev => prev.filter(s => s.id !== id));
    }
  }, []);

  const restoreBuiltin = useCallback((id) => {
    setHiddenBuiltins(prev => prev.filter(hid => hid !== id));
  }, []);

  const restoreAllBuiltins = useCallback(() => {
    setHiddenBuiltins([]);
  }, []);

  // Module CRUD
  const addModule = useCallback((subjectId, data) => {
    const newModule = { id: generateId(), ...data, decks: [] };
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? { ...s, modules: [...s.modules, newModule] }
        : s
      )
    );
    return newModule.id;
  }, []);

  const updateModule = useCallback((subjectId, moduleId, data) => {
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? { ...s, modules: s.modules.map(m => m.id === moduleId ? { ...m, ...data } : m) }
        : s
      )
    );
  }, []);

  const deleteModule = useCallback((subjectId, moduleId) => {
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? { ...s, modules: s.modules.filter(m => m.id !== moduleId) }
        : s
      )
    );
  }, []);

  // Deck CRUD
  const addDeck = useCallback((subjectId, moduleId, data) => {
    const newDeck = { id: generateId(), ...data, cards: [] };
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? {
          ...s, modules: s.modules.map(m => m.id === moduleId
            ? { ...m, decks: [...m.decks, newDeck] }
            : m
          )
        }
        : s
      )
    );
    return newDeck.id;
  }, []);

  const updateDeck = useCallback((subjectId, moduleId, deckId, data) => {
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? {
          ...s, modules: s.modules.map(m => m.id === moduleId
            ? { ...m, decks: m.decks.map(d => d.id === deckId ? { ...d, ...data } : d) }
            : m
          )
        }
        : s
      )
    );
  }, []);

  const deleteDeck = useCallback((subjectId, moduleId, deckId) => {
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? {
          ...s, modules: s.modules.map(m => m.id === moduleId
            ? { ...m, decks: m.decks.filter(d => d.id !== deckId) }
            : m
          )
        }
        : s
      )
    );
  }, []);

  // Card CRUD
  const addCard = useCallback((subjectId, moduleId, deckId, data) => {
    const newCard = { id: generateId(), ...data };
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? {
          ...s, modules: s.modules.map(m => m.id === moduleId
            ? {
              ...m, decks: m.decks.map(d => d.id === deckId
                ? { ...d, cards: [...d.cards, newCard] }
                : d
              )
            }
            : m
          )
        }
        : s
      )
    );
    return newCard.id;
  }, []);

  const updateCard = useCallback((subjectId, moduleId, deckId, cardId, data) => {
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? {
          ...s, modules: s.modules.map(m => m.id === moduleId
            ? {
              ...m, decks: m.decks.map(d => d.id === deckId
                ? { ...d, cards: d.cards.map(c => c.id === cardId ? { ...c, ...data } : c) }
                : d
              )
            }
            : m
          )
        }
        : s
      )
    );
  }, []);

  const deleteCard = useCallback((subjectId, moduleId, deckId, cardId) => {
    setCustomSubjects(prev =>
      prev.map(s => s.id === subjectId
        ? {
          ...s, modules: s.modules.map(m => m.id === moduleId
            ? {
              ...m, decks: m.decks.map(d => d.id === deckId
                ? { ...d, cards: d.cards.filter(c => c.id !== cardId) }
                : d
              )
            }
            : m
          )
        }
        : s
      )
    );
  }, []);

  // Export/Import
  const exportData = useCallback(() => {
    const data = { customSubjects, hiddenBuiltins, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberlearn-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [customSubjects, hiddenBuiltins]);

  const importData = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.customSubjects) setCustomSubjects(data.customSubjects);
          if (data.hiddenBuiltins) setHiddenBuiltins(data.hiddenBuiltins);
          resolve();
        } catch (err) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.readAsText(file);
    });
  }, []);

  // Mind map generation
  const generateMindMap = useCallback((subjectId) => {
    const subject = getSubject(subjectId);
    if (!subject) return null;
    return {
      id: subject.id,
      label: subject.title,
      color: subject.color,
      children: subject.modules.map(mod => ({
        id: mod.id,
        label: mod.title,
        color: mod.color || subject.color,
        children: mod.decks.map(deck => ({
          id: deck.id,
          label: deck.title,
          color: mod.color || subject.color,
          children: deck.cards.map(card => ({
            id: card.id,
            label: card.topic,
            color: mod.color || subject.color,
            children: []
          }))
        }))
      }))
    };
  }, [getSubject]);

  return (
    <SubjectsContext.Provider value={{
      subjects,
      customSubjects,
      hiddenBuiltins,
      builtinSubjects,
      getSubject,
      addSubject, updateSubject, deleteSubject,
      restoreBuiltin, restoreAllBuiltins,
      addModule, updateModule, deleteModule,
      addDeck, updateDeck, deleteDeck,
      addCard, updateCard, deleteCard,
      exportData, importData,
      generateMindMap,
    }}>
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const ctx = useContext(SubjectsContext);
  if (!ctx) throw new Error('useSubjects must be used within SubjectsProvider');
  return ctx;
}
