import { useState } from 'react';
import './Investments.css';

function Investments({ userEmail, onLogout, onNavigate }) {
  const [selectedPortfolio, setSelectedPortfolio] = useState(1);

  const portfolios = [
    {
      id: 1,
      name: 'Growth Portfolio',
      type: 'Aggressive',
      balance: 287900.75,
      invested: 200000,
      returns: 87900.75,
      returnPercentage: 43.95,
      icon: '📈',
      color: 'green',
      allocation: [
        { type: 'Stocks', percentage: 70, amount: 201530.53 },
        { type: 'Bonds', percentage: 20, amount: 57580.15 },
        { type: 'Cash', percentage: 10, amount: 28790.07 }
      ],
      performance: [
        { year: '2023', value: 200000, change: 0 },
        { year: '2024', value: 235000, change: 17.5 },
        { year: '2025', value: 265000, change: 12.77 },
        { year: '2026', value: 287900.75, change: 8.64 }
      ]
    },
    {
      id: 2,
      name: 'Balanced Portfolio',
      type: 'Moderate',
      balance: 156750.50,
      invested: 120000,
      returns: 36750.50,
      returnPercentage: 30.63,
      icon: '⚖️',
      color: 'blue',
      allocation: [
        { type: 'Stocks', percentage: 50, amount: 78375.25 },
        { type: 'Bonds', percentage: 40, amount: 62700.20 },
        { type: 'Cash', percentage: 10, amount: 15675.05 }
      ],
      performance: [
        { year: '2023', value: 120000, change: 0 },
        { year: '2024', value: 135000, change: 12.5 },
        { year: '2025', value: 148000, change: 9.63 },
        { year: '2026', value: 156750.50, change: 5.91 }
      ]
    },
    {
      id: 3,
      name: 'Income Portfolio',
      type: 'Conservative',
      balance: 98450.25,
      invested: 85000,
      returns: 13450.25,
      returnPercentage: 15.82,
      icon: '💰',
      color: 'purple',
      allocation: [
        { type: 'Stocks', percentage: 30, amount: 29535.08 },
        { type: 'Bonds', percentage: 60, amount: 59070.15 },
        { type: 'Cash', percentage: 10, amount: 9845.02 }
      ],
      performance: [
        { year: '2023', value: 85000, change: 0 },
        { year: '2024', value: 90000, change: 5.88 },
        { year: '2025', value: 95500, change: 6.11 },
        { year: '2026', value: 98450.25, change: 3.09 }
      ]
    }
  ];

  const totalValue = portfolios.reduce((sum, p) => sum + p.balance, 0);
  const totalInvested = portfolios.reduce((sum, p) => sum + p.invested, 0);
  const totalReturns = totalValue - totalInvested;
  const totalReturnPercentage = ((totalReturns / totalInvested) * 100).toFixed(2);

  const topPerformers = [
    { name: 'Apple Inc.', symbol: 'AAPL', change: 15.2, value: 45678.90 },
    { name: 'Microsoft Corp.', symbol: 'MSFT', change: 12.8, value: 38450.50 },
    { name: 'NVIDIA Corp.', symbol: 'NVDA', change: 28.5, value: 52300.75 }
  ];

  const formatCurrency = (amount) => {
    return `R ${Math.abs(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getMaxValue = (performance) => {
    return Math.max(...performance.map(p => p.value));
  };

  const selectedPortfolioData = portfolios.find(p => p.id === selectedPortfolio);

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
            <button className="nav-item active">
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
          <div className="investments-header">
            <h1 className="page-title">Investment Portfolios</h1>
          </div>

          {/* Total Investment Summary */}
          <section className="investment-summary">
            <div className="summary-card total">
              <div className="summary-label">Total Portfolio Value</div>
              <div className="summary-value">{formatCurrency(totalValue)}</div>
              <div className="summary-change positive">+{totalReturnPercentage}%</div>
            </div>
            <div className="summary-card invested">
              <div className="summary-label">Total Invested</div>
              <div className="summary-value">{formatCurrency(totalInvested)}</div>
            </div>
            <div className="summary-card returns">
              <div className="summary-label">Total Returns</div>
              <div className="summary-value">{formatCurrency(totalReturns)}</div>
              <div className="summary-change positive">+{totalReturnPercentage}%</div>
            </div>
          </section>

          {/* Portfolio Cards */}
          <section className="portfolios-grid">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className={`portfolio-card ${portfolio.color} ${selectedPortfolio === portfolio.id ? 'selected' : ''}`}
                onClick={() => setSelectedPortfolio(portfolio.id)}
              >
                <div className="portfolio-header">
                  <div className="portfolio-icon">{portfolio.icon}</div>
                  <div className="portfolio-info">
                    <div className="portfolio-name">{portfolio.name}</div>
                    <div className="portfolio-type">{portfolio.type}</div>
                  </div>
                </div>
                <div className="portfolio-balance">{formatCurrency(portfolio.balance)}</div>
                <div className="portfolio-returns">
                  <span className="returns-label">Returns:</span>
                  <span className="returns-value positive">+{portfolio.returnPercentage}%</span>
                </div>
              </div>
            ))}
          </section>

          {/* Performance Chart */}
          <section className="performance-section">
            <h2 className="section-title">3-Year Performance - {selectedPortfolioData.name}</h2>
            <div className="performance-chart">
              <div className="chart-y-axis">
                <span>{formatCurrency(getMaxValue(selectedPortfolioData.performance))}</span>
                <span>{formatCurrency(getMaxValue(selectedPortfolioData.performance) / 2)}</span>
                <span>R 0</span>
              </div>
              <div className="chart-content">
                {selectedPortfolioData.performance.map((point, index) => (
                  <div key={index} className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${(point.value / getMaxValue(selectedPortfolioData.performance)) * 100}%`,
                        background: point.change >= 0 ? 'linear-gradient(180deg, #10b981, #059669)' : 'linear-gradient(180deg, #ef4444, #dc2626)'
                      }}
                    >
                      <div className="chart-tooltip">
                        <div className="tooltip-value">{formatCurrency(point.value)}</div>
                        {index > 0 && (
                          <div className={`tooltip-change ${point.change >= 0 ? 'positive' : 'negative'}`}>
                            {point.change >= 0 ? '+' : ''}{point.change}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="chart-label">{point.year}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Asset Allocation */}
          <section className="allocation-section">
            <h2 className="section-title">Asset Allocation - {selectedPortfolioData.name}</h2>
            <div className="allocation-grid">
              {selectedPortfolioData.allocation.map((asset, index) => (
                <div key={index} className="allocation-card">
                  <div className="allocation-header">
                    <span className="allocation-type">{asset.type}</span>
                    <span className="allocation-percentage">{asset.percentage}%</span>
                  </div>
                  <div className="allocation-bar">
                    <div
                      className="allocation-fill"
                      style={{ width: `${asset.percentage}%` }}
                    ></div>
                  </div>
                  <div className="allocation-amount">{formatCurrency(asset.amount)}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="insights-panel">
          <div className="insights-card">
            <h3 className="insights-title">Top Performers</h3>
            {topPerformers.map((stock, index) => (
              <div key={index} className="performer-item">
                <div className="performer-info">
                  <div className="performer-name">{stock.name}</div>
                  <div className="performer-symbol">{stock.symbol}</div>
                </div>
                <div className="performer-stats">
                  <div className="performer-change positive">+{stock.change}%</div>
                  <div className="performer-value">{formatCurrency(stock.value)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Market Insights</h3>
            <div className="insight-item">
              <div className="insight-icon">📊</div>
              <div className="insight-text">Global markets up 2.3% this week</div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">💹</div>
              <div className="insight-text">Tech sector leading gains</div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">🌍</div>
              <div className="insight-text">Emerging markets showing strength</div>
            </div>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Quick Actions</h3>
            <button className="quick-action-item">
              <span className="quick-action-icon">💵</span>
              <span className="quick-action-label">Add Funds</span>
            </button>
            <button className="quick-action-item">
              <span className="quick-action-icon">📤</span>
              <span className="quick-action-label">Withdraw</span>
            </button>
            <button className="quick-action-item">
              <span className="quick-action-icon">🔄</span>
              <span className="quick-action-label">Rebalance</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Investments;
