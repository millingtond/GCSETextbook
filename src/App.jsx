
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import CommandPalette from './components/CommandPalette';
import { useLocalStorage, useKeyboardShortcut } from './hooks/useCustomHooks';
import { CONSTANTS } from './utils/constants';
import './App.css';

function App() {
  const [isFocusMode, setFocusMode] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const HomePage = lazy(() => import('./pages/HomePage'));
const TopicPage = lazy(() => import('./pages/TopicPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme + '-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    document.body.classList.toggle('focus-mode-active', isFocusMode);
  }, [isFocusMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  return (
    <Router>
      <Sidebar toggleTheme={toggleTheme} currentTheme={theme} />
      <main className="content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topic/:slug" element={<TopicPage setFocusMode={setFocusMode} />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
          </Routes>
        </Suspense>
      </main>
      {isPaletteOpen && <CommandPalette setOpen={setPaletteOpen} />}
    </Router>
  );
}

export default App;
