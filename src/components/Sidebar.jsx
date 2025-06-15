import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Sidebar.css';
import allTopics from '../data/topics.json';
import SearchBar from './SearchBar';

const sectionStructure = {
  "1": {
    title: "1: Computer systems",
    subsections: [
      "1.1 Systems architecture",
      "1.2 Memory and storage",
      "1.3 Computer networks, connections and protocols",
      "1.4 Network security",
      "1.5 Systems software",
      "1.6 Ethical, legal, cultural and environmental impacts of digital technology"
    ]
  },
  "2": {
    title: "2: Computational thinking, algorithms and programming",
    subsections: [
      "2.1 Algorithms",
      "2.2 Programming fundamentals",
      "2.3 Producing robust programs",
      "2.4 Boolean logic",
      "2.5 Programming languages and Integrated Development Environments"
    ]
  }
};


function Sidebar({ toggleTheme, currentTheme }) {
    const progress = useSelector((state) => state.progress);
    const [openSections, setOpenSections] = useState(() => {
        const saved = localStorage.getItem('openSections');
        return saved ? JSON.parse(saved) : ["1"];
    });

    useEffect(() => {
        localStorage.setItem('openSections', JSON.stringify(openSections));
    }, [openSections]);

    const toggleSection = (sectionKey) => {
        setOpenSections(prev => 
            prev.includes(sectionKey) ? prev.filter(key => key !== sectionKey) : [...prev, sectionKey]
        );
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <Link to="/" className="header-link"><h2>GCSE CS (J277)</h2></Link>
                <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle dark mode">
                    {currentTheme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
            <div className="dashboard-link-container">
              <Link to="/dashboard" className="dashboard-link">My Progress</Link>
              <Link to="/glossary" className="dashboard-link">Glossary</Link>
            </div>
            <SearchBar />
            <ul className="sidebar-menu">
            {Object.entries(sectionStructure).map(([sectionKey, sectionDetails]) => {
                const sectionTopics = allTopics.filter(t => t.section === sectionKey);
                const completedCount = sectionTopics.filter(t => progress[t.slug]?.completed).length;
                const percentage = sectionTopics.length > 0 ? (completedCount / sectionTopics.length) * 100 : 0;
                const isOpen = openSections.includes(sectionKey);

                return (
                    <li key={sectionKey} className="section-item">
                        <button onClick={() => toggleSection(sectionKey)} className="section-toggle">
                            <h3 className="section-title">{sectionDetails.title}</h3>
                            <span className={`chevron ${isOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        <progress max="100" value={percentage} className="section-progress-bar"></progress>
                        {isOpen && (
                            <ul className="subsection-menu">
                            {sectionDetails.subsections.map((subsection) => (
                                <li key={subsection}>
                                <h4 className="subsection-title">{subsection}</h4>
                                <ul className="topic-menu">
                                    {allTopics
                                    .filter((topic) => topic.subsection === subsection)
                                    .map((topic) => {
                                        const topicProgress = progress[topic.slug];
                                        const isCompleted = topicProgress?.completed;
                                        const ragStatus = topicProgress?.ragStatus || 'none';
                                        return (
                                            <li key={topic.slug}>
                                            <NavLink
                                                to={`/topic/${topic.slug}`}
                                                className={({ isActive }) =>
                                                `topic-link ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} rag-${ragStatus}`
                                                }
                                            >
                                                {topic.title}
                                            </NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                                </li>
                            ))}
                            </ul>
                        )}
                    </li>
                )})}
            </ul>
        </nav>
    );
}

export default Sidebar;
