# API Integration Guide for PrepVerse Frontend Pages

This guide demonstrates how to connect all frontend pages to backend API endpoints using Axios.

## Setup

All pages use the centralized API client located at `src/utils/api.js`. This client handles:
- Base URL configuration
- Authentication tokens
- Request/response interceptors
- Error handling

## API Structure Overview

### Base Configuration (src/utils/api.js)
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

## Page-by-Page API Integration

### 1. Login Page (login.tsx)

**Endpoints:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset

**Example Usage:**
```typescript
import axios from 'axios';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    // Redirect to dashboard
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### 2. Dashboard Page (dashboard.tsx)

**Endpoints:**
- `GET /api/dashboard/stats` - Get user statistics
- `GET /api/dashboard/recent-activity` - Get recent activities
- `GET /api/dashboard/progress` - Get learning progress
- `GET /api/dashboard/recommendations` - Get personalized recommendations

**Example Usage:**
```typescript
import axios from 'axios';

useEffect(() => {
  const fetchDashboardData = async () => {
    const [stats, activity, progress] = await Promise.all([
      axios.get('/api/dashboard/stats'),
      axios.get('/api/dashboard/recent-activity'),
      axios.get('/api/dashboard/progress')
    ]);
    setStats(stats.data);
    setActivity(activity.data);
    setProgress(progress.data);
  };
  fetchDashboardData();
}, []);
```

### 3. Planner Page (planner.tsx)

**Endpoints:**
- `GET /api/planner/schedule` - Get study schedule
- `POST /api/planner/tasks` - Create new task
- `PUT /api/planner/tasks/:id` - Update task
- `DELETE /api/planner/tasks/:id` - Delete task
- `GET /api/planner/goals` - Get learning goals

**Example Usage:**
```typescript
const createTask = async (taskData) => {
  await axios.post('/api/planner/tasks', taskData);
  fetchTasks(); // Refresh task list
};

const updateTask = async (taskId, updates) => {
  await axios.put(`/api/planner/tasks/${taskId}`, updates);
};
```

### 4. DSA Page (dsa.tsx)

**Endpoints:**
- `GET /api/dsa/questions` - Get DSA questions with filters
- `GET /api/dsa/questions/:id` - Get specific question
- `POST /api/dsa/questions/:id/solve` - Mark question as solved
- `GET /api/dsa/categories` - Get question categories
- `GET /api/dsa/user-progress` - Get user progress

**Query Parameters:**
- `difficulty`: Easy | Medium | Hard
- `category`: Array | String | Tree | Graph | etc.
- `solved`: solved | unsolved | all

**Example Usage:**
```typescript
const fetchQuestions = async () => {
  const response = await axios.get('/api/dsa/questions', {
    params: {
      difficulty: filters.difficulty,
      category: filters.category,
      solved: filters.solved
    }
  });
  setQuestions(response.data);
};
```

### 5. GATE Page (gate.tsx)

**Endpoints:**
- `GET /api/gate/papers` - Get GATE previous year papers
- `GET /api/gate/papers/:id` - Get specific paper
- `POST /api/gate/papers/:id/start` - Start test session
- `GET /api/gate/papers/:id/solutions` - Get paper solutions
- `POST /api/gate/papers/:id/submit` - Submit test

**Query Parameters:**
- `year`: 2020-2024
- `subject`: Engineering Mathematics | General Aptitude | Technical
- `branch`: CS | EC | EE | ME
- `completed`: completed | pending | all

**Example Usage:**
```typescript
const fetchPapers = async () => {
  const response = await axios.get('/api/gate/papers', { params: filters });
  setPapers(response.data);
};

const startTest = async (paperId) => {
  const response = await axios.post(`/api/gate/papers/${paperId}/start`);
  // Navigate to test interface with session ID
};
```

### 6. Admin Page (admin.tsx)

**Endpoints:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/questions` - Get all questions
- `POST /api/admin/questions` - Create new question

**Example Usage:**
```typescript
const fetchAdminData = async () => {
  const [users, stats] = await Promise.all([
    axios.get('/api/admin/users'),
    axios.get('/api/admin/stats')
  ]);
  setUsers(users.data);
  setStats(stats.data);
};

const updateUserRole = async (userId, newRole) => {
  await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
};
```

### 7. Code Editor Page (code-editor.tsx)

**Endpoints:**
- `POST /api/code/run` - Execute code
- `POST /api/code/submit` - Submit solution
- `GET /api/code/submissions/:questionId` - Get submission history
- `POST /api/code/test` - Run test cases

**Example Usage:**
```typescript
const handleRunCode = async () => {
  const response = await axios.post('/api/code/run', {
    code,
    questionId,
    language: 'javascript'
  });
  setOutput(response.data.output);
};

const handleSubmitCode = async () => {
  const response = await axios.post('/api/code/submit', {
    code,
    questionId,
    language: 'javascript'
  });
  // Show submission results
};
```

### 8. AI Assistant Page (ai-assistant.tsx)

**Endpoints:**
- `POST /api/ai/chat` - Send message to AI
- `GET /api/ai/history` - Get chat history
- `POST /api/ai/clear-history` - Clear chat history
- `POST /api/ai/feedback` - Submit feedback on AI response

**Example Usage:**
```typescript
const sendMessage = async (message) => {
  const response = await axios.post('/api/ai/chat', { message });
  setMessages([...messages, 
    { role: 'user', content: message },
    { role: 'assistant', content: response.data.reply }
  ]);
};
```

## Error Handling

### Global Error Interceptor
```javascript
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Component-Level Error Handling
```typescript
try {
  const response = await axios.get('/api/endpoint');
  setData(response.data);
} catch (error) {
  if (error.response) {
    // Server responded with error
    setError(error.response.data.message);
  } else if (error.request) {
    // No response received
    setError('Network error. Please check your connection.');
  } else {
    // Other errors
    setError('An unexpected error occurred.');
  }
}
```

## Environment Variables

Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

For production:
```
REACT_APP_API_URL=https://api.prepverse.com
REACT_APP_ENV=production
```

## Authentication Flow

1. User logs in via `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Token is automatically added to all subsequent requests via interceptor
5. On 401 error, user is redirected to login

## Best Practices

1. **Always use try-catch blocks** for async operations
2. **Show loading states** during API calls
3. **Handle errors gracefully** with user-friendly messages
4. **Use environment variables** for API URLs
5. **Implement request cancellation** for unmounted components
6. **Add request timeouts** to prevent hanging requests
7. **Cache responses** where appropriate
8. **Debounce search requests** to reduce API calls

## Testing API Integration

```typescript
// Mock axios for testing
import axios from 'axios';
jest.mock('axios');

test('fetches questions successfully', async () => {
  const mockData = [{ id: '1', title: 'Test Question' }];
  axios.get.mockResolvedValue({ data: mockData });
  
  // Your test code
});
```

## Deployment Notes

- Update `REACT_APP_API_URL` in production environment
- Ensure CORS is properly configured on backend
- Use HTTPS in production
- Implement rate limiting on backend
- Add API versioning for future updates

## Support

For issues or questions about API integration, please refer to:
- Backend API documentation
- Team Slack channel
- GitHub issues
