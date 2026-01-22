import { useState } from 'react';
import './Accounts.css';

function Accounts({ userEmail, onLogout, onNavigate }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

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

  // Transaction history per account
  const transactionHistory = {
    1: [ // Current Account
      { id: 1, type: 'Credit', description: 'Salary Deposit - ABC Corp', amount: 35000.00, balance: 45678.90, date: '2026-01-19', time: '09:15', reference: 'SAL202601' },
      { id: 2, type: 'Debit', description: 'Woolworths - Groceries', amount: -1250.50, balance: 12928.90, date: '2026-01-20', time: '14:32', reference: 'POS45623' },
      { id: 3, type: 'Debit', description: 'Pick n Pay', amount: -875.20, balance: 14179.40, date: '2026-01-15', time: '18:45', reference: 'POS45511' },
      { id: 4, type: 'Debit', description: 'Netflix Subscription', amount: -199.00, balance: 15054.60, date: '2026-01-14', time: '00:05', reference: 'DD23456' },
      { id: 5, type: 'Credit', description: 'Refund - Amazon', amount: 450.00, balance: 15253.60, date: '2026-01-13', time: '11:22', reference: 'REF78910' },
      { id: 6, type: 'Debit', description: 'Uber Trip', amount: -125.50, balance: 14803.60, date: '2026-01-12', time: '22:10', reference: 'UBR12345' },
      { id: 7, type: 'Debit', description: 'Takealot Purchase', amount: -2350.00, balance: 14929.10, date: '2026-01-11', time: '16:30', reference: 'TKL98765' },
      { id: 8, type: 'Credit', description: 'Transfer from Savings', amount: 5000.00, balance: 17279.10, date: '2026-01-10', time: '10:00', reference: 'TRF00123' },
    ],
    2: [ // Savings Account
      { id: 1, type: 'Credit', description: 'Interest Payment', amount: 523.45, balance: 125450.50, date: '2026-01-20', time: '00:01', reference: 'INT202601' },
      { id: 2, type: 'Credit', description: 'Monthly Deposit', amount: 10000.00, balance: 124927.05, date: '2026-01-19', time: '09:00', reference: 'DEP55231' },
      { id: 3, type: 'Debit', description: 'Transfer to Current', amount: -5000.00, balance: 114927.05, date: '2026-01-18', time: '10:15', reference: 'TRF00124' },
      { id: 4, type: 'Credit', description: 'Bonus Deposit', amount: 8000.00, balance: 119927.05, date: '2026-01-15', time: '14:20', reference: 'BON12345' },
    ],
    3: [ // Investment Account
      { id: 1, type: 'Credit', description: 'Dividend - ABC Limited', amount: 2850.75, balance: 287900.75, date: '2026-01-17', time: '08:30', reference: 'DIV45678' },
      { id: 2, type: 'Credit', description: 'Capital Gain', amount: 12500.00, balance: 285050.00, date: '2026-01-10', time: '15:45', reference: 'CAP98765' },
      { id: 3, type: 'Debit', description: 'Investment Fee', amount: -450.00, balance: 272550.00, date: '2026-01-05', time: '09:00', reference: 'FEE11223' },
      { id: 4, type: 'Credit', description: 'Dividend - XYZ Fund', amount: 1850.50, balance: 273000.00, date: '2026-01-03', time: '10:30', reference: 'DIV55667' },
    ],
    4: [ // Emergency Fund
      { id: 1, type: 'Credit', description: 'Monthly Auto-save', amount: 2000.00, balance: 58200.00, date: '2026-01-20', time: '00:05', reference: 'AUT22334' },
      { id: 2, type: 'Credit', description: 'Interest Payment', amount: 243.50, balance: 56200.00, date: '2026-01-20', time: '00:01', reference: 'INT202602' },
      { id: 3, type: 'Credit', description: 'Monthly Auto-save', amount: 2000.00, balance: 55956.50, date: '2025-12-20', time: '00:05', reference: 'AUT22333' },
    ],
    5: [ // Travel Fund
      { id: 1, type: 'Credit', description: 'Monthly Auto-save', amount: 1500.00, balance: 34567.25, date: '2026-01-16', time: '00:05', reference: 'AUT33445' },
      { id: 2, type: 'Credit', description: 'Interest Payment', amount: 145.75, balance: 33067.25, date: '2026-01-20', time: '00:01', reference: 'INT202603' },
      { id: 3, type: 'Debit', description: 'Flight Booking', amount: -8500.00, balance: 32921.50, date: '2025-12-28', time: '16:20', reference: 'FLT77889' },
      { id: 4, type: 'Credit', description: 'Monthly Auto-save', amount: 1500.00, balance: 41421.50, date: '2025-12-16', time: '00:05', reference: 'AUT33444' },
    ],
  };

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

  const handleAccountClick = (accountId) => {
    setSelectedAccount(accountId);
    setShowTransactionHistory(true);
  };

  const closeTransactionHistory = () => {
    setShowTransactionHistory(false);
    setSelectedAccount(null);
  };

  const getSelectedAccountData = () => {
    return accounts.find(acc => acc.id === selectedAccount);
  };

  const getSelectedAccountTransactions = () => {
    return transactionHistory[selectedAccount] || [];
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
                onClick={() => handleAccountClick(account.id)}
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

      {/* Transaction History Modal */}
      {showTransactionHistory && selectedAccount && (
        <div className="modal-overlay" onClick={closeTransactionHistory}>
          <div className="modal-content transaction-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2 className="modal-title">Transaction History</h2>
                <div className="modal-account-info">
                  <span className="modal-account-icon">{getSelectedAccountData()?.icon}</span>
                  <div>
                    <div className="modal-account-name">{getSelectedAccountData()?.name}</div>
                    <div className="modal-account-number">
                      Account: ****{getSelectedAccountData()?.accountNumber.slice(-4)}
                    </div>
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeTransactionHistory}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="transaction-history-header">
                <div className="current-balance-display">
                  <span className="balance-label">Current Balance</span>
                  <span className="balance-amount">{formatCurrency(getSelectedAccountData()?.balance)}</span>
                </div>
                <div className="statement-actions">
                  <button className="statement-download-btn">📥 Download PDF</button>
                  <button className="statement-filter-btn">🔍 Filter</button>
                </div>
              </div>

              <div className="transactions-table">
                <div className="table-header">
                  <div className="th-date">Date & Time</div>
                  <div className="th-description">Description</div>
                  <div className="th-reference">Reference</div>
                  <div className="th-amount">Amount</div>
                  <div className="th-balance">Balance</div>
                </div>
                <div className="table-body">
                  {getSelectedAccountTransactions().length > 0 ? (
                    getSelectedAccountTransactions().map((transaction) => (
                      <div key={transaction.id} className="transaction-row">
                        <div className="td-date">
                          <div className="transaction-date">{transaction.date}</div>
                          <div className="transaction-time">{transaction.time}</div>
                        </div>
                        <div className="td-description">
                          <div className="transaction-desc">{transaction.description}</div>
                          <div className={`transaction-type-badge ${transaction.type.toLowerCase()}`}>
                            {transaction.type}
                          </div>
                        </div>
                        <div className="td-reference">{transaction.reference}</div>
                        <div className={`td-amount ${transaction.amount > 0 ? 'credit' : 'debit'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                        <div className="td-balance">{formatCurrency(transaction.balance)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-transactions">
                      <span className="no-transactions-icon">📭</span>
                      <p>No transactions found for this account</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeTransactionHistory}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;
