import { useState, useEffect } from 'react';
import './Settings.css';

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
      daily_limit: (settingsData.daily_limit || 500000) / 100, // Convert cents to rands
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

      // Convert rands to cents for limits
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
      <div className="settings-container">
        <div className="settings-loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="banking-app">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>TestAiApp</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className="nav-item"
            onClick={() => onNavigate('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button
            className="nav-item"
            onClick={() => onNavigate('accounts')}
          >
            <span className="nav-icon">🏦</span>
            <span className="nav-text">Accounts</span>
          </button>
          <button
            className="nav-item"
            onClick={() => onNavigate('investments')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">Investments</span>
          </button>
          <button
            className="nav-item"
            onClick={() => onNavigate('crypto')}
          >
            <span className="nav-icon">₿</span>
            <span className="nav-text">Crypto</span>
          </button>
          <button
            className="nav-item"
            onClick={() => onNavigate('health')}
          >
            <span className="nav-icon">💪</span>
            <span className="nav-text">Health & Fitness</span>
          </button>
          <button
            className="nav-item active"
            onClick={() => onNavigate('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>Settings</h1>
            <p className="subtitle">Manage your account settings and preferences</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-email">{userEmail}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="settings-content">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Address Section */}
          <section className="settings-section">
            <h2 className="section-title">Address Information</h2>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="street_address">Street Address</label>
                <input
                  type="text"
                  id="street_address"
                  name="street_address"
                  value={formData.street_address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Johannesburg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="postal_code">Postal Code</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="2000"
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="South Africa"
                />
              </div>
            </div>
          </section>

          {/* Transaction Limits Section */}
          <section className="settings-section">
            <h2 className="section-title">Transaction Limits</h2>
            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="daily_limit">Daily Limit (ZAR)</label>
                <input
                  type="number"
                  id="daily_limit"
                  name="daily_limit"
                  value={formData.daily_limit}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                />
                <small className="form-help">Maximum daily transaction limit</small>
              </div>
              <div className="form-group">
                <label htmlFor="monthly_limit">Monthly Limit (ZAR)</label>
                <input
                  type="number"
                  id="monthly_limit"
                  name="monthly_limit"
                  value={formData.monthly_limit}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                />
                <small className="form-help">Maximum monthly transaction limit</small>
              </div>
            </div>
          </section>

          {/* Card Settings Section */}
          <section className="settings-section">
            <h2 className="section-title">Card Settings</h2>
            <div className="settings-toggles">
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Card Enabled</h3>
                  <p>Enable or disable your card</p>
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
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Contactless Payments</h3>
                  <p>Enable tap-to-pay functionality</p>
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
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>Online Payments</h3>
                  <p>Allow online purchases with your card</p>
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
              <div className="toggle-item">
                <div className="toggle-info">
                  <h3>International Transactions</h3>
                  <p>Allow transactions outside South Africa</p>
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
          </section>

          {/* Action Buttons */}
          <div className="settings-actions">
            <button
              className="btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
