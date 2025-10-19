import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ProgressOverview {
  totalProblems: number;
  solvedProblems: number;
  easyProblems: { total: number; solved: number };
  mediumProblems: { total: number; solved: number };
  hardProblems: { total: number; solved: number };
  streakDays: number;
  weeklyStats: {
    problemsSolved: number;
    hoursSpent: number;
    averageAccuracy: number;
  };
}

interface TopicProgress {
  topic: string;
  total: number;
  solved: number;
  percentage: number;
}

interface TimelineEntry {
  date: string;
  problemsSolved: number;
  timeSpent: number;
}

const ProgressTracker: React.FC = () => {
  const [progress, setProgress] = useState<ProgressOverview | null>(null);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'topics' | 'timeline'>('overview');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [overviewRes, timelineRes] = await Promise.all([
        fetch('/api/progress/overview'),
        fetch('/api/progress/timeline?days=30')
      ]);
      const overviewData = await overviewRes.json();
      const timelineData = await timelineRes.json();
      
      setProgress(overviewData);
      setTopicProgress(overviewData.topicWiseProgress || []);
      setTimeline(timelineData.timeline || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (solved: number, total: number) => {
    return total > 0 ? Math.round((solved / total) * 100) : 0;
  };

  if (loading) {
    return <div className="loading">Loading progress...</div>;
  }

  if (!progress) {
    return <div className="error">Failed to load progress data</div>;
  }

  return (
    <div className="progress-tracker">
      <header className="tracker-header">
        <h1>📊 Progress Tracker</h1>
        <p>Track your learning journey and achievements</p>
      </header>

      <div className="view-tabs">
        <button 
          className={view === 'overview' ? 'active' : ''}
          onClick={() => setView('overview')}
        >
          Overview
        </button>
        <button 
          className={view === 'topics' ? 'active' : ''}
          onClick={() => setView('topics')}
        >
          Topics
        </button>
        <button 
          className={view === 'timeline' ? 'active' : ''}
          onClick={() => setView('timeline')}
        >
          Timeline
        </button>
      </div>

      {view === 'overview' && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Problems</h3>
              <div className="stat-value">{progress.solvedProblems} / {progress.totalProblems}</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${calculatePercentage(progress.solvedProblems, progress.totalProblems)}%` }}
                />
              </div>
            </div>

            <div className="stat-card easy">
              <h3>Easy</h3>
              <div className="stat-value">{progress.easyProblems.solved} / {progress.easyProblems.total}</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${calculatePercentage(progress.easyProblems.solved, progress.easyProblems.total)}%` }}
                />
              </div>
            </div>

            <div className="stat-card medium">
              <h3>Medium</h3>
              <div className="stat-value">{progress.mediumProblems.solved} / {progress.mediumProblems.total}</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${calculatePercentage(progress.mediumProblems.solved, progress.mediumProblems.total)}%` }}
                />
              </div>
            </div>

            <div className="stat-card hard">
              <h3>Hard</h3>
              <div className="stat-value">{progress.hardProblems.solved} / {progress.hardProblems.total}</div>
              <div className="stat-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${calculatePercentage(progress.hardProblems.solved, progress.hardProblems.total)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="weekly-stats">
            <h2>This Week</h2>
            <div className="week-grid">
              <div className="week-stat">
                <span className="label">Problems Solved</span>
                <span className="value">{progress.weeklyStats.problemsSolved}</span>
              </div>
              <div className="week-stat">
                <span className="label">Hours Spent</span>
                <span className="value">{progress.weeklyStats.hoursSpent}h</span>
              </div>
              <div className="week-stat">
                <span className="label">Avg. Accuracy</span>
                <span className="value">{progress.weeklyStats.averageAccuracy}%</span>
              </div>
              <div className="week-stat streak">
                <span className="label">🔥 Streak</span>
                <span className="value">{progress.streakDays} days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'topics' && (
        <div className="topics-section">
          <h2>Topic-wise Progress</h2>
          <div className="topics-list">
            {topicProgress.map(topic => (
              <div key={topic.topic} className="topic-item">
                <div className="topic-header">
                  <h3>{topic.topic}</h3>
                  <span className="topic-score">{topic.solved} / {topic.total}</span>
                </div>
                <div className="topic-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${topic.percentage}%` }}
                  />
                  <span className="percentage">{topic.percentage}%</span>
                </div>
                <Link to={`/progress/topic/${topic.topic}`} className="view-details">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'timeline' && (
        <div className="timeline-section">
          <h2>30-Day Activity</h2>
          <div className="timeline-chart">
            {timeline.map(entry => (
              <div key={entry.date} className="timeline-day">
                <div 
                  className="activity-bar" 
                  style={{ height: `${Math.min((entry.problemsSolved / 10) * 100, 100)}%` }}
                  title={`${entry.date}: ${entry.problemsSolved} problems, ${entry.timeSpent} min`}
                />
                <span className="date-label">{new Date(entry.date).getDate()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="actions">
        <Link to="/progress/achievements" className="btn-secondary">
          View Achievements
        </Link>
        <Link to="/progress/insights" className="btn-primary">
          Get Insights
        </Link>
      </div>
    </div>
  );
};

export default ProgressTracker;
