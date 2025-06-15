import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import allTopics from '../data/topics.json';
import ProgressTracker from '../components/ProgressTracker';
import PyodideRunner from '../components/PyodideRunner';
import HelpBanner from '../components/HelpBanner';
import { useSelector } from 'react-redux';
import './TopicPage.css';

const renderContent = (content) => {
  const elements = [];
  const lines = content.split('\\n').filter(line => line.trim() !== '');
  let currentListItems = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
      currentListItems.push(
        <li key={`item-${index}`}>{trimmedLine.substring(1).trim()}</li>
      );
    } else {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`}>{currentListItems}</ul>
        );
        currentListItems = [];
      }
      elements.push(<p key={`para-${elements.length}`}>{trimmedLine}</p>);
    }
  });

  // If the content ends with a list
  if (currentListItems.length > 0) {
    elements.push(
      <ul key={`list-${elements.length}`}>{currentListItems}</ul>
    );
  }

  return elements;
};

function TopicPage({ setFocusMode }) {
  const { slug } = useParams();
  const topic = allTopics.find((t) => t.slug === slug);
  const progress = useSelector(state => state.progress[slug]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (topic) {
      document.title = `GCSE CS | ${topic.title}`;
      localStorage.setItem('lastVisitedTopic', `/topic/${slug}`);
    }
  }, [topic, slug]);

  useEffect(() => {
    if (progress?.ragStatus === 'red') {
      setShowHelp(true);
    } else {
      setShowHelp(false);
    }
  }, [progress]);

  const copyToMarkdown = () => {
    const markdown = `# ${topic.title}\\n\\n${topic.content}`;
    navigator.clipboard.writeText(markdown);
  }

  if (!topic) {
    return <div><h2>Topic not found!</h2></div>;
  }

  const showCodeRunner = topic.subsection === "2.2 Programming fundamentals";

  return (
    <div className="topic-container">
      <div className="topic-header">
        <h1>{topic.title}</h1>
        <div className="topic-actions">
           <button onClick={copyToMarkdown} className="topic-action-btn" aria-label="Copy as Markdown">📝</button>
           <button onClick={() => setFocusMode(prev => !prev)} className="topic-action-btn" aria-label="Toggle Focus Mode">👁️</button>
        </div>
      </div>
      <ProgressTracker slug={slug} />
      <hr className="topic-divider" />
      <div className="content-body">
        {renderContent(topic.content)}
      </div>
      
      {showHelp && <HelpBanner topic={topic} />}

      {topic.craigAndDaveVideoId && (
        <div className="resource-section">
            <h3>Video Guide: Craig 'n' Dave</h3>
            <div className="video-container">
              <iframe src={`https://www.youtube-nocookie.com/embed/${topic.craigAndDaveVideoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        </div>
      )}

      {topic.notionPageUrl && (
         <div className="resource-section">
            <h3><a href={topic.notionPageUrl} target="_blank" rel="noopener noreferrer">View Detailed Revision Notes on Notion</a></h3>
         </div>
      )}
      
      {showCodeRunner && <PyodideRunner />}
    </div>
  );
}

export default TopicPage;
