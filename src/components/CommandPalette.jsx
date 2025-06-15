import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import allTopics from '../data/topics.json';
import './CommandPalette.css';

const fuseOptions = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.4,
  keys: ['title', 'subsection'],
};

function CommandPalette({ setOpen }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const fuse = useMemo(() => new Fuse(allTopics, fuseOptions), []);
  const navigate = useNavigate();
  const paletteRef = useRef(null);
  const inputRef = useRef(null);

  const staticCommands = [
    { name: 'Go to Dashboard', action: () => navigate('/dashboard'), slug: 'cmd-dashboard' },
    { name: 'Go to Glossary', action: () => navigate('/glossary'), slug: 'cmd-glossary' },
  ];

  const results = useMemo(() => {
    if (!query) return staticCommands.map(cmd => ({ item: { title: cmd.name, subsection: 'Action', slug: cmd.slug, action: cmd.action } }));
    const topicResults = fuse.search(query).map(res => res);
    return topicResults.slice(0, 7);
  }, [query, fuse]);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = results[activeIndex];
        if (selected) {
          if (selected.item.action) {
            selected.item.action();
          } else {
            navigate(`/topic/${selected.item.slug}`);
          }
          setOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, activeIndex, navigate, setOpen]);

  return (
    <div className="command-palette-overlay" onClick={() => setOpen(false)}>
      <div className="command-palette" ref={paletteRef} onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          placeholder="Search topics or run commands..."
          className="palette-input"
        />
        <ul className="palette-results">
          {results.map((result, index) => (
            <li key={result.item.slug} className={index === activeIndex ? 'active' : ''}>
              <button onClick={() => {
                if(result.item.action) result.item.action();
                else navigate(`/topic/${result.item.slug}`);
                setOpen(false);
              }}>
                <span className="result-title">{result.item.title}</span>
                <span className="result-subsection">{result.item.subsection}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CommandPalette;
