import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface GatePaper {
  id: string;
  year: number;
  subject: string;
  branch: string;
  paperType: 'Full' | 'Sectional';
  totalQuestions: number;
  duration: number;
  completed: boolean;
}

interface FilterOptions {
  year: string;
  subject: string;
  branch: string;
  completed: string;
}

const GATE: React.FC = () => {
  const [papers, setPapers] = useState<GatePaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    year: 'all',
    subject: 'all',
    branch: 'all',
    completed: 'all'
  });

  useEffect(() => {
    fetchPapers();
  }, [filters]);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/gate/papers', {
        params: filters
      });
      setPapers(response.data);
    } catch (error) {
      console.error('Error fetching GATE papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (paperId: string) => {
    try {
      const response = await axios.post(`/api/gate/papers/${paperId}/start`);
      window.location.href = `/test/${paperId}`;
    } catch (error) {
      console.error('Error starting test:', error);
    }
  };

  const handleViewSolutions = async (paperId: string) => {
    try {
      const response = await axios.get(`/api/gate/papers/${paperId}/solutions`);
      window.location.href = `/solutions/${paperId}`;
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setFilters({ ...filters, [filterType]: value });
  };

  if (loading && papers.length === 0) {
    return <div>Loading GATE papers...</div>;
  }

  return (
    <div className="gate-container">
      <h1>GATE Previous Year Papers</h1>
      
      <div className="filters">
        <div className="filter-group">
          <label>Year:</label>
          <select 
            value={filters.year} 
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option value="all">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Subject:</label>
          <select 
            value={filters.subject} 
            onChange={(e) => handleFilterChange('subject', e.target.value)}
          >
            <option value="all">All Subjects</option>
            <option value="Engineering Mathematics">Engineering Mathematics</option>
            <option value="General Aptitude">General Aptitude</option>
            <option value="Technical">Technical</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Branch:</label>
          <select 
            value={filters.branch} 
            onChange={(e) => handleFilterChange('branch', e.target.value)}
          >
            <option value="all">All Branches</option>
            <option value="CS">Computer Science</option>
            <option value="EC">Electronics & Communication</option>
            <option value="EE">Electrical Engineering</option>
            <option value="ME">Mechanical Engineering</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.completed} 
            onChange={(e) => handleFilterChange('completed', e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="papers-list">
        {papers.map(paper => (
          <div key={paper.id} className="paper-card">
            <h3>GATE {paper.year} - {paper.branch}</h3>
            <div className="paper-meta">
              <span className="subject">{paper.subject}</span>
              <span className="paper-type">{paper.paperType}</span>
              <span className="questions">{paper.totalQuestions} Questions</span>
              <span className="duration">{paper.duration} minutes</span>
              <span className={`status ${paper.completed ? 'completed' : 'pending'}`}>
                {paper.completed ? 'Completed' : 'Not Attempted'}
              </span>
            </div>
            <div className="paper-actions">
              <button onClick={() => handleStartTest(paper.id)}>
                {paper.completed ? 'Retake Test' : 'Start Test'}
              </button>
              {paper.completed && (
                <button onClick={() => handleViewSolutions(paper.id)}>
                  View Solutions
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GATE;
