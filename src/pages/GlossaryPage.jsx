import React, { useState, useMemo } from 'react';
import allTopics from '../data/topics.json';
import { useDebounce, useDocumentTitle } from '../hooks/useCustomHooks';
import { CONSTANTS } from '../utils/constants';
import './GlossaryPage.css';

function GlossaryPage() {
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, CONSTANTS.SEARCH_DEBOUNCE_DELAY);
  
  useDocumentTitle('Glossary - GCSE Computer Science');

  const sortedTopics = useMemo(() => {
    return [...allTopics].sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const filteredTopics = useMemo(() => {
    if (!debouncedFilter) return sortedTopics;
    
    const lowerFilter = debouncedFilter.toLowerCase();
    return sortedTopics.filter(topic => 
      topic.title.toLowerCase().includes(lowerFilter) ||
      topic.content.toLowerCase().includes(lowerFilter)
    );
  }, [sortedTopics, debouncedFilter]);

  // Group topics by first letter for better navigation
  const groupedTopics = useMemo(() => {
    const groups = {};
    filteredTopics.forEach(topic => {
      const firstLetter = topic.title[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(topic);
    });
    return groups;
  }, [filteredTopics]);

  const renderContent = (content) => {
    return content.split('\\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="glossary-container">
      <h1>Glossary of Terms</h1>
      <p className="glossary-subtitle">
        A complete, filterable A-Z list of all key terms and concepts from the J277 specification.
      </p>
      
      <div className="filter-container">
        <input 
          type="text"
          className="glossary-filter-input"
          placeholder="Filter terms by keyword..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter glossary terms"
        />
        {filter && (
          <div className="filter-status" aria-live="polite">
            Found {filteredTopics.length} term{filteredTopics.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {Object.keys(groupedTopics).length > 0 ? (
        <div className="glossary-groups">
          {Object.keys(groupedTopics).sort().map(letter => (
            <section key={letter} className="glossary-group">
              <h2 className="group-letter">{letter}</h2>
              <dl className="glossary-list">
                {groupedTopics[letter].map(topic => (
                  <React.Fragment key={topic.slug}>
                    <dt id={`term-${topic.slug}`}>{topic.title}</dt>
                    <dd>{renderContent(topic.content)}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No terms found matching "{filter}"</p>
        </div>
      )}
    </div>
  );
}