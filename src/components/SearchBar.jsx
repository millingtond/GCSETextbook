import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import allTopics from '../data/topics.json';
import { useDebounce, useOnClickOutside } from '../hooks/useCustomHooks';
import { FUSE_OPTIONS, CONSTANTS } from '../utils/constants';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, CONSTANTS.SEARCH_DEBOUNCE_DELAY);
  const fuse = useMemo(() => new Fuse(allTopics, FUSE_OPTIONS), []);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Calculate results based on debounced query
  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    try {
      return fuse.search(debouncedQuery).slice(0, CONSTANTS.MAX_SEARCH_RESULTS);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, [debouncedQuery, fuse]);

  // Use custom hook for outside clicks
  useOnClickOutside(searchContainerRef, () => {
    setQuery('');
    setActiveIndex(-1);
  });

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      navigate(`/topic/${results[activeIndex].item.slug}`);
      setQuery('');
      setActiveIndex(-1);
    } else if (e.key === 'Escape') {
      setQuery('');
      setActiveIndex(-1);
    }
  };

  const handleResultClick = (slug) => {
    setQuery('');
    setActiveIndex(-1);
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
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
      />
      {results.length > 0 && (
        <ul className="search-results" id="search-results" role="listbox">
          {results.map(({ item }, index) => (
            <li 
              key={item.slug} 
              id={`search-result-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'active' : ''}
            >
              <Link 
                to={`/topic/${item.slug}`} 
                onClick={() => handleResultClick(item.slug)}
                tabIndex={-1}
              >
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