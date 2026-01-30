import { useState } from 'react';
import './Accounts.css';

function Accounts({ userEmail, onLogout, onNavigate }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    reference: '',
    scheduledDate: '',
    transferType: 'immediate', // 'immediate' or 'scheduled'
  });
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');
  const [transferStep, setTransferStep] = useState(1); // 1: Form, 2: Confirmation, 3: Success

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

  const openTransferModal = () => {
    setShowTransferModal(true);
    setTransferStep(1);
    setTransferForm({
      fromAccount: '',
      toAccount: '',
      amount: '',
      reference: '',
      scheduledDate: '',
      transferType: 'immediate',
    });
    setTransferError('');
    setTransferSuccess('');
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
    setTransferStep(1);
    setTransferForm({
      fromAccount: '',
      toAccount: '',
      amount: '',
      reference: '',
      scheduledDate: '',
      transferType: 'immediate',
    });
    setTransferError('');
    setTransferSuccess('');
  };

  const handleTransferInputChange = (e) => {
    const { name, value } = e.target;
    setTransferForm(prev => ({
      ...prev,
      [name]: value,
    }));
    setTransferError('');
  };

  const handleTransferTypeChange = (type) => {
    setTransferForm(prev => ({
      ...prev,
      transferType: type,
    }));
  };

  const validateTransferForm = () => {
    if (!transferForm.fromAccount) {
      setTransferError('Please select a source account');
      return false;
    }
    if (!transferForm.toAccount) {
      setTransferError('Please select a destination account');
      return false;
    }
    if (transferForm.fromAccount === transferForm.toAccount) {
      setTransferError('Source and destination accounts must be different');
      return false;
    }
    if (!transferForm.amount || parseFloat(transferForm.amount) <= 0) {
      setTransferError('Please enter a valid amount');
      return false;
    }

    const fromAccount = accounts.find(acc => acc.id === parseInt(transferForm.fromAccount));
    if (fromAccount && parseFloat(transferForm.amount) > fromAccount.balance) {
      setTransferError('Insufficient funds in source account');
      return false;
    }

    if (transferForm.transferType === 'scheduled' && !transferForm.scheduledDate) {
      setTransferError('Please select a date for scheduled transfer');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (transferStep === 1) {
      if (validateTransferForm()) {
        setTransferStep(2);
      }
    }
  };

  const handleBackStep = () => {
    if (transferStep === 2) {
      setTransferStep(1);
    }
  };

  const handleConfirmTransfer = () => {
    // Simulate API call to process transfer
    setTimeout(() => {
      setTransferSuccess('Transfer completed successfully!');
      setTransferStep(3);
    }, 1000);
  };

  const getAccountById = (id) => {
    return accounts.find(acc => acc.id === parseInt(id));
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
            <button className="quick-action-item" onClick={openTransferModal}>
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

      {/* Transfer Money Modal */}
      {showTransferModal && (
        <div className="modal-overlay" onClick={closeTransferModal}>
          <div className="modal-content transfer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {transferStep === 1 && '💸 Transfer Money'}
                {transferStep === 2 && '✅ Confirm Transfer'}
                {transferStep === 3 && '🎉 Transfer Complete'}
              </h2>
              <button className="modal-close-btn" onClick={closeTransferModal}>✕</button>
            </div>

            <div className="modal-body">
              {/* Step 1: Transfer Form */}
              {transferStep === 1 && (
                <div className="transfer-form">
                  {transferError && (
                    <div className="alert-banner error">
                      <span>⚠️</span> {transferError}
                    </div>
                  )}

                  {/* Transfer Type Selection */}
                  <div className="transfer-type-selector">
                    <button
                      className={`transfer-type-btn ${transferForm.transferType === 'immediate' ? 'active' : ''}`}
                      onClick={() => handleTransferTypeChange('immediate')}
                    >
                      <span className="type-icon">⚡</span>
                      <div className="type-info">
                        <div className="type-name">Immediate Transfer</div>
                        <div className="type-desc">Transfer funds instantly</div>
                      </div>
                    </button>
                    <button
                      className={`transfer-type-btn ${transferForm.transferType === 'scheduled' ? 'active' : ''}`}
                      onClick={() => handleTransferTypeChange('scheduled')}
                    >
                      <span className="type-icon">📅</span>
                      <div className="type-info">
                        <div className="type-name">Scheduled Transfer</div>
                        <div className="type-desc">Schedule for a future date</div>
                      </div>
                    </button>
                  </div>

                  {/* From Account */}
                  <div className="form-group">
                    <label htmlFor="fromAccount">From Account</label>
                    <select
                      id="fromAccount"
                      name="fromAccount"
                      value={transferForm.fromAccount}
                      onChange={handleTransferInputChange}
                      className="transfer-select"
                    >
                      <option value="">Select source account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.icon} {account.name} - {formatCurrency(account.balance)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* To Account */}
                  <div className="form-group">
                    <label htmlFor="toAccount">To Account</label>
                    <select
                      id="toAccount"
                      name="toAccount"
                      value={transferForm.toAccount}
                      onChange={handleTransferInputChange}
                      className="transfer-select"
                    >
                      <option value="">Select destination account</option>
                      {accounts
                        .filter(acc => acc.id !== parseInt(transferForm.fromAccount))
                        .map(account => (
                          <option key={account.id} value={account.id}>
                            {account.icon} {account.name} - {formatCurrency(account.balance)}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="form-group">
                    <label htmlFor="amount">Amount (ZAR)</label>
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">R</span>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={transferForm.amount}
                        onChange={handleTransferInputChange}
                        placeholder="0.00"
                        className="transfer-input amount-input"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {transferForm.fromAccount && (
                      <small className="form-hint">
                        Available: {formatCurrency(getAccountById(transferForm.fromAccount)?.balance || 0)}
                      </small>
                    )}
                  </div>

                  {/* Reference */}
                  <div className="form-group">
                    <label htmlFor="reference">Reference (Optional)</label>
                    <input
                      type="text"
                      id="reference"
                      name="reference"
                      value={transferForm.reference}
                      onChange={handleTransferInputChange}
                      placeholder="e.g., Monthly savings"
                      className="transfer-input"
                      maxLength="50"
                    />
                  </div>

                  {/* Scheduled Date (if scheduled transfer) */}
                  {transferForm.transferType === 'scheduled' && (
                    <div className="form-group">
                      <label htmlFor="scheduledDate">Transfer Date</label>
                      <input
                        type="date"
                        id="scheduledDate"
                        name="scheduledDate"
                        value={transferForm.scheduledDate}
                        onChange={handleTransferInputChange}
                        className="transfer-input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}

                  {/* Quick Amount Buttons */}
                  {transferForm.fromAccount && (
                    <div className="quick-amounts">
                      <span className="quick-amounts-label">Quick amounts:</span>
                      <button
                        type="button"
                        className="quick-amount-btn"
                        onClick={() => setTransferForm(prev => ({
                          ...prev,
                          amount: (getAccountById(transferForm.fromAccount)?.balance * 0.25).toFixed(2)
                        }))}
                      >
                        25%
                      </button>
                      <button
                        type="button"
                        className="quick-amount-btn"
                        onClick={() => setTransferForm(prev => ({
                          ...prev,
                          amount: (getAccountById(transferForm.fromAccount)?.balance * 0.5).toFixed(2)
                        }))}
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        className="quick-amount-btn"
                        onClick={() => setTransferForm(prev => ({
                          ...prev,
                          amount: (getAccountById(transferForm.fromAccount)?.balance * 0.75).toFixed(2)
                        }))}
                      >
                        75%
                      </button>
                      <button
                        type="button"
                        className="quick-amount-btn"
                        onClick={() => setTransferForm(prev => ({
                          ...prev,
                          amount: getAccountById(transferForm.fromAccount)?.balance.toFixed(2)
                        }))}
                      >
                        All
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Confirmation */}
              {transferStep === 2 && (
                <div className="transfer-confirmation">
                  <div className="confirmation-card">
                    <div className="confirmation-header">
                      <span className="confirmation-icon">💸</span>
                      <h3>Review Transfer Details</h3>
                    </div>

                    <div className="confirmation-details">
                      <div className="confirmation-row">
                        <span className="confirmation-label">From:</span>
                        <span className="confirmation-value">
                          {getAccountById(transferForm.fromAccount)?.icon} {getAccountById(transferForm.fromAccount)?.name}
                          <br />
                          <small>****{getAccountById(transferForm.fromAccount)?.accountNumber.slice(-4)}</small>
                        </span>
                      </div>

                      <div className="confirmation-arrow">↓</div>

                      <div className="confirmation-row">
                        <span className="confirmation-label">To:</span>
                        <span className="confirmation-value">
                          {getAccountById(transferForm.toAccount)?.icon} {getAccountById(transferForm.toAccount)?.name}
                          <br />
                          <small>****{getAccountById(transferForm.toAccount)?.accountNumber.slice(-4)}</small>
                        </span>
                      </div>

                      <div className="confirmation-divider"></div>

                      <div className="confirmation-row highlight">
                        <span className="confirmation-label">Amount:</span>
                        <span className="confirmation-value amount">
                          {formatCurrency(parseFloat(transferForm.amount))}
                        </span>
                      </div>

                      {transferForm.reference && (
                        <div className="confirmation-row">
                          <span className="confirmation-label">Reference:</span>
                          <span className="confirmation-value">{transferForm.reference}</span>
                        </div>
                      )}

                      <div className="confirmation-row">
                        <span className="confirmation-label">Transfer Type:</span>
                        <span className="confirmation-value">
                          {transferForm.transferType === 'immediate' ? '⚡ Immediate' : '📅 Scheduled'}
                        </span>
                      </div>

                      {transferForm.transferType === 'scheduled' && (
                        <div className="confirmation-row">
                          <span className="confirmation-label">Scheduled Date:</span>
                          <span className="confirmation-value">{transferForm.scheduledDate}</span>
                        </div>
                      )}

                      <div className="confirmation-divider"></div>

                      <div className="confirmation-row">
                        <span className="confirmation-label">Processing Time:</span>
                        <span className="confirmation-value">
                          {transferForm.transferType === 'immediate' ? 'Instant' : 'On scheduled date'}
                        </span>
                      </div>

                      <div className="confirmation-row">
                        <span className="confirmation-label">Transfer Fee:</span>
                        <span className="confirmation-value free">R 0.00 (Free)</span>
                      </div>
                    </div>

                    <div className="confirmation-warning">
                      <span className="warning-icon">ℹ️</span>
                      <p>Please review all details carefully. This action cannot be undone after confirmation.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {transferStep === 3 && (
                <div className="transfer-success">
                  <div className="success-icon-wrapper">
                    <span className="success-icon">✅</span>
                  </div>
                  <h3 className="success-title">Transfer Successful!</h3>
                  <p className="success-message">
                    Your transfer of {formatCurrency(parseFloat(transferForm.amount))} has been processed successfully.
                  </p>

                  <div className="success-details">
                    <div className="success-row">
                      <span className="success-label">From:</span>
                      <span className="success-value">
                        {getAccountById(transferForm.fromAccount)?.name}
                      </span>
                    </div>
                    <div className="success-row">
                      <span className="success-label">To:</span>
                      <span className="success-value">
                        {getAccountById(transferForm.toAccount)?.name}
                      </span>
                    </div>
                    <div className="success-row">
                      <span className="success-label">Reference:</span>
                      <span className="success-value">
                        {transferForm.reference || 'TRF' + Date.now().toString().slice(-8)}
                      </span>
                    </div>
                    <div className="success-row">
                      <span className="success-label">Date:</span>
                      <span className="success-value">
                        {transferForm.transferType === 'immediate'
                          ? new Date().toLocaleDateString('en-ZA')
                          : transferForm.scheduledDate}
                      </span>
                    </div>
                  </div>

                  <div className="success-actions">
                    <button className="btn-secondary" onClick={closeTransferModal}>
                      Done
                    </button>
                    <button className="btn-primary" onClick={openTransferModal}>
                      Make Another Transfer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Only show for steps 1 and 2 */}
            {transferStep !== 3 && (
              <div className="modal-footer">
                <button className="btn-secondary" onClick={transferStep === 1 ? closeTransferModal : handleBackStep}>
                  {transferStep === 1 ? 'Cancel' : 'Back'}
                </button>
                <button
                  className="btn-primary"
                  onClick={transferStep === 1 ? handleNextStep : handleConfirmTransfer}
                >
                  {transferStep === 1 ? 'Continue' : 'Confirm Transfer'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
