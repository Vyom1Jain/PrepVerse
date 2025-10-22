'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Circle, Plus, Trash2, Edit2, Filter } from 'lucide-react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'DSA' | 'GATE' | 'Placement' | 'Other';
  estimatedTime: number; // in minutes
}

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

export default function Planner() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'DSA' as 'DSA' | 'GATE' | 'Placement' | 'Other',
    estimatedTime: 60
  });

  useEffect(() => {
    fetchStudyPlans();
    fetchTasks();
  }, []);

  const fetchStudyPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/planner', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudyPlans(response.data.plans || []);
    } catch (error) {
      console.error('Failed to fetch study plans:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/planner/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.tasks || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/planner/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, response.data.task]);
      setShowAddModal(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: 'DSA',
        estimatedTime: 60
      });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/planner/tasks/${taskId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/planner/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = filterCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === filterCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'low': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Planner</h1>
          <p className="text-gray-600">Organize your GATE & Placement preparation journey</p>
        </div>

        {/* Study Plans Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {studyPlans.map(plan => (
            <div 
              key={plan.id}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer transition ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <h3 className="font-semibold text-lg mb-2">{plan.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm font-semibold">{plan.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${plan.progress}%` }}
                ></div>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-600">{plan.completedTasks}/{plan.totalTasks} tasks</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {plan.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Task Management Section */}
        <div className="bg-white rounded-lg shadow">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded ${
                  viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Calendar View
              </button>
            </div>

            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                <option value="all">All Categories</option>
                <option value="DSA">DSA</option>
                <option value="GATE">GATE</option>
                <option value="Placement">Placement</option>
                <option value="Other">Other</option>
              </select>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="p-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No tasks found. Create your first task to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <div 
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <button 
                          onClick={() => updateTaskStatus(
                            task.id, 
                            task.status === 'completed' ? 'pending' : 'completed'
                          )}
                        >
                          {getStatusIcon(task.status)}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-semibold text-gray-900 ${
                            task.status === 'completed' ? 'line-through text-gray-500' : ''
                          }`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                              {task.category}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.estimatedTime} min
                            </span>
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
              <form onSubmit={createTask}>
                <div className="

