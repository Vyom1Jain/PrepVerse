import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Suggestion {
  id: string;
  text: string;
  category: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI study assistant. I can help you with DSA concepts, problem-solving strategies, GATE preparation, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions: Suggestion[] = [
    { id: '1', text: 'Explain binary search', category: 'Concept' },
    { id: '2', text: 'How to approach dynamic programming?', category: 'Strategy' },
    { id: '3', text: 'Best resources for GATE preparation', category: 'Resources' },
    { id: '4', text: 'Tips for solving graph problems', category: 'Tips' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          history: messages.slice(-5) // Send last 5 messages for context
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Chat cleared. How can I help you?',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="ai-assistant">
      <header className="assistant-header">
        <div className="header-content">
          <h1>🤖 AI Study Assistant</h1>
          <p>Ask me anything about DSA, algorithms, or GATE preparation</p>
        </div>
        <button onClick={clearChat} className="clear-btn">Clear Chat</button>
      </header>

      <div className="chat-container">
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="suggestions">
            <h3>Quick Suggestions</h3>
            <div className="suggestions-grid">
              {suggestions.map(suggestion => (
                <button 
                  key={suggestion.id}
                  className="suggestion-card"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  <span className="category">{suggestion.category}</span>
                  <span className="text">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here..."
          rows={1}
          disabled={isLoading}
        />
        <button 
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="send-btn"
        >
          {isLoading ? 'Sending...' : 'Send ➤'}
        </button>
      </div>

      <div className="assistant-footer">
        <small>AI responses are generated and may not always be accurate. Please verify important information.</small>
      </div>
    </div>
  );
};

export default AIAssistant;
