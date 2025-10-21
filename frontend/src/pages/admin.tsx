import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalSubmissions: number;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/stats')
      ]);
      setUsers(usersResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      
      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
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

      <div className="users-section">
        <h2>User Management</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
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
                  <button onClick={() => handleUpdateUserRole(user.id, 'admin')}>
                    Make Admin
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
