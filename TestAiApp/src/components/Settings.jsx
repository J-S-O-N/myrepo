import { useState, useEffect } from 'react';
import './Dashboard.css';
import './Settings.css';

function Settings({ userEmail, token, onLogout, onNavigate }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Section-specific state for Address
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');

  // Section-specific state for Transaction Limits
  const [limitsSaving, setLimitsSaving] = useState(false);
  const [limitsError, setLimitsError] = useState('');
  const [limitsSuccess, setLimitsSuccess] = useState('');

  // Section-specific state for Card Preferences
  const [cardSaving, setCardSaving] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardSuccess, setCardSuccess] = useState('');

  // Section-specific state for Communication Preferences
  const [commSaving, setCommSaving] = useState(false);
  const [commError, setCommError] = useState('');
  const [commSuccess, setCommSuccess] = useState('');

  // Strava configuration state
  const [stravaConfig, setStravaConfig] = useState({
    configured: false,
    clientId: '',
    redirectUri: '',
  });
  const [stravaFormData, setStravaFormData] = useState({
    clientId: '',
    clientSecret: '',
  });
  const [stravaSaving, setStravaSaving] = useState(false);
  const [stravaError, setStravaError] = useState('');
  const [stravaSuccess, setStravaSuccess] = useState('');

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
    fetchStravaConfig();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

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
      console.error('Error fetching settings:', err);
      // Set a generic error on one of the sections
      setAddressError('Failed to load settings. Please refresh the page.');
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

  const fetchStravaConfig = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/config/strava', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStravaConfig(data);
      }
    } catch (err) {
      console.error('Error fetching Strava config:', err);
    }
  };

  const handleStravaInputChange = (e) => {
    const { name, value } = e.target;
    setStravaFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setStravaSuccess('');
    setStravaError('');
  };

  const handleStravaSave = async () => {
    try {
      setStravaSaving(true);
      setStravaError('');
      setStravaSuccess('');

      if (!stravaFormData.clientId || !stravaFormData.clientSecret) {
        setStravaError('Both Client ID and Client Secret are required');
        setStravaSaving(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/config/strava', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(stravaFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save Strava configuration');
      }

      const data = await response.json();
      setStravaSuccess(data.message);
      setStravaFormData({ clientId: '', clientSecret: '' }); // Clear form
      fetchStravaConfig(); // Refresh config status
    } catch (err) {
      setStravaError(err.message);
    } finally {
      setStravaSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear all success/error messages when user makes changes
    setAddressSuccess('');
    setAddressError('');
    setLimitsSuccess('');
    setLimitsError('');
    setCardSuccess('');
    setCardError('');
    setCommSuccess('');
    setCommError('');
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

  // Save Address Information
  const handleSaveAddress = async () => {
    try {
      setAddressSaving(true);
      setAddressError('');
      setAddressSuccess('');

      const updatedSettings = {
        street_address: formData.street_address,
        city: formData.city,
        postal_code: formData.postal_code,
        country: formData.country,
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
        throw new Error(errorData.error || 'Failed to save address');
      }

      const data = await response.json();
      setSettings(data.settings);
      setAddressSuccess('Address saved successfully!');
    } catch (err) {
      setAddressError(err.message);
    } finally {
      setAddressSaving(false);
    }
  };

  // Save Transaction Limits
  const handleSaveLimits = async () => {
    try {
      setLimitsSaving(true);
      setLimitsError('');
      setLimitsSuccess('');

      // Validate transaction limits before submitting
      const validationError = validateTransactionLimits();
      if (validationError) {
        setLimitsError(validationError);
        setLimitsSaving(false);
        return;
      }

      const updatedSettings = {
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
        throw new Error(errorData.error || 'Failed to save transaction limits');
      }

      const data = await response.json();
      setSettings(data.settings);
      setLimitsSuccess('Transaction limits saved successfully!');
    } catch (err) {
      setLimitsError(err.message);
    } finally {
      setLimitsSaving(false);
    }
  };

  // Save Card Preferences
  const handleSaveCard = async () => {
    try {
      setCardSaving(true);
      setCardError('');
      setCardSuccess('');

      const updatedSettings = {
        card_enabled: formData.card_enabled,
        contactless_enabled: formData.contactless_enabled,
        online_payments_enabled: formData.online_payments_enabled,
        international_transactions_enabled: formData.international_transactions_enabled,
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
        throw new Error(errorData.error || 'Failed to save card preferences');
      }

      const data = await response.json();
      setSettings(data.settings);
      setCardSuccess('Card preferences saved successfully!');
    } catch (err) {
      setCardError(err.message);
    } finally {
      setCardSaving(false);
    }
  };

  // Save Communication Preferences
  const handleSaveComm = async () => {
    try {
      setCommSaving(true);
      setCommError('');
      setCommSuccess('');

      const updatedSettings = {
        email_notifications: formData.email_notifications,
        sms_notifications: formData.sms_notifications,
        whatsapp_notifications: formData.whatsapp_notifications,
        in_app_notifications: formData.in_app_notifications,
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
        throw new Error(errorData.error || 'Failed to save communication preferences');
      }

      const data = await response.json();
      setSettings(data.settings);
      setCommSuccess('Communication preferences saved successfully!');
    } catch (err) {
      setCommError(err.message);
    } finally {
      setCommSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
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
        <div className="dashboard-content">
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
          <main className="main-panel">
            <div className="settings-loading">Loading settings...</div>
          </main>
        </div>
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
            <h1 className="panel-title">⚙️ Settings</h1>
          </div>

          <div className="settings-container">
            {/* Address Information */}
            <div className="settings-card">
              <h3 className="card-title">Address Information</h3>

              {addressError && (
                <div className="alert-banner error" style={{ marginBottom: '1rem' }}>
                  <span>⚠️</span> {addressError}
                </div>
              )}
              {addressSuccess && (
                <div className="alert-banner success" style={{ marginBottom: '1rem' }}>
                  <span>✅</span> {addressSuccess}
                </div>
              )}

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

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-save"
                  onClick={handleSaveAddress}
                  disabled={addressSaving}
                >
                  {addressSaving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>

            {/* Transaction Limits */}
            <div className="settings-card">
              <h3 className="card-title">Transaction Limits</h3>

              {limitsError && (
                <div className="alert-banner error" style={{ marginBottom: '1rem' }}>
                  <span>⚠️</span> {limitsError}
                </div>
              )}
              {limitsSuccess && (
                <div className="alert-banner success" style={{ marginBottom: '1rem' }}>
                  <span>✅</span> {limitsSuccess}
                </div>
              )}

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

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-save"
                  onClick={handleSaveLimits}
                  disabled={limitsSaving}
                >
                  {limitsSaving ? 'Saving...' : 'Save Limits'}
                </button>
              </div>
            </div>

            {/* Card Preferences */}
            <div className="settings-card">
              <h3 className="card-title">Card Preferences</h3>

              {cardError && (
                <div className="alert-banner error" style={{ marginBottom: '1rem' }}>
                  <span>⚠️</span> {cardError}
                </div>
              )}
              {cardSuccess && (
                <div className="alert-banner success" style={{ marginBottom: '1rem' }}>
                  <span>✅</span> {cardSuccess}
                </div>
              )}

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

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-save"
                  onClick={handleSaveCard}
                  disabled={cardSaving}
                >
                  {cardSaving ? 'Saving...' : 'Save Card Preferences'}
                </button>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="settings-card">
              <h3 className="card-title">Communication Preferences</h3>

              {commError && (
                <div className="alert-banner error" style={{ marginBottom: '1rem' }}>
                  <span>⚠️</span> {commError}
                </div>
              )}
              {commSuccess && (
                <div className="alert-banner success" style={{ marginBottom: '1rem' }}>
                  <span>✅</span> {commSuccess}
                </div>
              )}

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

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-save"
                  onClick={handleSaveComm}
                  disabled={commSaving}
                >
                  {commSaving ? 'Saving...' : 'Save Communication Preferences'}
                </button>
              </div>
            </div>

            {/* API Integrations */}
            <div className="settings-card">
              <h3 className="card-title">🏃 Strava Integration</h3>
              <p className="card-description">
                Configure Strava API credentials to enable fitness tracking integration.
                <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: '#fc4c02' }}>
                  Get API Credentials →
                </a>
              </p>

              {stravaError && (
                <div className="alert-banner error" style={{ marginBottom: '1rem' }}>
                  <span>⚠️</span> {stravaError}
                </div>
              )}
              {stravaSuccess && (
                <div className="alert-banner success" style={{ marginBottom: '1rem' }}>
                  <span>✅</span> {stravaSuccess}
                </div>
              )}

              {stravaConfig.configured && (
                <div className="strava-status-badge">
                  ✅ Strava is configured (Client ID: {stravaConfig.clientId})
                </div>
              )}

              <div className="settings-form-grid">
                <div className="form-field">
                  <label>Client ID</label>
                  <input
                    type="text"
                    name="clientId"
                    value={stravaFormData.clientId}
                    onChange={handleStravaInputChange}
                    placeholder="Enter your Strava Client ID (numeric)"
                    className="input-field"
                  />
                  <small className="field-hint">Find this in your Strava API application settings</small>
                </div>
                <div className="form-field">
                  <label>Client Secret</label>
                  <input
                    type="password"
                    name="clientSecret"
                    value={stravaFormData.clientSecret}
                    onChange={handleStravaInputChange}
                    placeholder="Enter your Strava Client Secret"
                    className="input-field"
                  />
                  <small className="field-hint">Keep this secret and never share it publicly</small>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button
                  className="btn-save"
                  onClick={handleStravaSave}
                  disabled={stravaSaving}
                  style={{ marginRight: '0.5rem' }}
                >
                  {stravaSaving ? 'Saving...' : 'Save Strava Config'}
                </button>
                <small className="field-hint">
                  Redirect URI: {stravaConfig.redirectUri || 'http://localhost:3001/api/strava/callback'}
                </small>
              </div>

              <div className="strava-setup-info">
                <p><strong>Setup Steps:</strong></p>
                <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>Go to <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer">Strava API Settings</a></li>
                  <li>Create a new application or use an existing one</li>
                  <li>Set Authorization Callback Domain to: <code>localhost</code></li>
                  <li>Set Authorization Callback URL to: <code>{stravaConfig.redirectUri || 'http://localhost:3001/api/strava/callback'}</code></li>
                  <li>Copy your Client ID and Client Secret</li>
                  <li>Paste them in the fields above and click "Save Strava Config"</li>
                  <li>Go to Health & Fitness page to connect your account</li>
                </ol>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Insights */}
        <aside className="insights-panel">
          <div className="insights-card">
            <h3 className="insights-title">📋 Account Summary</h3>
            <div className="insight-item">
              <span className="insight-label">Account Status</span>
              <span className="insight-value positive">Active</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Profile Completion</span>
              <span className="insight-value">{settings && (settings.street_address && settings.city) ? '100%' : '50%'}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Last Updated</span>
              <span className="insight-value">Today</span>
            </div>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">🔒 Security Status</h3>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">Card Controls</span>
                <span className="category-amount">{formData.card_enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="category-bar">
                <div className="category-progress" style={{ width: formData.card_enabled ? '100%' : '0%' }}></div>
              </div>
            </div>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">Online Payments</span>
                <span className="category-amount">{formData.online_payments_enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="category-bar">
                <div className="category-progress" style={{ width: formData.online_payments_enabled ? '100%' : '0%' }}></div>
              </div>
            </div>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">International</span>
                <span className="category-amount">{formData.international_transactions_enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="category-bar">
                <div className="category-progress" style={{ width: formData.international_transactions_enabled ? '100%' : '0%' }}></div>
              </div>
            </div>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">💰 Transaction Limits</h3>
            <div className="insight-item">
              <span className="insight-label">Daily Limit</span>
              <span className="insight-value">R {formData.daily_limit.toLocaleString('en-ZA')}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Monthly Limit</span>
              <span className="insight-value">R {formData.monthly_limit.toLocaleString('en-ZA')}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">ATM Limit</span>
              <span className="insight-value">R {formData.atm_limit.toLocaleString('en-ZA')}</span>
            </div>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">📱 Quick Tips</h3>
            <div className="settings-tip">
              <div className="tip-icon">💡</div>
              <div className="tip-text">Enable notifications to stay updated on your account activity</div>
            </div>
            <div className="settings-tip">
              <div className="tip-icon">🔒</div>
              <div className="tip-text">Review your transaction limits regularly for security</div>
            </div>
            <div className="settings-tip">
              <div className="tip-icon">🌍</div>
              <div className="tip-text">Enable international transactions only when traveling</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Settings;
