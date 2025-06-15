import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import allTopics from '../data/topics.json';
import './SearchBar.css';

const fuseOptions = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.4,
  keys: ['title', 'content', 'subsection'],
};

function SearchBar() {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const fuse = useMemo(() => new Fuse(allTopics, fuseOptions), []);
  const results = query ? fuse.search(query).slice(0, 10) : [];
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      navigate(`/topic/${results[activeIndex].item.slug}`);
      setQuery('');
    }
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a topic..."
        className="search-input"
        aria-label="Search for a topic"
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map(({ item }, index) => (
            <li key={item.slug} className={index === activeIndex ? 'active' : ''}>
              <Link to={`/topic/${item.slug}`} onClick={() => setQuery('')}>
                <span className="result-title">{item.title}</span>
                <span className="result-subsection">{item.subsection}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
