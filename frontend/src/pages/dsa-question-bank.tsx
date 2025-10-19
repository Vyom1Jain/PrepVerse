import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  solved: boolean;
  attempts: number;
}

const DSAQuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [filter, topicFilter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/questions?difficulty=${filter}&topic=${topicFilter}`);
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const topics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching'];

  return (
    <div className="dsa-question-bank">
      <div className="header">
        <h1>DSA Question Bank</h1>
        <div className="stats">
          <span>Total: {questions.length}</span>
          <span>Solved: {questions.filter(q => q.solved).length}</span>
        </div>
      </div>

      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
          <option value="all">All Topics</option>
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading questions...</div>
      ) : (
        <div className="questions-list">
          {questions.map(question => (
            <div key={question.id} className={`question-item ${question.solved ? 'solved' : ''}`}>
              <div className="question-info">
                <h3><Link to={`/questions/${question.id}`}>{question.title}</Link></h3>
                <div className="meta">
                  <span className={`difficulty ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
                  <span className="topic">{question.topic}</span>
                  {question.attempts > 0 && <span className="attempts">{question.attempts} attempts</span>}
                </div>
              </div>
              {question.solved && <span className="status">✓ Solved</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DSAQuestionBank;
