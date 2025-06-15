import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import DashboardPage from './pages/DashboardPage';
import GlossaryPage from './pages/GlossaryPage';
import CommandPalette from './components/CommandPalette';
import './App.css';

function App() {
  const [isFocusMode, setFocusMode] = useState(false);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:slug" element={<TopicPage setFocusMode={setFocusMode} />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </main>
      {isPaletteOpen && <CommandPalette setOpen={setPaletteOpen} />}
    </Router>
  );
}

export default App;
