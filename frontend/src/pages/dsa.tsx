import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DSAQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  solved: boolean;
}

interface FilterOptions {
  difficulty: string;
  category: string;
  solved: string;
}

const DSA: React.FC = () => {
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    difficulty: 'all',
    category: 'all',
    solved: 'all'
  });

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/dsa/questions', {
        params: filters
      });
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching DSA questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSolveQuestion = async (questionId: string) => {
    try {
      await axios.post(`/api/dsa/questions/${questionId}/solve`);
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, solved: true } : q
      ));
    } catch (error) {
      console.error('Error marking question as solved:', error);
    }
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setFilters({ ...filters, [filterType]: value });
  };

  if (loading && questions.length === 0) {
    return <div>Loading DSA questions...</div>;
  }

  return (
    <div className="dsa-container">
      <h1>DSA Question Bank</h1>
      
      <div className="filters">
        <div className="filter-group">
          <label>Difficulty:</label>
          <select 
            value={filters.difficulty} 
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="all">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All</option>
            <option value="Array">Array</option>
            <option value="String">String</option>
            <option value="Tree">Tree</option>
            <option value="Graph">Graph</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.solved} 
            onChange={(e) => handleFilterChange('solved', e.target.value)}
          >
            <option value="all">All</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
        </div>
      </div>

      <div className="questions-list">
        {questions.map(question => (
          <div key={question.id} className="question-card">
            <h3>{question.title}</h3>
            <div className="question-meta">
              <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
                {question.difficulty}
              </span>
              <span className="category">{question.category}</span>
              <span className={`status ${question.solved ? 'solved' : 'unsolved'}`}>
                {question.solved ? 'Solved' : 'Unsolved'}
              </span>
            </div>
            <p>{question.description}</p>
            <div className="question-actions">
              <button onClick={() => window.location.href = `/code-editor?question=${question.id}`}>
                Solve
              </button>
              {!question.solved && (
                <button onClick={() => handleSolveQuestion(question.id)}>
                  Mark as Solved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSA;
