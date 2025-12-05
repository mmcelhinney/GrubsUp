import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Settings() {
  const { user } = useAuthStore();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    recipeSuggestions: true
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    units: 'imperial'
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,1)] border-2 border-white rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm inline-block">
          Settings
        </h1>
        <p className="text-gray-700 mt-4 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] font-medium">
          Customize your app preferences and notification settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-700 font-medium">Email Notifications</span>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-700 font-medium">Push Notifications</span>
                <p className="text-sm text-gray-500">Get notified on your device</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleNotificationChange('push')}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-700 font-medium">Recipe Suggestions</span>
                <p className="text-sm text-gray-500">Get daily recipe recommendations</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.recipeSuggestions}
                onChange={() => handleNotificationChange('recipeSuggestions')}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                className="input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="input"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Measurement Units
              </label>
              <select
                value={preferences.units}
                onChange={(e) => handlePreferenceChange('units', e.target.value)}
                className="input"
              >
                <option value="imperial">Imperial (lbs, oz, °F)</option>
                <option value="metric">Metric (kg, g, °C)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <div className="space-y-3">
            <button className="btn btn-outline w-full text-left">
              Export My Data
            </button>
            <button className="btn btn-outline w-full text-left text-red-600 hover:bg-red-50 hover:border-red-300">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

