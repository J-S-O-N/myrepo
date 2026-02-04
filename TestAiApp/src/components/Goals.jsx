import { useState, useEffect } from 'react';
import './Dashboard.css';
import './Goals.css';
import { API_URL } from '../config';

function Goals({ userEmail, token, onLogout, onNavigate }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [savingToGoal, setSavingToGoal] = useState(null);
  const [saveAmount, setSaveAmount] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    category: 'Savings',
    icon: '💰',
    color: 'blue',
    status: 'active',
  });

  const categories = [
    { name: 'Savings', icon: '💰', color: 'blue' },
    { name: 'Investment', icon: '📈', color: 'green' },
    { name: 'Property', icon: '🏠', color: 'purple' },
    { name: 'Vehicle', icon: '🚗', color: 'orange' },
    { name: 'Education', icon: '🎓', color: 'indigo' },
    { name: 'Travel', icon: '✈️', color: 'teal' },
    { name: 'Emergency Fund', icon: '🚨', color: 'red' },
    { name: 'Retirement', icon: '🏖️', color: 'pink' },
    { name: 'Other', icon: '🎯', color: 'gray' },
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('${API_URL}/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const data = await response.json();
      setGoals(data.goals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category.name,
      icon: category.icon,
      color: category.color,
    }));
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      target_amount: '',
      current_amount: '',
      target_date: '',
      category: 'Savings',
      icon: '💰',
      color: 'blue',
      status: 'active',
    });
    setShowModal(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      target_amount: (goal.target_amount / 100).toString(),
      current_amount: (goal.current_amount / 100).toString(),
      target_date: goal.target_date || '',
      category: goal.category,
      icon: goal.icon,
      color: goal.color,
      status: goal.status,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const goalData = {
        title: formData.title,
        description: formData.description,
        target_amount: Math.round(parseFloat(formData.target_amount) * 100),
        current_amount: Math.round(parseFloat(formData.current_amount || 0) * 100),
        target_date: formData.target_date || null,
        category: formData.category,
        icon: formData.icon,
        color: formData.color,
        status: formData.status,
      };

      const url = editingGoal
        ? `${API_URL}/api/goals/${editingGoal.id}`
        : '${API_URL}/api/goals';

      const response = await fetch(url, {
        method: editingGoal ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save goal');
      }

      await fetchGoals();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }

      await fetchGoals();
    } catch (err) {
      setError(err.message);
    }
  };

  const openSaveModal = (goal) => {
    setSavingToGoal(goal);
    setSaveAmount('');
    setError('');
    setShowSaveModal(true);
  };

  const closeSaveModal = () => {
    setShowSaveModal(false);
    setSavingToGoal(null);
    setSaveAmount('');
    setError('');
  };

  const handleSaveToGoal = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const amountInCents = Math.round(parseFloat(saveAmount) * 100);
      if (amountInCents <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      const newCurrentAmount = savingToGoal.current_amount + amountInCents;

      const response = await fetch(`${API_URL}/api/goals/${savingToGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_amount: newCurrentAmount,
          status: newCurrentAmount >= savingToGoal.target_amount ? 'completed' : savingToGoal.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save money to goal');
      }

      await fetchGoals();
      closeSaveModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatCurrency = (amount) => {
    return `R ${(amount / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateProgress = (current, target) => {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No target date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-message">Loading goals...</div>
      </div>
    );
  }

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
            <button className="nav-item" onClick={() => onNavigate('health')}>
              <span className="nav-icon">❤️</span>
              <span>Health & Fitness</span>
            </button>
            <button className="nav-item active">
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
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Financial Goals</h2>
              <p className="panel-subtitle">Track and achieve your financial objectives</p>
            </div>
            <button className="btn-create-goal" onClick={openCreateModal}>
              + New Goal
            </button>
          </div>

          {error && (
            <div className="alert-banner error">
              <span>⚠️</span> {error}
            </div>
          )}

          {goals.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎯</span>
              <h3>No goals yet</h3>
              <p>Start tracking your financial goals by creating your first one</p>
              <button className="btn-primary" onClick={openCreateModal}>
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="goals-grid">
              {goals.map((goal) => {
                const progress = calculateProgress(goal.current_amount, goal.target_amount);
                return (
                  <div key={goal.id} className={`goal-card ${goal.color}`}>
                    <div className="goal-header">
                      <div className="goal-icon-wrapper">
                        <span className="goal-icon">{goal.icon}</span>
                      </div>
                      <div className="goal-actions">
                        <button className="btn-icon" onClick={() => openEditModal(goal)}>
                          ✏️
                        </button>
                        <button className="btn-icon" onClick={() => handleDelete(goal.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>

                    <h3 className="goal-title">{goal.title}</h3>
                    {goal.description && (
                      <p className="goal-description">{goal.description}</p>
                    )}

                    <div className="goal-category-badge">{goal.category}</div>

                    <div className="goal-amounts">
                      <div className="amount-current">
                        <span className="amount-label">Current</span>
                        <span className="amount-value">{formatCurrency(goal.current_amount)}</span>
                      </div>
                      <div className="amount-target">
                        <span className="amount-label">Target</span>
                        <span className="amount-value">{formatCurrency(goal.target_amount)}</span>
                      </div>
                    </div>

                    <div className="goal-progress">
                      <div className="progress-bar-wrapper">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="progress-text">{progress}% Complete</span>
                    </div>

                    <div className="goal-footer">
                      <span className="goal-date">🗓️ {formatDate(goal.target_date)}</span>
                      <span className={`goal-status ${goal.status}`}>
                        {goal.status === 'active' ? '🟢 Active' : goal.status === 'completed' ? '✅ Completed' : '⏸️ Paused'}
                      </span>
                    </div>

                    {goal.status !== 'completed' && (
                      <button className="btn-save-money" onClick={() => openSaveModal(goal)}>
                        💰 Save Money
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Save Money Modal */}
      {showSaveModal && savingToGoal && (
        <div className="modal-overlay" onClick={closeSaveModal}>
          <div className="modal-content save-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">💰 Save Money to Goal</h2>
              <button className="modal-close-btn" onClick={closeSaveModal}>✕</button>
            </div>

            <form onSubmit={handleSaveToGoal}>
              <div className="modal-body">
                <div className="save-goal-info">
                  <div className="save-goal-icon">{savingToGoal.icon}</div>
                  <div>
                    <h3 className="save-goal-title">{savingToGoal.title}</h3>
                    <p className="save-goal-progress">
                      {formatCurrency(savingToGoal.current_amount)} of {formatCurrency(savingToGoal.target_amount)}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="alert-banner error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <div className="form-field">
                  <label>Amount to Save (R) *</label>
                  <input
                    type="number"
                    value={saveAmount}
                    onChange={(e) => setSaveAmount(e.target.value)}
                    placeholder="500"
                    min="0.01"
                    step="0.01"
                    required
                    className="input-field save-amount-input"
                    autoFocus
                  />
                  <small className="field-hint">
                    Remaining: {formatCurrency(savingToGoal.target_amount - savingToGoal.current_amount)}
                  </small>
                </div>

                <div className="save-preview">
                  <div className="preview-row">
                    <span>Current Amount:</span>
                    <span className="preview-value">{formatCurrency(savingToGoal.current_amount)}</span>
                  </div>
                  <div className="preview-row">
                    <span>Adding:</span>
                    <span className="preview-value preview-add">
                      + {saveAmount ? formatCurrency(Math.round(parseFloat(saveAmount) * 100)) : 'R 0.00'}
                    </span>
                  </div>
                  <div className="preview-row preview-total">
                    <span>New Amount:</span>
                    <span className="preview-value">
                      {saveAmount
                        ? formatCurrency(savingToGoal.current_amount + Math.round(parseFloat(saveAmount) * 100))
                        : formatCurrency(savingToGoal.current_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeSaveModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Goal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content goal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
              <button className="modal-close-btn" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert-banner error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <div className="form-field">
                  <label>Goal Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Buy a new car"
                    required
                    className="input-field"
                  />
                </div>

                <div className="form-field">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add more details about your goal..."
                    rows="3"
                    className="input-field"
                  />
                </div>

                <div className="form-field">
                  <label>Category *</label>
                  <div className="category-selector">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        className={`category-btn ${formData.category === cat.name ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(cat)}
                      >
                        <span className="category-icon">{cat.icon}</span>
                        <span className="category-name">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Target Amount (R) *</label>
                    <input
                      type="number"
                      name="target_amount"
                      value={formData.target_amount}
                      onChange={handleInputChange}
                      placeholder="50000"
                      min="0"
                      step="100"
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="form-field">
                    <label>Current Amount (R)</label>
                    <input
                      type="number"
                      name="current_amount"
                      value={formData.current_amount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="100"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Target Date</label>
                    <input
                      type="date"
                      name="target_date"
                      value={formData.target_date}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="form-field">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
