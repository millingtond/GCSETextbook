import React from 'react';
import { Link } from 'react-router-dom';
import './HelpBanner.css';

function HelpBanner({ topic }) {
  if (!topic) return null;

  return (
    <aside className="help-banner" aria-labelledby="help-heading">
      <h4 id="help-heading">Struggling with <strong>{topic.title}</strong>? Try these:</h4>
      <ul>
        {topic.craigAndDaveVideoId && (
          <li>
            <a href={`https://www.youtube.com/watch?v=${topic.craigAndDaveVideoId}`} target="_blank" rel="noopener noreferrer">
              ▶️ Watch the Craig 'n' Dave video guide
            </a>
          </li>
        )}
        <li>
          <Link to="/glossary">📖 Review in the Glossary</Link>
        </li>
        {topic.notionPageUrl && (
             <li>
                <a href={topic.notionPageUrl} target="_blank" rel="noopener noreferrer">
                    📝 View Revision Notes on Notion
                </a>
             </li>
        )}
      </ul>
    </aside>
  );
}

export default HelpBanner;
