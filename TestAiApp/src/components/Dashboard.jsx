import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ userEmail, onLogout, onNavigate }) {
  const [selectedAccount, setSelectedAccount] = useState('checking');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);

  const accounts = {
    checking: { balance: 12345.67, account: '****4521' },
    savings: { balance: 28900.50, account: '****8832' },
    credit: { balance: -1250.00, account: '****2341' }
  };

  const recentTransactions = [
    { id: 1, name: 'Starbucks', amount: -5.45, date: '2026-01-20', category: 'Food & Drink' },
    { id: 2, name: 'Salary Deposit', amount: 3500.00, date: '2026-01-19', category: 'Income' },
    { id: 3, name: 'Netflix', amount: -15.99, date: '2026-01-18', category: 'Entertainment' },
    { id: 4, name: 'Amazon', amount: -67.32, date: '2026-01-17', category: 'Shopping' },
    { id: 5, name: 'Transfer to Savings', amount: -500.00, date: '2026-01-16', category: 'Transfer' }
  ];

  const quickActions = [
    { icon: '💸', label: 'Send Money', action: 'send' },
    { icon: '📱', label: 'Pay Bills', action: 'bills' },
    { icon: '💳', label: 'Cards', action: 'cards' },
    { icon: '📊', label: 'Analytics', action: 'analytics' }
  ];

  // Fetch ZAR to USD exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/ZAR');
        const data = await response.json();
        setExchangeRate(data.rates.USD);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setExchangeRate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
    // Refresh every 5 minutes
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
            <button className="nav-item active">
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
            <button className="nav-item" onClick={() => onNavigate('settings')}>
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          {/* Account Cards */}
          <section className="account-cards">
            <div
              className={`account-card ${selectedAccount === 'checking' ? 'active' : ''}`}
              onClick={() => setSelectedAccount('checking')}
            >
              <div className="card-header">
                <span className="card-type">Checking Account</span>
                <span className="card-number">{accounts.checking.account}</span>
              </div>
              <div className="card-balance">
                ${accounts.checking.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div
              className={`account-card savings ${selectedAccount === 'savings' ? 'active' : ''}`}
              onClick={() => setSelectedAccount('savings')}
            >
              <div className="card-header">
                <span className="card-type">Savings Account</span>
                <span className="card-number">{accounts.savings.account}</span>
              </div>
              <div className="card-balance">
                ${accounts.savings.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div
              className={`account-card credit ${selectedAccount === 'credit' ? 'active' : ''}`}
              onClick={() => setSelectedAccount('credit')}
            >
              <div className="card-header">
                <span className="card-type">Credit Card</span>
                <span className="card-number">{accounts.credit.account}</span>
              </div>
              <div className="card-balance">
                ${Math.abs(accounts.credit.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="card-label">Current Balance</div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              {quickActions.map((action) => (
                <button key={action.action} className="action-btn">
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="transactions">
            <h2 className="section-title">Recent Transactions</h2>
            <div className="transactions-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-name">{transaction.name}</div>
                    <div className="transaction-meta">
                      <span className="transaction-category">{transaction.category}</span>
                      <span className="transaction-date">{transaction.date}</span>
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar - Insights */}
        <aside className="insights-panel">
          <div className="insights-card">
            <h3 className="insights-title">Monthly Summary</h3>
            <div className="insight-item">
              <span className="insight-label">Income</span>
              <span className="insight-value positive">+$3,500.00</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Expenses</span>
              <span className="insight-value negative">-$588.76</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Net Savings</span>
              <span className="insight-value">$2,911.24</span>
            </div>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Spending by Category</h3>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">Food & Drink</span>
                <span className="category-amount">$245.30</span>
              </div>
              <div className="category-bar">
                <div className="category-progress" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">Shopping</span>
                <span className="category-amount">$187.50</span>
              </div>
              <div className="category-bar">
                <div className="category-progress" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div className="category-item">
              <div className="category-info">
                <span className="category-name">Entertainment</span>
                <span className="category-amount">$155.96</span>
              </div>
              <div className="category-bar">
                <div className="category-progress" style={{ width: '28%' }}></div>
              </div>
            </div>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Exchange Rate</h3>
            <div className="exchange-rate-display">
              <div className="exchange-rate-header">
                <span className="currency-flag">🇿🇦</span>
                <span className="currency-pair">ZAR / USD</span>
                <span className="currency-flag">🇺🇸</span>
              </div>
              {loading ? (
                <div className="exchange-rate-loading">Loading...</div>
              ) : exchangeRate ? (
                <>
                  <div className="exchange-rate-value">
                    R 1.00 = ${exchangeRate.toFixed(4)}
                  </div>
                  <div className="exchange-rate-inverse">
                    $1.00 = R {(1 / exchangeRate).toFixed(2)}
                  </div>
                  <div className="exchange-rate-footer">
                    <span className="exchange-rate-label">Live Rate</span>
                    <span className="exchange-rate-update">Updated every 5 min</span>
                  </div>
                </>
              ) : (
                <div className="exchange-rate-error">Unable to fetch rate</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
