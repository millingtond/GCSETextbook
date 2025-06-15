import React, { useState, useMemo } from 'react';
import allTopics from '../data/topics.json';
import './GlossaryPage.css';

function GlossaryPage() {
  const [filter, setFilter] = useState('');

  const sortedTopics = useMemo(() => {
    return [...allTopics].sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const filteredTopics = sortedTopics.filter(topic => 
    topic.title.toLowerCase().includes(filter.toLowerCase()) ||
    topic.content.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="glossary-container">
      <h1>Glossary of Terms</h1>
      <p className="glossary-subtitle">A complete, filterable A-Z list of all key terms and concepts from the J277 specification.</p>
      
      <div className="filter-container">
        <input 
          type="text"
          className="glossary-filter-input"
          placeholder="Filter terms by keyword..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter glossary terms"
        />
      </div>

      <dl className="glossary-list">
        {filteredTopics.map(topic => (
          <React.Fragment key={topic.slug}>
            <dt>{topic.title}</dt>
            <dd>{topic.content.split('\\n').map((line, i) => <span key={i}>{line}<br/></span>)}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
}

export default GlossaryPage;
