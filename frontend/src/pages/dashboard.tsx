import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface DashboardStats {
  totalProblems: number;
  solvedProblems: number;
  totalStudyHours: number;
  upcomingTasks: number;
  weeklyProgress: number;
  streak: number;
}

interface RecentActivity {
  id: string;
  type: 'problem' | 'study' | 'task';
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProblems: 0,
    solvedProblems: 0,
    totalStudyHours: 0,
    upcomingTasks: 0,
    weeklyProgress: 0,
    streak: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch dashboard statistics
      const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`, { headers });
      setStats(statsResponse.data);
      
      // Fetch recent activity
      const activityResponse = await axios.get(`${API_BASE_URL}/dashboard/activity`, { headers });
      setRecentActivity(activityResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-indigo-600">PrepVerse</h1>
              <nav className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="text-gray-700 font-medium">Dashboard</Link>
                <Link href="/planner" className="text-gray-600 hover:text-gray-900">Planner</Link>
                <Link href="/dsa" className="text-gray-600 hover:text-gray-900">DSA Problems</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}! 👋</h2>
          <p className="mt-2 text-gray-600">Here's your learning progress overview</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Problems Solved Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Problems Solved</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.solvedProblems} / {stats.totalProblems}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.totalProblems > 0 
                    ? `${Math.round((stats.solvedProblems / stats.totalProblems) * 100)}% Complete`
                    : 'Start solving problems!'}
                </p>
              </div>
              <div className="text-blue-500 text-4xl">📝</div>
            </div>
            <Link href="/dsa" className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">View All Problems →</Link>
          </div>

          {/* Study Hours Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Study Hours</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudyHours}h</h3>
                <p className="text-sm text-gray-600 mt-1">Total time invested</p>
              </div>
              <div className="text-green-500 text-4xl">📚</div>
            </div>
            <div className="mt-4 text-sm text-gray-600">Keep up the great work!</div>
          </div>

          {/* Current Streak Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Current Streak</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.streak} days</h3>
                <p className="text-sm text-gray-600 mt-1">Keep the momentum going!</p>
              </div>
              <div className="text-yellow-500 text-4xl">🔥</div>
            </div>
          </div>

          {/* Upcoming Tasks Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Upcoming Tasks</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingTasks}</h3>
                <p className="text-sm text-gray-600 mt-1">Tasks pending</p>
              </div>
              <div className="text-purple-500 text-4xl">📋</div>
            </div>
            <Link href="/planner" className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium">View Planner →</Link>
          </div>

          {/* Weekly Progress Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Weekly Progress</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.weeklyProgress}%</h3>
                <p className="text-sm text-gray-600 mt-1">Goals completed</p>
              </div>
              <div className="text-pink-500 text-4xl">📈</div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.weeklyProgress}%` }}
              />
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dsa" className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md px-4 py-2 transition">
                🎯 Solve a Problem
              </Link>
              <Link href="/planner" className="block bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md px-4 py-2 transition">
                ✏️ Add to Planner
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center space-x-4">
                    <div className={
                      `w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                        activity.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`
                    }>
                      {activity.type === 'problem' ? '📝' : activity.type === 'study' ? '📚' : '📋'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={
                    `px-3 py-1 rounded-full text-sm font-medium ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`
                  }>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity yet. Start solving problems or planning your study schedule!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
