import React, { useState, useEffect } from 'react';
import { Activity, User, Moon, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = "https://fitness-api-backed-001-ahmed2.azurewebsites.net"

const Navbar = ({ setCurrentPage, currentPage }) => (
  <nav className="bg-white shadow-sm">
    <div className="container-fluid px-4">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <button onClick={() => setCurrentPage('register')} className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">Wellness Tracker</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentPage('register')} 
            className={`text-gray-600 hover:text-gray-900 ${currentPage === 'register' ? 'text-blue-600' : ''}`}
          >
            Register
          </button>
          <button 
            onClick={() => setCurrentPage('metrics')} 
            className={`text-gray-600 hover:text-gray-900 ${currentPage === 'metrics' ? 'text-blue-600' : ''}`}
          >
            Track Metrics
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const RegisterPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/create_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        localStorage.setItem('userEmail', formData.email);
        setTimeout(() => onNavigate('metrics'), 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error creating account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container-fluid px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch w-full">
          {/* Left Column */}
          <div className="space-y-8 w-full">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Wellness Journey</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Track your daily activities, monitor your progress, and achieve your wellness goals with our comprehensive tracking system.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Activity Tracking</h3>
                  <p className="text-gray-600 mt-2">Monitor your daily steps, calories burned, and sleep patterns in one place.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-green-100 p-3 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Personalized Insights</h3>
                  <p className="text-gray-600 mt-2">Get AI-powered wellness predictions based on your daily activities.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Moon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Sleep Analysis</h3>
                  <p className="text-gray-600 mt-2">Understanding your sleep patterns for better rest and recovery.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:pl-12 w-full">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="bg-blue-100 p-4 rounded-full inline-block">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-4">Create Your Account</h2>
                <p className="text-gray-600 mt-2">Join thousands of users tracking their wellness journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Account
                </button>
              </form>

              {message && (
                <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; // <-- Close MetricsPage here

const MetricsPage = () => {
  const [metrics, setMetrics] = useState({
    steps: '',
    calories_burnt_per_day: '',
    sleep_hrs: ''
  });
  const [historicalMetrics, setHistoricalMetrics] = useState([]);
  const [wellnessScore, setWellnessScore] = useState(null);
  const [message, setMessage] = useState('');
  const userEmail = localStorage.getItem('userEmail');

  const fetchMetrics = async () => {
    if (!userEmail) return;
    try {
      const response = await fetch(`${API_URL}/health_metrics/${userEmail}`);
      const data = await response.json();
      if (data.metrics) {
        setHistoricalMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMessage('Error fetching metrics. Please try again.');
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      setMessage('Please register first');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/health_metrics/${userEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      });
      const data = await response.json();
  
      const predResponse = await fetch(`${API_URL}/predict-wellness/1?email=${userEmail}`, {
        method: 'POST'
      });
      const predData = await predResponse.json();
      setWellnessScore(predData.pred);
      setMessage('Metrics submitted successfully');
      fetchMetrics();
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error submitting metrics. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/health_metrics/${userEmail}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'  
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      setMessage('Metrics deleted successfully');
      setWellnessScore(null);
      setMetrics({
        steps: '',
        calories_burnt_per_day: '',
        sleep_hrs: ''
      });
      setHistoricalMetrics([]);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error deleting metrics. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container-fluid px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8 w-full">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Progress</h1>
              <p className="text-xl text-gray-600">Log your daily activities and monitor your wellness journey.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-600" />
                Daily Metrics
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Steps Taken</label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={metrics.steps}
                    onChange={(e) => setMetrics({...metrics, steps: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burnt</label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={metrics.calories_burnt_per_day}
                    onChange={(e) => setMetrics({...metrics, calories_burnt_per_day: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours</label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={metrics.sleep_hrs}
                    onChange={(e) => setMetrics({...metrics, sleep_hrs: e.target.value})}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit Metrics
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {message && (
                <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* You can add the right column or other components here if needed */}
        </div>
      </div>
    </div>
  );
}; // <-- Close MetricsPage component here

// Define the main WellnessApp component
const WellnessApp = () => {
  const [currentPage, setCurrentPage] = useState('register');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'register' 
        ? <RegisterPage onNavigate={setCurrentPage} />
        : <MetricsPage />
      }
    </div>
  );
};

export default WellnessApp;
