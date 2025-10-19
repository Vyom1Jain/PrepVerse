import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  registeredDate: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalQuestions: number;
  totalSubmissions: number;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'analytics'>('users');

  useEffect(() => {
    checkAdminAccess();
    fetchAdminData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        credentials: 'include'
      });
      if (!response.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Admin access check failed:', error);
      navigate('/dashboard');
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats')
      ]);
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      setUsers(usersData.users);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' })
      });
      fetchAdminData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </header>

      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Questions</h3>
            <p>{stats.totalQuestions}</p>
          </div>
          <div className="stat-card">
            <h3>Total Submissions</h3>
            <p>{stats.totalSubmissions}</p>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'content' ? 'active' : ''}
          onClick={() => setActiveTab('content')}
        >
          Content Management
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' && (
          <div className="users-table">
            <h2>Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status ${user.status}`}>{user.status}</span>
                    </td>
                    <td>{new Date(user.registeredDate).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleUserStatusToggle(user.id, user.status)}>
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-management">
            <h2>Content Management</h2>
            <div className="content-actions">
              <button>Add New Question</button>
              <button>Manage GATE Papers</button>
              <button>Update Study Resources</button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics">
            <h2>Analytics Dashboard</h2>
            <p>Detailed analytics coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
