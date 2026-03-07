import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SubjectsProvider } from './context/SubjectsContext';
import HomePage from './pages/HomePage';
import SubjectPage from './pages/SubjectPage';
import ModulePage from './pages/ModulePage';
import DeckPage from './pages/DeckPage';

export default function App() {
  return (
    <SubjectsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/subject/:subjectId/module/:moduleId" element={<ModulePage />} />
          <Route path="/subject/:subjectId/module/:moduleId/deck/:deckId" element={<DeckPage />} />
        </Routes>
      </BrowserRouter>
    </SubjectsProvider>
  );
}
