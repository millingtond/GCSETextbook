import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleComplete, setRagStatus, updateRevisionDate } from '../state/progressSlice';
import './ProgressTracker.css';

const RAG_BUTTONS = [
  { status: 'red', label: 'Not Confident', days: 1 },
  { status: 'amber', label: 'Needs Review', days: 3 },
  { status: 'green', label: 'Confident', days: 7 },
];

function ProgressTracker({ slug }) {
  const dispatch = useDispatch();
  const topicProgress = useSelector((state) => state.progress[slug]) || {
    completed: false,
    ragStatus: 'none',
  };

  const handleRagClick = (status, days) => {
    dispatch(setRagStatus({ slug, status }));
    
    // Set next revision date for spaced repetition
    const today = new Date();
    const nextRevision = new Date(today.setDate(today.getDate() + days));
    dispatch(updateRevisionDate({ slug, nextRevisionDate: nextRevision.toISOString() }));
  };

  return (
    <div className="progress-tracker" role="group" aria-labelledby="progress-heading">
      <div className="completion-toggle">
        <input
          type="checkbox"
          id="complete-checkbox"
          checked={topicProgress.completed}
          onChange={() => dispatch(toggleComplete(slug))}
        />
        <label htmlFor="complete-checkbox">Mark as Complete</label>
      </div>
      <div className="rag-selector">
        <span id="progress-heading">My confidence level:</span>
        {RAG_BUTTONS.map(({ status, label, days }) => (
          <button
            key={status}
            aria-label={label}
            className={`rag-btn ${status} ${topicProgress.ragStatus === status ? 'active' : ''}`}
            onClick={() => handleRagClick(status, days)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProgressTracker;
