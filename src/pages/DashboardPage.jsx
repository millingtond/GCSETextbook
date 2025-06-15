import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import allTopics from '../data/topics.json';
import RagChart from '../components/charts/RagChart';
import './DashboardPage.css';

function DashboardPage() {
  const progress = useSelector((state) => state.progress);
  const totalTopics = allTopics.length;
  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    let completedTopics = 0;
    const ragCounts = { red: 0, amber: 0, green: 0, none: 0 };
    const topicsToReview = { red: [], amber: [] };
    const revisionQueue = [];

    for (const topic of allTopics) {
        const p = progress[topic.slug];
        if (p?.completed) completedTopics++;
        
        const status = p?.ragStatus || 'none';
        ragCounts[status]++;
        
        if (status === 'red') topicsToReview.red.push(topic);
        if (status === 'amber') topicsToReview.amber.push(topic);

        if (p?.nextRevision && p.nextRevision.split('T')[0] <= today) {
            revisionQueue.push(topic);
        }
    }

    return {
        completedTopics,
        completionPercentage: totalTopics > 0 ? ((completedTopics / totalTopics) * 100).toFixed(0) : 0,
        ragCounts,
        topicsToReview,
        revisionQueue,
    }
  }, [progress, today]);

  const exportToCSV = () => {
      const topicsToExport = [...stats.topicsToReview.red, ...stats.topicsToReview.amber];
      if(topicsToExport.length === 0) return;

      const headers = '"Term","Definition"';
      const rows = topicsToExport.map(t => `"${t.title.replace(/"/g, '""')}","${t.content.replace(/"/g, '""')}"`);
      const csvContent = `${headers}\\n${rows.join('\\n')}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "revision_flashcards.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  return (
    <div className="dashboard-container">
      <h1>My Progress Dashboard</h1>
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Topics Completed</h3>
          <p className="stat-number">{stats.completedTopics} / {totalTopics}</p>
          <p className="stat-percentage">{stats.completionPercentage}% Complete</p>
        </div>
        <div className="stat-card chart-card">
          <h3>Confidence Levels</h3>
          <RagChart counts={stats.ragCounts} />
        </div>
        <div className="stat-card revision-queue-card">
            <h3>Today's Revision Queue ({stats.revisionQueue.length})</h3>
            <ul>
                {stats.revisionQueue.length > 0 ? (
                    stats.revisionQueue.map(t => <li key={t.slug}><Link to={`/topic/${t.slug}`}>{t.title}</Link></li>)
                ) : <p>All caught up for today!</p>}
            </ul>
        </div>
        <div className="stat-card revision-list-card">
          <h3>Your Revision List <button onClick={exportToCSV} className="csv-btn">Export CSV</button></h3>
          <h4>Not Confident (Red)</h4>
          <ul>
            {stats.topicsToReview.red.length > 0 ? (
                stats.topicsToReview.red.map(topic => <li key={topic.slug}><Link to={`/topic/${topic.slug}`}>{topic.title}</Link></li>)
            ) : <p>None! Great job!</p>}
          </ul>
           <h4>Needs Review (Amber)</h4>
          <ul>
            {stats.topicsToReview.amber.length > 0 ? (
                stats.topicsToReview.amber.map(topic => <li key={topic.slug}><Link to={`/topic/${topic.slug}`}>{topic.title}</Link></li>)
            ) : <p>None! Great job!</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
