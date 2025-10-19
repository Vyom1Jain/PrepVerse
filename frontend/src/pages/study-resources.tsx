import React, { useState, useEffect } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'book' | 'tutorial' | 'documentation';
  category: string;
  url: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  rating: number;
  views: number;
  isFavorite: boolean;
}

const StudyResources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    difficulty: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Data Structures', 'Algorithms', 'System Design', 'GATE Preparation', 'Competitive Programming', 'Web Development'];
  const types = ['video', 'article', 'book', 'tutorial', 'documentation'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [resources, filters, searchQuery]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resources');
      const data = await response.json();
      setResources(data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...resources];

    if (filters.type !== 'all') {
      filtered = filtered.filter(r => r.type === filters.type);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(r => r.difficulty === filters.difficulty);
    }
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const toggleFavorite = async (resourceId: string) => {
    try {
      await fetch(`/api/resources/${resourceId}/favorite`, { method: 'POST' });
      setResources(resources.map(r => 
        r.id === resourceId ? {...r, isFavorite: !r.isFavorite} : r
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      video: '🎥',
      article: '📄',
      book: '📚',
      tutorial: '🎓',
      documentation: '📖'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <div className="study-resources">
      <header className="resources-header">
        <h1>Study Resources</h1>
        <p>Curated learning materials to help you excel</p>
      </header>

      <div className="search-section">
        <input 
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Type:</label>
          <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Difficulty:</label>
          <select value={filters.difficulty} onChange={(e) => setFilters({...filters, difficulty: e.target.value})}>
            <option value="all">All Levels</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>

        <button onClick={() => {
          setFilters({ type: 'all', category: 'all', difficulty: 'all' });
          setSearchQuery('');
        }}>
          Clear All Filters
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading resources...</div>
      ) : (
        <div className="resources-grid">
          {filteredResources.length === 0 ? (
            <div className="no-resources">No resources found matching your criteria</div>
          ) : (
            filteredResources.map(resource => (
              <div key={resource.id} className="resource-card">
                <div className="resource-header">
                  <span className="type-icon">{getTypeIcon(resource.type)}</span>
                  <button 
                    className={`favorite-btn ${resource.isFavorite ? 'active' : ''}`}
                    onClick={() => toggleFavorite(resource.id)}
                  >
                    {resource.isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>
                <h3>{resource.title}</h3>
                <p className="description">{resource.description}</p>
                <div className="resource-meta">
                  <span className="category">{resource.category}</span>
                  <span className={`difficulty ${resource.difficulty.toLowerCase()}`}>
                    {resource.difficulty}
                  </span>
                  {resource.duration && <span className="duration">{resource.duration}</span>}
                </div>
                <div className="resource-stats">
                  <span className="rating">⭐ {resource.rating.toFixed(1)}</span>
                  <span className="views">{resource.views} views</span>
                </div>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="view-btn">
                  View Resource
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudyResources;
