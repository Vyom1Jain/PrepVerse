import React, { useState, useEffect } from 'react';

interface GatePaper {
  id: string;
  year: number;
  subject: string;
  branch: string;
  paperType: 'Set A' | 'Set B' | 'Set C';
  pdfUrl: string;
  solutionUrl?: string;
  downloads: number;
}

const GatePapers: React.FC = () => {
  const [papers, setPapers] = useState<GatePaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: 'all',
    subject: 'all',
    branch: 'all'
  });

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const subjects = ['Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil'];
  const branches = ['CS', 'EC', 'EE', 'ME', 'CE', 'IN'];

  useEffect(() => {
    fetchPapers();
  }, [filters]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.year !== 'all') queryParams.append('year', filters.year);
      if (filters.subject !== 'all') queryParams.append('subject', filters.subject);
      if (filters.branch !== 'all') queryParams.append('branch', filters.branch);
      
      const response = await fetch(`/api/gate-papers?${queryParams.toString()}`);
      const data = await response.json();
      setPapers(data.papers);
    } catch (error) {
      console.error('Error fetching GATE papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (paperId: string, url: string) => {
    try {
      await fetch(`/api/gate-papers/${paperId}/download`, { method: 'POST' });
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading paper:', error);
    }
  };

  return (
    <div className="gate-papers">
      <div className="header">
        <h1>GATE Previous Year Papers</h1>
        <p>Access previous year GATE question papers with solutions</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Year:</label>
          <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Subject:</label>
          <select value={filters.subject} onChange={(e) => setFilters({...filters, subject: e.target.value})}>
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Branch:</label>
          <select value={filters.branch} onChange={(e) => setFilters({...filters, branch: e.target.value})}>
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>

        <button onClick={() => setFilters({ year: 'all', subject: 'all', branch: 'all' })}>
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading papers...</div>
      ) : (
        <div className="papers-grid">
          {papers.length === 0 ? (
            <div className="no-papers">No papers found matching your criteria</div>
          ) : (
            papers.map(paper => (
              <div key={paper.id} className="paper-card">
                <div className="paper-info">
                  <h3>{paper.subject} - {paper.year}</h3>
                  <p>Branch: {paper.branch} | {paper.paperType}</p>
                  <p className="downloads">{paper.downloads} downloads</p>
                </div>
                <div className="paper-actions">
                  <button 
                    onClick={() => handleDownload(paper.id, paper.pdfUrl)}
                    className="download-btn"
                  >
                    Download Paper
                  </button>
                  {paper.solutionUrl && (
                    <button 
                      onClick={() => handleDownload(paper.id, paper.solutionUrl!)}
                      className="solution-btn"
                    >
                      Download Solution
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GatePapers;
