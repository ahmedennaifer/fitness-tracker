import React, { useState, useEffect } from 'react';
import {
  Activity,
  User,
  Moon,
  Trash2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const API_URL = "https://fitness-api-backed-001-ahmed2.azurewebsites.net";

// -------------------- Navbar --------------------
const Navbar = ({ setCurrentPage, currentPage }) => (
  <nav className="bg-white shadow-sm">
    <div className="container-fluid px-4">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <button
            onClick={() => setCurrentPage('register')}
            className="flex items-center space-x-2"
          >
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">Wellness Tracker</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage('register')}
            className={`text-gray-600 hover:text-gray-900 ${
              currentPage === 'register' ? 'text-blue-600' : ''
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setCurrentPage('metrics')}
            className={`text-gray-600 hover:text-gray-900 ${
              currentPage === 'metrics' ? 'text-blue-600' : ''
            }`}
          >
            Track Metrics
          </button>
        </div>
      </div>
    </div>
  </nav>
);

// -------------------- Register Page --------------------
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
        // Store the user's email locally
        localStorage.setItem('userEmail', formData.email);
        // Navigate to the metrics page after a short delay
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
                Track your daily activities, monitor your progress, and achieve your wellness goals with our
                comprehensive tracking system.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Activity Tracking</h3>
                  <p className="text-gray-600 mt-2">
                    Monitor your daily steps, calories burned, and sleep patterns in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-green-100 p-3 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Personalized Insights</h3>
                  <p className="text-gray-600 mt-2">
                    Get AI-powered wellness predictions based on your daily activities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Moon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Sleep Analysis</h3>
                  <p className="text-gray-600 mt-2">
                    Understanding your sleep patterns for better rest and recovery.
                  </p>
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
                <p className="text-gray-600 mt-2">
                  Join thousands of users tracking their wellness journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
};

// -------------------- Metrics Page --------------------
const MetricsPage = () => {
  const [metrics, setMetrics] = useState({
    steps: '',
    calories_burnt_per_day: '',
    sleep_hrs: ''
  });
  const [historicalMetrics, setHistoricalMetrics] = useState([]);
  const [wellnessScore, setWellnessScore] = useState(null);
  const [message, setMessage] = useState('');

  // Grab the logged-in user's email
  const userEmail = localStorage.getItem('userEmail');

  // -------------------- Fetch Historical Metrics --------------------
  const fetchMetrics = async () => {
    if (!userEmail) return;
    try {
      const response = await fetch(`${API_URL}/health_metrics/${userEmail}`);
      const data = await response.json();
      if (data && data.metrics) {
        // data.metrics should be an array if you want to show multiple historical records
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

  // -------------------- Submit Daily Metrics --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      setMessage('Please register first');
      return;
    }

    try {
      // 1) Save the metrics for today (or whenever)
      const response = await fetch(`${API_URL}/health_metrics/${userEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      });
      const data = await response.json();

      // 2) Attempt to get a wellness prediction after saving metrics
      try {
        const predResponse = await fetch(
          // Make sure `/predict-wellness/1?email=...` is correct for your backend
          `${API_URL}/predict-wellness/1?email=${userEmail}`,
          {
            method: 'POST'
          }
        );

        if (!predResponse.ok) {
          throw new Error('Prediction failed');
        }

        const predData = await predResponse.json();
        if (predData && predData.pred !== undefined) {
          setWellnessScore(predData.pred);
        } else {
          setMessage('Unable to calculate wellness score');
        }
      } catch (predError) {
        console.error('Prediction error:', predError);
        setMessage('Unable to calculate wellness score');
        setWellnessScore(null);
      }

      setMessage(data.message || 'Metrics submitted successfully');
      // Refresh the table/chart after new submission
      fetchMetrics();
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error submitting metrics. Please try again.');
    }
  };

  // -------------------- Delete Metrics --------------------
  const handleDelete = async () => {
    if (!userEmail) {
      setMessage('No user found. Please register first.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/health_metrics/${userEmail}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete metrics');
      }
      setMessage('Metrics deleted successfully');
      // Refresh after deletion
      fetchMetrics();
      // Optionally clear local state if you want:
      // setHistoricalMetrics([]);
      // setWellnessScore(null);
    } catch (error) {
      console.error('Error deleting metrics:', error);
      setMessage('Error deleting metrics. Please try again.');
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container-fluid px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8 w-full">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Progress</h1>
              <p className="text-xl text-gray-600">
                Log your daily activities and monitor your wellness journey.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-600" />
                Daily Metrics
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Steps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Steps Taken
                  </label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={metrics.steps}
                    onChange={(e) =>
                      setMetrics({ ...metrics, steps: e.target.value })
                    }
                  />
                </div>

                {/* Calories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={metrics.calories_burnt_per_day}
                    onChange={(e) =>
                      setMetrics({
                        ...metrics,
                        calories_burnt_per_day: e.target.value
                      })
                    }
                  />
                </div>

                {/* Sleep */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sleep Hours
                  </label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={metrics.sleep_hrs}
                    onChange={(e) =>
                      setMetrics({ ...metrics, sleep_hrs: e.target.value })
                    }
                  />
                </div>

                {/* Buttons */}
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

              {/* Any success or error messages */}
              {message && (
                <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 w-full">
            {/* Show Wellness Score if available */}
            {wellnessScore !== null && typeof wellnessScore !== 'undefined' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6">Your Wellness Score</h3>
                <div className="bg-blue-50 rounded-lg p-8 text-center">
                  <div className="text-6xl font-bold text-blue-600">
                    {/* In case the model returns a numeric score out of 100 */}
                    {Number(wellnessScore).toFixed(1)}
                  </div>
                  <div className="text-gray-600 mt-2">out of 100</div>
                </div>
              </div>
            )}

            {/* Quick activity summary for the most recent input */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Latest Activity Summary</h3>
              <div className="grid grid-cols-2 gap-8 w-full">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-gray-600 mb-2">Sleep Duration</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {metrics.sleep_hrs || '0'}h
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-gray-600 mb-2">Daily Steps</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {metrics.steps || '0'}
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Metrics chart */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Historical Metrics</h3>
              {Array.isArray(historicalMetrics) && historicalMetrics.length > 0 ? (
                <div className="space-y-4">
                  {/* Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        {/* Make sure these dataKeys match your backend fields */}
                        <Line
                          type="monotone"
                          dataKey="steps"
                          stroke="#3B82F6"
                          name="Steps"
                        />
                        <Line
                          type="monotone"
                          dataKey="calories_burnt_per_day"
                          stroke="#10B981"
                          name="Calories"
                        />
                        <Line
                          type="monotone"
                          dataKey="sleep_hrs"
                          stroke="#8B5CF6"
                          name="Sleep Hours"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Example of showing averages or a summary below the chart */}
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Avg Steps</div>
                        <div className="text-xl font-bold text-gray-900">
                          {/* Replace with your own logic/average calculation */}
                          {historicalMetrics[0]?.steps || 0}
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Avg Calories</div>
                        <div className="text-xl font-bold text-gray-900">
                          {/* Replace with your own logic/average calculation */}
                          {historicalMetrics[0]?.calories_burnt_per_day || 0}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-sm text-gray-600">Avg Sleep</div>
                        <div className="text-xl font-bold text-gray-900">
                          {historicalMetrics[0]?.sleep_hrs || 0}h
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No historical data found. Please submit some metrics!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- Main App --------------------
const WellnessApp = () => {
  const [currentPage, setCurrentPage] = useState('register');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'register' ? (
        <RegisterPage onNavigate={setCurrentPage} />
      ) : (
        <MetricsPage />
      )}
    </div>
  );
};

export default WellnessApp;
