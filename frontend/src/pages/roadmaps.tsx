import React, { useState } from 'react';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  completed: boolean;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  steps: RoadmapStep[];
}

const Roadmaps: React.FC = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);

  const roadmaps: Roadmap[] = [
    {
      id: 'dsa-beginner',
      title: 'DSA Beginner Roadmap',
      description: 'Complete guide for beginners to master Data Structures and Algorithms',
      level: 'Beginner',
      duration: '3 months',
      steps: [
        {
          id: 's1',
          title: 'Programming Fundamentals',
          description: 'Master basic programming concepts and syntax',
          duration: '2 weeks',
          topics: ['Variables', 'Loops', 'Functions', 'Arrays'],
          completed: true
        },
        {
          id: 's2',
          title: 'Basic Data Structures',
          description: 'Learn fundamental data structures',
          duration: '4 weeks',
          topics: ['Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues'],
          completed: false
        },
        {
          id: 's3',
          title: 'Basic Algorithms',
          description: 'Understand essential algorithms',
          duration: '4 weeks',
          topics: ['Sorting', 'Searching', 'Recursion', 'Two Pointers'],
          completed: false
        },
        {
          id: 's4',
          title: 'Practice & Projects',
          description: 'Apply your knowledge',
          duration: '2 weeks',
          topics: ['LeetCode Easy', 'Mini Projects'],
          completed: false
        }
      ]
    },
    {
      id: 'dsa-advanced',
      title: 'DSA Advanced Roadmap',
      description: 'Advanced topics for competitive programming and interviews',
      level: 'Advanced',
      duration: '6 months',
      steps: [
        {
          id: 'a1',
          title: 'Advanced Data Structures',
          description: 'Master complex data structures',
          duration: '6 weeks',
          topics: ['Trees', 'Graphs', 'Heaps', 'Tries', 'Segment Trees'],
          completed: false
        },
        {
          id: 'a2',
          title: 'Dynamic Programming',
          description: 'Learn DP patterns and techniques',
          duration: '8 weeks',
          topics: ['Memoization', 'Tabulation', 'DP Patterns', 'State Optimization'],
          completed: false
        },
        {
          id: 'a3',
          title: 'Graph Algorithms',
          description: 'Advanced graph traversal and algorithms',
          duration: '6 weeks',
          topics: ['DFS/BFS', 'Dijkstra', 'Floyd-Warshall', 'MST'],
          completed: false
        },
        {
          id: 'a4',
          title: 'Competitive Programming',
          description: 'Advanced problem-solving techniques',
          duration: '6 weeks',
          topics: ['Greedy', 'Bit Manipulation', 'Math', 'String Algorithms'],
          completed: false
        }
      ]
    },
    {
      id: 'gate-cs',
      title: 'GATE CS Preparation Roadmap',
      description: 'Complete roadmap for GATE Computer Science preparation',
      level: 'Intermediate',
      duration: '8 months',
      steps: [
        {
          id: 'g1',
          title: 'Core Subjects - Phase 1',
          description: 'Foundation subjects',
          duration: '8 weeks',
          topics: ['Programming & DSA', 'Digital Logic', 'Computer Organization'],
          completed: false
        },
        {
          id: 'g2',
          title: 'Core Subjects - Phase 2',
          description: 'System subjects',
          duration: '8 weeks',
          topics: ['Operating Systems', 'DBMS', 'Computer Networks'],
          completed: false
        },
        {
          id: 'g3',
          title: 'Theory Subjects',
          description: 'Theoretical computer science',
          duration: '8 weeks',
          topics: ['TOC', 'Compiler Design', 'Discrete Mathematics'],
          completed: false
        },
        {
          id: 'g4',
          title: 'Mathematics & Aptitude',
          description: 'Quantitative and analytical skills',
          duration: '4 weeks',
          topics: ['Linear Algebra', 'Probability', 'Verbal Ability'],
          completed: false
        },
        {
          id: 'g5',
          title: 'Revision & Mock Tests',
          description: 'Final preparation phase',
          duration: '8 weeks',
          topics: ['Previous Years', 'Mock Tests', 'Weak Topics'],
          completed: false
        }
      ]
    },
    {
      id: 'web-dev',
      title: 'Full Stack Development Roadmap',
      description: 'Become a full-stack web developer',
      level: 'Beginner to Intermediate',
      duration: '6 months',
      steps: [
        {
          id: 'w1',
          title: 'Frontend Basics',
          description: 'HTML, CSS, JavaScript fundamentals',
          duration: '6 weeks',
          topics: ['HTML5', 'CSS3', 'JavaScript ES6+', 'DOM Manipulation'],
          completed: false
        },
        {
          id: 'w2',
          title: 'Frontend Framework',
          description: 'Learn React.js',
          duration: '8 weeks',
          topics: ['React Basics', 'Hooks', 'State Management', 'Routing'],
          completed: false
        },
        {
          id: 'w3',
          title: 'Backend Development',
          description: 'Server-side programming',
          duration: '8 weeks',
          topics: ['Node.js', 'Express.js', 'REST APIs', 'Authentication'],
          completed: false
        },
        {
          id: 'w4',
          title: 'Database & Deployment',
          description: 'Data persistence and hosting',
          duration: '4 weeks',
          topics: ['MongoDB', 'SQL', 'Git', 'Cloud Deployment'],
          completed: false
        }
      ]
    }
  ];

  const getRoadmap = (id: string) => roadmaps.find(r => r.id === id);

  return (
    <div className="roadmaps">
      <header className="roadmaps-header">
        <h1>🗺️ Learning Roadmaps</h1>
        <p>Structured learning paths to guide your journey</p>
      </header>

      {!selectedRoadmap ? (
        <div className="roadmaps-grid">
          {roadmaps.map(roadmap => (
            <div key={roadmap.id} className="roadmap-card">
              <div className="roadmap-badge">{roadmap.level}</div>
              <h2>{roadmap.title}</h2>
              <p>{roadmap.description}</p>
              <div className="roadmap-meta">
                <span>⏱️ {roadmap.duration}</span>
                <span>📖 {roadmap.steps.length} steps</span>
              </div>
              <button 
                onClick={() => setSelectedRoadmap(roadmap.id)}
                className="view-roadmap-btn"
              >
                View Roadmap →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="roadmap-detail">
          {(() => {
            const roadmap = getRoadmap(selectedRoadmap);
            if (!roadmap) return null;

            const completedSteps = roadmap.steps.filter(s => s.completed).length;
            const progress = Math.round((completedSteps / roadmap.steps.length) * 100);

            return (
              <>
                <button 
                  onClick={() => setSelectedRoadmap(null)}
                  className="back-btn"
                >
                  ← Back to Roadmaps
                </button>

                <div className="roadmap-header">
                  <h2>{roadmap.title}</h2>
                  <span className="level-badge">{roadmap.level}</span>
                </div>

                <p className="roadmap-description">{roadmap.description}</p>

                <div className="progress-section">
                  <div className="progress-info">
                    <span>Progress: {completedSteps}/{roadmap.steps.length} steps</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="steps-timeline">
                  {roadmap.steps.map((step, index) => (
                    <div key={step.id} className={`step-item ${step.completed ? 'completed' : ''}`}>
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <div className="step-header">
                          <h3>{step.title}</h3>
                          <span className="duration">{step.duration}</span>
                        </div>
                        <p>{step.description}</p>
                        <div className="topics">
                          {step.topics.map(topic => (
                            <span key={topic} className="topic-tag">{topic}</span>
                          ))}
                        </div>
                        {step.completed && <span className="completed-badge">✓ Completed</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
