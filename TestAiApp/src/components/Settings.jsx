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
    mobile_app_limit: 3000,
    internet_banking_limit: 10000,
    atm_limit: 2000,
    card_enabled: true,
    contactless_enabled: true,
    online_payments_enabled: true,
    international_transactions_enabled: false,
    email_notifications: true,
    sms_notifications: true,
    whatsapp_notifications: false,
    in_app_notifications: true,
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
      mobile_app_limit: (settingsData.mobile_app_limit || 300000) / 100,
      internet_banking_limit: (settingsData.internet_banking_limit || 1000000) / 100,
      atm_limit: (settingsData.atm_limit || 200000) / 100,
      card_enabled: settingsData.card_enabled !== false,
      contactless_enabled: settingsData.contactless_enabled !== false,
      online_payments_enabled: settingsData.online_payments_enabled !== false,
      international_transactions_enabled: settingsData.international_transactions_enabled === true,
      email_notifications: settingsData.email_notifications !== false,
      sms_notifications: settingsData.sms_notifications !== false,
      whatsapp_notifications: settingsData.whatsapp_notifications === true,
      in_app_notifications: settingsData.in_app_notifications !== false,
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

  const validateTransactionLimits = () => {
    const dailyLimit = parseFloat(formData.daily_limit) || 0;
    const monthlyLimit = parseFloat(formData.monthly_limit) || 0;
    const mobileAppLimit = parseFloat(formData.mobile_app_limit) || 0;
    const internetBankingLimit = parseFloat(formData.internet_banking_limit) || 0;
    const atmLimit = parseFloat(formData.atm_limit) || 0;

    // Rule 1: Daily limit cannot exceed monthly limit
    if (dailyLimit > monthlyLimit) {
      return 'Daily limit cannot exceed monthly limit';
    }

    // Rule 2: Sum of all limits cannot be less than monthly limit
    const sumOfLimits = dailyLimit + mobileAppLimit + internetBankingLimit + atmLimit;
    if (sumOfLimits > monthlyLimit) {
      return 'Sum of daily, mobile app, internet banking, and ATM limits cannot be > than monthly limit';
    }

    return null;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validate transaction limits before submitting
      const validationError = validateTransactionLimits();
      if (validationError) {
        setError(validationError);
        setSaving(false);
        return;
      }

      const updatedSettings = {
        ...formData,
        daily_limit: Math.round(parseFloat(formData.daily_limit) * 100),
        monthly_limit: Math.round(parseFloat(formData.monthly_limit) * 100),
        mobile_app_limit: Math.round(parseFloat(formData.mobile_app_limit) * 100),
        internet_banking_limit: Math.round(parseFloat(formData.internet_banking_limit) * 100),
        atm_limit: Math.round(parseFloat(formData.atm_limit) * 100),
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
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
            <button className="nav-item" onClick={() => onNavigate('health')}>
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
                <div className="form-field">
                  <label>Mobile App Limit (R)</label>
                  <input
                    type="number"
                    name="mobile_app_limit"
                    value={formData.mobile_app_limit}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    className="input-field"
                  />
                  <small className="field-hint">Maximum limit for mobile app transactions</small>
                </div>
                <div className="form-field">
                  <label>Internet Banking Limit (R)</label>
                  <input
                    type="number"
                    name="internet_banking_limit"
                    value={formData.internet_banking_limit}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    className="input-field"
                  />
                  <small className="field-hint">Maximum limit for internet banking transactions</small>
                </div>
                <div className="form-field">
                  <label>ATM Limit (R)</label>
                  <input
                    type="number"
                    name="atm_limit"
                    value={formData.atm_limit}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    className="input-field"
                  />
                  <small className="field-hint">Maximum limit for ATM withdrawals</small>
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

            {/* Communication Preferences */}
            <div className="settings-card">
              <h3 className="card-title">Communication Preferences</h3>
              <div className="toggle-list">
                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">Email Notifications</div>
                    <div className="toggle-description">Receive notifications via email</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="email_notifications"
                      checked={formData.email_notifications}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">SMS Notifications</div>
                    <div className="toggle-description">Receive notifications via SMS</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="sms_notifications"
                      checked={formData.sms_notifications}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">WhatsApp Notifications</div>
                    <div className="toggle-description">Receive notifications via WhatsApp</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="whatsapp_notifications"
                      checked={formData.whatsapp_notifications}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-label">In-App Notifications</div>
                    <div className="toggle-description">Receive notifications within the app</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="in_app_notifications"
                      checked={formData.in_app_notifications}
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
