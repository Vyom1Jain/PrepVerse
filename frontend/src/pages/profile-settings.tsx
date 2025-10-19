import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  name: string;
  email: string;
  username: string;
  bio: string;
  avatar?: string;
  phone?: string;
  college?: string;
  graduationYear?: number;
}

interface Settings {
  emailNotifications: boolean;
  weeklyProgress: boolean;
  studyReminders: boolean;
  theme: 'light' | 'dark' | 'auto';
}

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    username: '',
    bio: ''
  });
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    weeklyProgress: true,
    studyReminders: true,
    theme: 'auto'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [profileRes, settingsRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/settings')
      ]);
      const profileData = await profileRes.json();
      const settingsData = await settingsRes.json();
      setProfile(profileData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-settings">
      <header className="settings-header">
        <h1>Profile & Settings</h1>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </header>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button 
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea 
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>College</label>
              <input 
                type="text" 
                value={profile.college || ''}
                onChange={(e) => setProfile({...profile, college: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input 
                type="number" 
                value={profile.graduationYear || ''}
                onChange={(e) => setProfile({...profile, graduationYear: parseInt(e.target.value)})}
              />
            </div>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        )}

        {activeTab === 'settings' && (
          <div className="settings-form">
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                />
                Email Notifications
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.weeklyProgress}
                  onChange={(e) => setSettings({...settings, weeklyProgress: e.target.checked})}
                />
                Weekly Progress Report
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.studyReminders}
                  onChange={(e) => setSettings({...settings, studyReminders: e.target.checked})}
                />
                Study Reminders
              </label>
            </div>
            <div className="setting-item">
              <label>Theme</label>
              <select 
                value={settings.theme}
                onChange={(e) => setSettings({...settings, theme: e.target.value as 'light' | 'dark' | 'auto'})}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <button onClick={handleSettingsUpdate} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-form">
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" />
            </div>
            <button>Update Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
