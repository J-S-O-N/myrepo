import { useState } from 'react';
import './Accounts.css';

function Accounts({ userEmail, onLogout, onNavigate }) {
  const [selectedAccount, setSelectedAccount] = useState(null);

  const accounts = [
    {
      id: 1,
      name: 'Current Account',
      type: 'Checking',
      accountNumber: '4011234567',
      balance: 45678.90,
      currency: 'ZAR',
      icon: '💳',
      color: 'blue',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Savings Account',
      type: 'Savings',
      accountNumber: '4021234567',
      balance: 125450.50,
      currency: 'ZAR',
      icon: '🏦',
      color: 'green',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Investment Account',
      type: 'Investment',
      accountNumber: '4031234567',
      balance: 287900.75,
      currency: 'ZAR',
      icon: '📈',
      color: 'purple',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Emergency Fund',
      type: 'Savings',
      accountNumber: '4041234567',
      balance: 58200.00,
      currency: 'ZAR',
      icon: '🛡️',
      color: 'orange',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Travel Fund',
      type: 'Savings',
      accountNumber: '4051234567',
      balance: 34567.25,
      currency: 'ZAR',
      icon: '✈️',
      color: 'teal',
      status: 'Active'
    }
  ];

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const recentActivity = [
    { id: 1, account: 'Current Account', type: 'Debit', description: 'Woolworths', amount: -1250.50, date: '2026-01-20' },
    { id: 2, account: 'Current Account', type: 'Credit', description: 'Salary Deposit', amount: 35000.00, date: '2026-01-19' },
    { id: 3, account: 'Savings Account', type: 'Credit', description: 'Transfer from Current', amount: 5000.00, date: '2026-01-18' },
    { id: 4, account: 'Investment Account', type: 'Credit', description: 'Dividend Payment', amount: 2850.75, date: '2026-01-17' },
    { id: 5, account: 'Travel Fund', type: 'Credit', description: 'Monthly Auto-save', amount: 1500.00, date: '2026-01-16' },
    { id: 6, account: 'Current Account', type: 'Debit', description: 'Pick n Pay', amount: -875.20, date: '2026-01-15' }
  ];

  const formatCurrency = (amount) => {
    return `R ${Math.abs(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
            <button className="nav-item active">
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
            <button className="nav-item" onClick={() => onNavigate('settings')}>
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          <div className="accounts-header">
            <h1 className="page-title">My Accounts</h1>
            <button className="add-account-btn">+ Add Account</button>
          </div>

          {/* Total Balance Card */}
          <section className="total-balance-card">
            <div className="total-balance-content">
              <div className="total-balance-label">Total Balance</div>
              <div className="total-balance-amount">{formatCurrency(totalBalance)}</div>
              <div className="total-balance-accounts">{accounts.length} Active Accounts</div>
            </div>
            <div className="balance-icon">💰</div>
          </section>

          {/* Accounts List */}
          <section className="accounts-list">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`account-item ${account.color} ${selectedAccount === account.id ? 'selected' : ''}`}
                onClick={() => setSelectedAccount(account.id)}
              >
                <div className="account-icon-wrapper">
                  <div className={`account-icon ${account.color}`}>
                    {account.icon}
                  </div>
                </div>
                <div className="account-details">
                  <div className="account-name">{account.name}</div>
                  <div className="account-meta">
                    <span className="account-type">{account.type}</span>
                    <span className="account-divider">•</span>
                    <span className="account-number">****{account.accountNumber.slice(-4)}</span>
                  </div>
                </div>
                <div className="account-balance-section">
                  <div className="account-balance">{formatCurrency(account.balance)}</div>
                  <div className="account-status">
                    <span className={`status-badge ${account.status.toLowerCase()}`}>
                      {account.status}
                    </span>
                  </div>
                </div>
                <button className="account-action-btn">
                  <span>→</span>
                </button>
              </div>
            ))}
          </section>

          {/* Recent Activity */}
          <section className="recent-activity">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type.toLowerCase()}`}>
                    {activity.type === 'Credit' ? '↓' : '↑'}
                  </div>
                  <div className="activity-details">
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-meta">
                      <span className="activity-account">{activity.account}</span>
                      <span className="activity-divider">•</span>
                      <span className="activity-date">{activity.date}</span>
                    </div>
                  </div>
                  <div className={`activity-amount ${activity.amount > 0 ? 'credit' : 'debit'}`}>
                    {activity.amount > 0 ? '+' : ''}{formatCurrency(activity.amount)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar - Account Summary */}
        <aside className="insights-panel">
          <div className="insights-card">
            <h3 className="insights-title">Account Summary</h3>
            <div className="summary-item">
              <div className="summary-label">Checking Accounts</div>
              <div className="summary-count">1</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Savings Accounts</div>
              <div className="summary-count">3</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Investment Accounts</div>
              <div className="summary-count">1</div>
            </div>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Quick Actions</h3>
            <button className="quick-action-item">
              <span className="quick-action-icon">💸</span>
              <span className="quick-action-label">Transfer Money</span>
            </button>
            <button className="quick-action-item">
              <span className="quick-action-icon">📥</span>
              <span className="quick-action-label">Download Statement</span>
            </button>
            <button className="quick-action-item">
              <span className="quick-action-icon">⚙️</span>
              <span className="quick-action-label">Account Settings</span>
            </button>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Currency</h3>
            <div className="currency-info">
              <div className="currency-flag">🇿🇦</div>
              <div className="currency-details">
                <div className="currency-code">ZAR</div>
                <div className="currency-name">South African Rand</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Accounts;
