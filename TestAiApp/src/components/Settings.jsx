import { useState, useEffect } from 'react';
import './Dashboard.css';

function Settings({ userEmail, token, onLogout, onNavigate }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    street_address: '',
    city: '',
    postal_code: '',
    country: 'South Africa',
    daily_limit: 5000,
    monthly_limit: 50000,
    card_enabled: true,
    contactless_enabled: true,
    online_payments_enabled: true,
    international_transactions_enabled: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:3001/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        // Initialize settings if they don't exist
        const initResponse = await fetch('http://localhost:3001/api/settings/initialize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const initData = await initResponse.json();
        setSettings(initData.settings);
        populateFormData(initData.settings);
      } else if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        populateFormData(data.settings);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (settingsData) => {
    setFormData({
      street_address: settingsData.street_address || '',
      city: settingsData.city || '',
      postal_code: settingsData.postal_code || '',
      country: settingsData.country || 'South Africa',
      daily_limit: (settingsData.daily_limit || 500000) / 100,
      monthly_limit: (settingsData.monthly_limit || 5000000) / 100,
      card_enabled: settingsData.card_enabled !== false,
      contactless_enabled: settingsData.contactless_enabled !== false,
      online_payments_enabled: settingsData.online_payments_enabled !== false,
      international_transactions_enabled: settingsData.international_transactions_enabled === true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSuccess('');
    setError('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updatedSettings = {
        ...formData,
        daily_limit: Math.round(parseFloat(formData.daily_limit) * 100),
        monthly_limit: Math.round(parseFloat(formData.monthly_limit) * 100),
      };

      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (settings) {
      populateFormData(settings);
      setSuccess('');
      setError('');
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-message">Loading settings...</div>
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
            <button className="nav-item" onClick={() => onNavigate('crypto')}>
              <span className="nav-icon">₿</span>
              <span>Crypto</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('health')}>
              <span className="nav-icon">❤️</span>
              <span>Health & Fitness</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">🎯</span>
              <span>Goals</span>
            </button>
            <button className="nav-item active">
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          <div className="panel-header">
            <h2 className="panel-title">Account Settings</h2>
            <p className="panel-subtitle">Manage your personal information and preferences</p>
          </div>

          {error && (
            <div className="alert-banner error">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="alert-banner success">
              <span>✅</span> {success}
            </div>
          )}

          <div className="settings-container">
            {/* Address Information */}
            <div className="settings-card">
              <h3 className="card-title">Address Information</h3>
              <div className="settings-form-grid">
                <div className="form-field">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="input-field"
                  />
                </div>
                <div className="form-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Johannesburg"
                    className="input-field"
                  />
                </div>
                <div className="form-field">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="2000"
                    className="input-field"
                  />
                </div>
                <div className="form-field">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="South Africa"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Transaction Limits */}
            <div className="settings-card">
              <h3 className="card-title">Transaction Limits</h3>
              <div className="settings-form-grid">
                <div className="form-field">
                  <label>Daily Limit (R)</label>
                  <input
                    type="number"
                    name="daily_limit"
                    value={formData.daily_limit}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    className="input-field"
                  />
                  <small className="field-hint">Maximum daily spending limit</small>
                </div>
                <div className="form-field">
                  <label>Monthly Limit (R)</label>
                  <input
                    type="number"
                    name="monthly_limit"
                    value={formData.monthly_limit}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    className="input-field"
                  />
                  <small className="field-hint">Maximum monthly spending limit</small>
                </div>
              </div>
            </div>

            {/* Card Preferences */}
            <div className="settings-card">
              <h3 className="card-title">Card Preferences</h3>
              <div className="toggle-list">
                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">Card Enabled</div>
                    <div className="toggle-description">Enable or disable your physical card</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="card_enabled"
                      checked={formData.card_enabled}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">Contactless Payments</div>
                    <div className="toggle-description">Enable tap-to-pay functionality</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="contactless_enabled"
                      checked={formData.contactless_enabled}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">Online Payments</div>
                    <div className="toggle-description">Allow online purchases with your card</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="online_payments_enabled"
                      checked={formData.online_payments_enabled}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">International Transactions</div>
                    <div className="toggle-description">Allow transactions outside South Africa</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="international_transactions_enabled"
                      checked={formData.international_transactions_enabled}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="settings-actions">
              <button
                className="btn-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
