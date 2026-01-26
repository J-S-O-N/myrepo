import { useState, useEffect } from 'react';
import './Health.css';

function Health({ userEmail, onLogout, onNavigate }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [stravaConnected, setStravaConnected] = useState(false);
  const [stravaLoading, setStravaLoading] = useState(true);
  const [stravaActivities, setStravaActivities] = useState([]);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [connectError, setConnectError] = useState(null);

  const healthStats = {
    steps: { value: 8547, goal: 10000, unit: 'steps' },
    calories: { value: 2345, goal: 2500, unit: 'kcal' },
    water: { value: 6, goal: 8, unit: 'glasses' },
    sleep: { value: 7.2, goal: 8, unit: 'hours' }
  };

  const weeklyActivity = [
    { day: 'Mon', steps: 9234, calories: 2456, active: 45 },
    { day: 'Tue', steps: 7821, calories: 2123, active: 38 },
    { day: 'Wed', steps: 10456, calories: 2789, active: 52 },
    { day: 'Thu', steps: 8234, calories: 2345, active: 41 },
    { day: 'Fri', steps: 9567, calories: 2567, active: 48 },
    { day: 'Sat', steps: 11234, calories: 2890, active: 58 },
    { day: 'Sun', steps: 6789, calories: 1934, active: 35 }
  ];

  const workoutHistory = [
    { id: 1, type: 'Running', duration: 35, calories: 420, date: '2026-01-20', icon: '🏃' },
    { id: 2, type: 'Cycling', duration: 45, calories: 380, date: '2026-01-19', icon: '🚴' },
    { id: 3, type: 'Yoga', duration: 30, calories: 150, date: '2026-01-18', icon: '🧘' },
    { id: 4, type: 'Swimming', duration: 40, calories: 450, date: '2026-01-17', icon: '🏊' },
    { id: 5, type: 'Weight Training', duration: 50, calories: 320, date: '2026-01-16', icon: '🏋️' }
  ];

  const goals = [
    { id: 1, name: 'Lose 5 lbs', progress: 60, target: '5 lbs', current: '3 lbs' },
    { id: 2, name: 'Run 5K', progress: 75, target: '5K', current: '3.75K' },
    { id: 3, name: 'Drink More Water', progress: 85, target: '8 glasses/day', current: '6.8 glasses/day' }
  ];

  const calculatePercentage = (value, goal) => {
    return Math.min((value / goal) * 100, 100);
  };

  // Check Strava connection status on mount
  useEffect(() => {
    checkStravaStatus();

    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('strava_connected') === 'true') {
      setStravaConnected(true);
      checkStravaStatus();
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('strava_error')) {
      setConnectError(urlParams.get('strava_error'));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Fetch activities when connected
  useEffect(() => {
    if (stravaConnected) {
      fetchStravaActivities();
    }
  }, [stravaConnected]);

  const checkStravaStatus = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/strava/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStravaConnected(data.connected);
      }
    } catch (error) {
      console.error('Error checking Strava status:', error);
    } finally {
      setStravaLoading(false);
    }
  };

  const handleConnectStrava = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/strava/auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to Strava authorization
        window.location.href = data.authUrl;
      } else {
        setConnectError('Failed to initiate Strava connection');
      }
    } catch (error) {
      console.error('Error connecting to Strava:', error);
      setConnectError('Failed to connect to Strava');
    }
  };

  const handleDisconnectStrava = async () => {
    if (!confirm('Are you sure you want to disconnect Strava?')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/strava/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setStravaConnected(false);
        setStravaActivities([]);
      }
    } catch (error) {
      console.error('Error disconnecting Strava:', error);
    }
  };

  const fetchStravaActivities = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/strava/activities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStravaActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching Strava activities:', error);
    }
  };

  const formatActivityType = (type) => {
    const icons = {
      'Run': '🏃',
      'Ride': '🚴',
      'Swim': '🏊',
      'Walk': '🚶',
      'Hike': '🥾',
      'Yoga': '🧘',
      'WeightTraining': '🏋️',
      'Workout': '💪'
    };
    return icons[type] || '🏃';
  };

  const formatDistance = (meters) => {
    const km = meters / 1000;
    return `${km.toFixed(2)} km`;
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">💳 BankApp</h1>
          </div>
          <div className="user-section">
            <span className="user-email">{userEmail}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <button className="nav-item" onClick={() => onNavigate('dashboard')}>
              <span className="nav-icon">🏠</span>
              <span>Dashboard</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('accounts')}>
              <span className="nav-icon">💰</span>
              <span>Accounts</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('investments')}>
              <span className="nav-icon">📈</span>
              <span>Investments</span>
            </button>
            <button className="nav-item active">
              <span className="nav-icon">❤️</span>
              <span>Health & Fitness</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('goals')}>
              <span className="nav-icon">🎯</span>
              <span>Goals</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('buyhub')}>
              <span className="nav-icon">🛒</span>
              <span>Buy Hub</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('crypto')}>
              <span className="nav-icon">₿</span>
              <span>Crypto</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('settings')}>
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          <div className="health-header">
            <h1 className="page-title">Health & Fitness</h1>
            <div className="period-selector">
              <button
                className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </button>
              <button
                className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </button>
              <button
                className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('year')}
              >
                Year
              </button>
            </div>
          </div>

          {/* Health Stats Cards */}
          <section className="health-stats">
            <div className="stat-card">
              <div className="stat-icon steps-icon">👟</div>
              <div className="stat-info">
                <div className="stat-label">Steps Today</div>
                <div className="stat-value">{healthStats.steps.value.toLocaleString()}</div>
                <div className="stat-goal">Goal: {healthStats.steps.goal.toLocaleString()}</div>
              </div>
              <div className="stat-progress-wrapper">
                <svg className="stat-circle" viewBox="0 0 100 100">
                  <circle className="stat-circle-bg" cx="50" cy="50" r="45" />
                  <circle
                    className="stat-circle-progress steps"
                    cx="50"
                    cy="50"
                    r="45"
                    style={{ strokeDashoffset: 283 - (283 * calculatePercentage(healthStats.steps.value, healthStats.steps.goal)) / 100 }}
                  />
                </svg>
                <div className="stat-percentage">{Math.round(calculatePercentage(healthStats.steps.value, healthStats.steps.goal))}%</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon calories-icon">🔥</div>
              <div className="stat-info">
                <div className="stat-label">Calories Burned</div>
                <div className="stat-value">{healthStats.calories.value.toLocaleString()}</div>
                <div className="stat-goal">Goal: {healthStats.calories.goal.toLocaleString()}</div>
              </div>
              <div className="stat-progress-wrapper">
                <svg className="stat-circle" viewBox="0 0 100 100">
                  <circle className="stat-circle-bg" cx="50" cy="50" r="45" />
                  <circle
                    className="stat-circle-progress calories"
                    cx="50"
                    cy="50"
                    r="45"
                    style={{ strokeDashoffset: 283 - (283 * calculatePercentage(healthStats.calories.value, healthStats.calories.goal)) / 100 }}
                  />
                </svg>
                <div className="stat-percentage">{Math.round(calculatePercentage(healthStats.calories.value, healthStats.calories.goal))}%</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon water-icon">💧</div>
              <div className="stat-info">
                <div className="stat-label">Water Intake</div>
                <div className="stat-value">{healthStats.water.value}</div>
                <div className="stat-goal">Goal: {healthStats.water.goal} glasses</div>
              </div>
              <div className="stat-progress-wrapper">
                <svg className="stat-circle" viewBox="0 0 100 100">
                  <circle className="stat-circle-bg" cx="50" cy="50" r="45" />
                  <circle
                    className="stat-circle-progress water"
                    cx="50"
                    cy="50"
                    r="45"
                    style={{ strokeDashoffset: 283 - (283 * calculatePercentage(healthStats.water.value, healthStats.water.goal)) / 100 }}
                  />
                </svg>
                <div className="stat-percentage">{Math.round(calculatePercentage(healthStats.water.value, healthStats.water.goal))}%</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon sleep-icon">😴</div>
              <div className="stat-info">
                <div className="stat-label">Sleep</div>
                <div className="stat-value">{healthStats.sleep.value}h</div>
                <div className="stat-goal">Goal: {healthStats.sleep.goal} hours</div>
              </div>
              <div className="stat-progress-wrapper">
                <svg className="stat-circle" viewBox="0 0 100 100">
                  <circle className="stat-circle-bg" cx="50" cy="50" r="45" />
                  <circle
                    className="stat-circle-progress sleep"
                    cx="50"
                    cy="50"
                    r="45"
                    style={{ strokeDashoffset: 283 - (283 * calculatePercentage(healthStats.sleep.value, healthStats.sleep.goal)) / 100 }}
                  />
                </svg>
                <div className="stat-percentage">{Math.round(calculatePercentage(healthStats.sleep.value, healthStats.sleep.goal))}%</div>
              </div>
            </div>
          </section>

          {/* Weekly Activity Chart */}
          <section className="activity-chart-section">
            <h2 className="section-title">Weekly Activity</h2>
            <div className="activity-chart">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="activity-bar-wrapper">
                  <div className="activity-bar">
                    <div
                      className="activity-bar-fill"
                      style={{ height: `${(day.steps / 12000) * 100}%` }}
                    >
                      <span className="activity-value">{(day.steps / 1000).toFixed(1)}K</span>
                    </div>
                  </div>
                  <div className="activity-day">{day.day}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Strava Integration Section */}
          <section className="strava-section">
            <div className="strava-header">
              <h2 className="section-title">Strava Integration</h2>
              {!stravaLoading && (
                <div className="strava-controls">
                  {stravaConnected ? (
                    <button className="strava-disconnect-btn" onClick={handleDisconnectStrava}>
                      Disconnect Strava
                    </button>
                  ) : (
                    <>
                      <button className="strava-guide-btn" onClick={() => setShowGuideModal(true)}>
                        ℹ️ How it works
                      </button>
                      <button className="strava-connect-btn" onClick={handleConnectStrava}>
                        🔗 Connect to Strava
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {stravaLoading && (
              <div className="strava-loading">Loading Strava status...</div>
            )}

            {!stravaLoading && stravaConnected && (
              <div className="strava-status-connected">
                ✅ Connected to Strava - Your activities will sync automatically
              </div>
            )}

            {!stravaLoading && !stravaConnected && (
              <div className="strava-status-disconnected">
                Connect your Strava account to sync your runs, rides, and workouts automatically
              </div>
            )}

            {connectError && (
              <div className="strava-error">
                ⚠️ {connectError}
              </div>
            )}
          </section>

          {/* Workout History */}
          <section className="workout-history">
            <h2 className="section-title">
              {stravaConnected ? 'Recent Strava Activities' : 'Recent Workouts'}
            </h2>
            <div className="workout-list">
              {stravaConnected && stravaActivities.length > 0 ? (
                stravaActivities.map((activity) => (
                  <div key={activity.id} className="workout-item">
                    <div className="workout-icon">{formatActivityType(activity.type)}</div>
                    <div className="workout-info">
                      <div className="workout-name">{activity.name}</div>
                      <div className="workout-meta">
                        <span>{formatDistance(activity.distance)}</span>
                        <span>•</span>
                        <span>{formatDuration(activity.moving_time)}</span>
                        {activity.total_elevation_gain > 0 && (
                          <>
                            <span>•</span>
                            <span>↗ {Math.round(activity.total_elevation_gain)}m</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{formatDate(activity.start_date)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : stravaConnected ? (
                <div className="no-activities">No recent activities found</div>
              ) : (
                workoutHistory.map((workout) => (
                  <div key={workout.id} className="workout-item">
                    <div className="workout-icon">{workout.icon}</div>
                    <div className="workout-info">
                      <div className="workout-name">{workout.type}</div>
                      <div className="workout-meta">
                        <span>{workout.duration} min</span>
                        <span>•</span>
                        <span>{workout.calories} cal</span>
                        <span>•</span>
                        <span>{workout.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* Right Sidebar - Goals */}
        <aside className="insights-panel">
          <div className="insights-card">
            <h3 className="insights-title">Fitness Goals</h3>
            {goals.map((goal) => (
              <div key={goal.id} className="goal-item">
                <div className="goal-header">
                  <span className="goal-name">{goal.name}</span>
                  <span className="goal-progress-text">{goal.progress}%</span>
                </div>
                <div className="goal-progress-bar">
                  <div
                    className="goal-progress-fill"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="goal-details">
                  <span className="goal-current">{goal.current}</span>
                  <span className="goal-target">of {goal.target}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Health Tips</h3>
            <div className="tip-item">
              <div className="tip-icon">💪</div>
              <div className="tip-text">Stay hydrated during workouts</div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">🥗</div>
              <div className="tip-text">Eat protein after exercise</div>
            </div>
            <div className="tip-item">
              <div className="tip-icon">😴</div>
              <div className="tip-text">Get 7-9 hours of sleep</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Strava Connection Guide Modal */}
      {showGuideModal && (
        <div className="modal-overlay" onClick={() => setShowGuideModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏃 Connect to Strava</h2>
              <button className="modal-close" onClick={() => setShowGuideModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="guide-section">
                <h3>What is Strava?</h3>
                <p>Strava is a popular fitness tracking app used by millions of athletes worldwide to record and share their runs, rides, and other activities.</p>
              </div>

              <div className="guide-section">
                <h3>Why Connect?</h3>
                <ul>
                  <li>📊 Automatically sync your runs, rides, and workouts</li>
                  <li>📈 See your real activity data in BankApp</li>
                  <li>🏆 Track your progress over time</li>
                  <li>💪 No manual data entry required</li>
                </ul>
              </div>

              <div className="guide-section">
                <h3>What We'll Access</h3>
                <p>When you connect, BankApp will request permission to:</p>
                <ul>
                  <li>View your activity data (runs, rides, etc.)</li>
                  <li>Read your profile information</li>
                </ul>
                <p className="guide-note">⚠️ We will NOT post activities or modify your Strava account.</p>
              </div>

              <div className="guide-section">
                <h3>How to Connect</h3>
                <ol>
                  <li>Click "Connect to Strava" button</li>
                  <li>You'll be redirected to Strava's website</li>
                  <li>Log in to your Strava account (if not already logged in)</li>
                  <li>Click "Authorize" to grant BankApp access</li>
                  <li>You'll be redirected back to BankApp</li>
                  <li>Your activities will sync automatically</li>
                </ol>
              </div>

              <div className="guide-section">
                <h3>Privacy & Security</h3>
                <p>Your Strava credentials are never stored in BankApp. We only receive a secure access token from Strava that allows us to read your activity data. You can disconnect at any time.</p>
              </div>

              <div className="guide-section troubleshooting">
                <h3>Troubleshooting</h3>
                <p><strong>Connection failed?</strong></p>
                <ul>
                  <li>Make sure you have a Strava account</li>
                  <li>Check that you clicked "Authorize" on Strava's page</li>
                  <li>Try clearing your browser cache and reconnecting</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={() => setShowGuideModal(false)}>
                Close
              </button>
              <button className="modal-connect-btn" onClick={() => { setShowGuideModal(false); handleConnectStrava(); }}>
                Connect to Strava
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Health;
