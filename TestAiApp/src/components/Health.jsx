import { useState } from 'react';
import './Health.css';

function Health({ userEmail, onLogout, onNavigate }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

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
            <button className="nav-item" onClick={() => onNavigate('crypto')}>
              <span className="nav-icon">₿</span>
              <span>Crypto</span>
            </button>
            <button className="nav-item active">
              <span className="nav-icon">❤️</span>
              <span>Health & Fitness</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">🎯</span>
              <span>Goals</span>
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

          {/* Workout History */}
          <section className="workout-history">
            <h2 className="section-title">Recent Workouts</h2>
            <div className="workout-list">
              {workoutHistory.map((workout) => (
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
              ))}
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
    </div>
  );
}

export default Health;
