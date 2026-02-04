import { useState, useEffect } from 'react';
import './Dashboard.css';
import './StockPerformance.css';
import { API_URL } from '../config';

function StockPerformance({ userEmail, onLogout, onNavigate }) {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D'); // 1D, 1W, 1M, 1Y
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch live JSE stock data through backend proxy
  const fetchStockData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/stocks/jse`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        setStocks(result.data);
        setLastUpdated(new Date());

        if (result.fallback) {
          console.warn('Using fallback stock data - Yahoo Finance API unavailable');
        }
      } else {
        throw new Error('No stock data returned from API');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stock data:', error);

      // Fallback data if backend API fails (current prices as of Jan 2026)
      const fallbackData = [
        { symbol: 'SBK', name: 'Standard Bank Group Ltd', exchange: 'JSE', price: 29500, change: -84, changePercent: -0.28, open: 29584, high: 29658, low: 29312, volume: 155824, marketCap: 285000000000, pe: 8.45, dividendYield: 5.2, icon: '🏦' },
        { symbol: 'FSR', name: 'FirstRand Ltd', exchange: 'JSE', price: 7850, change: 45, changePercent: 0.58, open: 7805, high: 7890, low: 7780, volume: 3890456, marketCap: 368000000000, pe: 7.89, dividendYield: 5.8, icon: '🏦' },
        { symbol: 'NED', name: 'Nedbank Group Ltd', exchange: 'JSE', price: 22100, change: 120, changePercent: 0.55, open: 21980, high: 22150, low: 21900, volume: 1234567, marketCap: 83000000000, pe: 6.23, dividendYield: 6.5, icon: '🏦' },
        { symbol: 'CPI', name: 'Capitec Bank Holdings Ltd', exchange: 'JSE', price: 178900, change: 1250, changePercent: 0.70, open: 177650, high: 179500, low: 177200, volume: 456789, marketCap: 378000000000, pe: 18.45, dividendYield: 2.1, icon: '🏦' },
        { symbol: 'ABG', name: 'Absa Group Ltd', exchange: 'JSE', price: 18900, change: 78, changePercent: 0.41, open: 18822, high: 18950, low: 18750, volume: 2789456, marketCap: 125000000000, pe: 7.65, dividendYield: 5.9, icon: '🏦' }
      ];

      setStocks(fallbackData);
      setLastUpdated(new Date());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const formatPrice = (price) => {
    return `R ${(price / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toLocaleString();
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000000000) {
      return `R ${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `R ${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `R ${(marketCap / 1000000).toFixed(2)}M`;
    }
    return `R ${marketCap.toLocaleString()}`;
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
              <span className="nav-icon">📊</span>
              <span>Stock Performance</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('settings')}>
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          <div className="stock-header">
            <div>
              <h1 className="page-title">JSE Stock Performance</h1>
              <p className="page-subtitle">
                Top South African Banking Stocks
                {lastUpdated && (
                  <span style={{ fontSize: '0.8rem', marginLeft: '10px', opacity: 0.7 }}>
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="stock-controls">
              <button
                className="refresh-btn"
                onClick={fetchStockData}
                disabled={isLoading}
              >
                🔄 {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <div className="timeframe-selector">
                {['1D', '1W', '1M', '1Y'].map((tf) => (
                  <button
                    key={tf}
                    className={`timeframe-btn ${selectedTimeframe === tf ? 'active' : ''}`}
                    onClick={() => setSelectedTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="loading-state">
              <div className="loading-spinner">⏳</div>
              Loading stock data...
            </div>
          )}

          {/* Stock Cards */}
          {!isLoading && stocks.length > 0 && (
            <>
              <div className="stock-grid">
                {stocks.map((stock) => (
                  <div key={stock.symbol} className="stock-card">
                    <div className="stock-card-header">
                      <div className="stock-icon">{stock.icon}</div>
                      <div className="stock-badge">{stock.exchange}</div>
                    </div>

                    <div className="stock-info">
                      <h3 className="stock-symbol">{stock.symbol}</h3>
                      <p className="stock-name">{stock.name}</p>
                    </div>

                    <div className="stock-price-section">
                      <div className="stock-price">{formatPrice(stock.price)}</div>
                      <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                        {stock.change >= 0 ? '▲' : '▼'} {formatPrice(Math.abs(stock.change))} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>

                    <div className="stock-metrics">
                      <div className="metric-row">
                        <span className="metric-label">Open</span>
                        <span className="metric-value">{formatPrice(stock.open)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">High</span>
                        <span className="metric-value">{formatPrice(stock.high)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Low</span>
                        <span className="metric-value">{formatPrice(stock.low)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Volume</span>
                        <span className="metric-value">{formatVolume(stock.volume)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Table */}
              <div className="stock-table-section">
                <h2 className="section-title">Detailed Stock Information</h2>
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Change</th>
                      <th>Market Cap</th>
                      <th>P/E Ratio</th>
                      <th>Div Yield</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr key={stock.symbol} className="stock-row">
                        <td className="stock-symbol-cell">
                          <span className="table-icon">{stock.icon}</span>
                          <strong>{stock.symbol}</strong>
                        </td>
                        <td className="stock-name-cell">{stock.name}</td>
                        <td className="price-cell">{formatPrice(stock.price)}</td>
                        <td className={`change-cell ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                          {stock.change >= 0 ? '+' : ''}{formatPrice(stock.change)}
                          <br />
                          <small>({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</small>
                        </td>
                        <td>{formatMarketCap(stock.marketCap)}</td>
                        <td>{stock.pe.toFixed(2)}</td>
                        <td>{stock.dividendYield.toFixed(1)}%</td>
                        <td>{formatVolume(stock.volume)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default StockPerformance;
