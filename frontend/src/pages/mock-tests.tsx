import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface MockTest {
  id: string;
  title: string;
  description: string;
  category: 'DSA' | 'GATE' | 'Aptitude' | 'Subject';
  totalQuestions: number;
  duration: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  bestScore?: number;
}

interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  date: string;
}

const MockTests: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'available' | 'history'>('available');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchMockTests();
    fetchTestHistory();
  }, []);

  const fetchMockTests = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockData: MockTest[] = [
        {
          id: 't1',
          title: 'DSA Full Mock Test',
          description: 'Comprehensive test covering all DSA topics',
          category: 'DSA',
          totalQuestions: 50,
          duration: 90,
          difficulty: 'Medium',
          attempts: 2,
          bestScore: 75
        },
        {
          id: 't2',
          title: 'GATE CS Mock Test 1',
          description: 'Full-length GATE CS mock test',
          category: 'GATE',
          totalQuestions: 65,
          duration: 180,
          difficulty: 'Hard',
          attempts: 1,
          bestScore: 68
        },
        {
          id: 't3',
          title: 'Arrays & Strings Quiz',
          description: 'Focused practice on arrays and strings',
          category: 'DSA',
          totalQuestions: 30,
          duration: 45,
          difficulty: 'Easy',
          attempts: 0
        },
        {
          id: 't4',
          title: 'Operating Systems Mock',
          description: 'OS concepts and questions',
          category: 'Subject',
          totalQuestions: 40,
          duration: 60,
          difficulty: 'Medium',
          attempts: 3,
          bestScore: 82
        },
        {
          id: 't5',
          title: 'Quantitative Aptitude Test',
          description: 'Mathematical reasoning and aptitude',
          category: 'Aptitude',
          totalQuestions: 25,
          duration: 30,
          difficulty: 'Easy',
          attempts: 1,
          bestScore: 88
        }
      ];
      setTests(mockData);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestHistory = async () => {
    try {
      // TODO: Replace with actual API call
      const historyData: TestResult[] = [
        { testId: 't1', score: 75, totalQuestions: 50, timeTaken: 85, date: '2024-10-15' },
        { testId: 't2', score: 68, totalQuestions: 65, timeTaken: 175, date: '2024-10-12' },
        { testId: 't4', score: 82, totalQuestions: 40, timeTaken: 55, date: '2024-10-10' }
      ];
      setResults(historyData);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const startTest = (testId: string) => {
    navigate(`/mock-tests/${testId}/take`);
  };

  const filteredTests = filterCategory === 'all' 
    ? tests 
    : tests.filter(t => t.category === filterCategory);

  const getTestById = (id: string) => tests.find(t => t.id === id);

  if (loading) {
    return <div className="loading">Loading mock tests...</div>;
  }

  return (
    <div className="mock-tests">
      <header className="tests-header">
        <h1>🎯 Mock Tests</h1>
        <p>Practice with timed tests to evaluate your preparation</p>
      </header>

      <div className="view-tabs">
        <button 
          className={view === 'available' ? 'active' : ''}
          onClick={() => setView('available')}
        >
          Available Tests
        </button>
        <button 
          className={view === 'history' ? 'active' : ''}
          onClick={() => setView('history')}
        >
          Test History
        </button>
      </div>

      {view === 'available' && (
        <div className="available-tests">
          <div className="filters">
            <label>Category:</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="DSA">DSA</option>
              <option value="GATE">GATE</option>
              <option value="Subject">Subject Tests</option>
              <option value="Aptitude">Aptitude</option>
            </select>
          </div>

          <div className="tests-grid">
            {filteredTests.map(test => (
              <div key={test.id} className="test-card">
                <div className="test-header">
                  <span className={`category-badge ${test.category.toLowerCase()}`}>
                    {test.category}
                  </span>
                  <span className={`difficulty ${test.difficulty.toLowerCase()}`}>
                    {test.difficulty}
                  </span>
                </div>
                <h3>{test.title}</h3>
                <p>{test.description}</p>
                <div className="test-meta">
                  <div className="meta-item">
                    <span className="icon">📝</span>
                    <span>{test.totalQuestions} questions</span>
                  </div>
                  <div className="meta-item">
                    <span className="icon">⏱️</span>
                    <span>{test.duration} min</span>
                  </div>
                </div>
                {test.attempts > 0 && (
                  <div className="test-stats">
                    <span>Attempts: {test.attempts}</span>
                    <span>Best: {test.bestScore}%</span>
                  </div>
                )}
                <button 
                  onClick={() => startTest(test.id)}
                  className="start-test-btn"
                >
                  {test.attempts > 0 ? 'Retake Test' : 'Start Test'} ▶
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'history' && (
        <div className="test-history">
          <h2>Your Test History</h2>
          {results.length === 0 ? (
            <div className="no-history">
              <p>No test history available</p>
              <button onClick={() => setView('available')}>Take a Test</button>
            </div>
          ) : (
            <div className="history-list">
              {results.map((result, index) => {
                const test = getTestById(result.testId);
                if (!test) return null;
                
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                
                return (
                  <div key={index} className="history-item">
                    <div className="history-info">
                      <h3>{test.title}</h3>
                      <span className="test-date">{new Date(result.date).toLocaleDateString()}</span>
                    </div>
                    <div className="history-stats">
                      <div className="stat">
                        <span className="label">Score</span>
                        <span className="value">{result.score}/{result.totalQuestions}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Percentage</span>
                        <span className={`value ${percentage >= 75 ? 'good' : percentage >= 50 ? 'average' : 'poor'}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="stat">
                        <span className="label">Time</span>
                        <span className="value">{result.timeTaken} min</span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/mock-tests/${result.testId}/results`)} className="view-details-btn">
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MockTests;
