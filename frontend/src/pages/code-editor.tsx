import React, { useState } from 'react';
import axios from 'axios';

interface CodeEditorProps {
  questionId?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ questionId }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/code/run', {
        code,
        questionId,
        language: 'javascript'
      });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error running code');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/code/submit', {
        code,
        questionId,
        language: 'javascript'
      });
      setOutput(response.data.message);
    } catch (error) {
      console.error('Error submitting code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-editor-container">
      <h1>Code Editor</h1>
      <div className="editor-section">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          rows={20}
          cols={80}
        />
      </div>
      <div className="actions">
        <button onClick={handleRunCode} disabled={loading}>
          {loading ? 'Running...' : 'Run Code'}
        </button>
        <button onClick={handleSubmitCode} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Code'}
        </button>
      </div>
      <div className="output-section">
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
