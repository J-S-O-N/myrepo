import { useState } from 'react';
import './Crypto.css';

function Crypto({ userEmail, onLogout, onNavigate }) {
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Top 20 cryptocurrencies with realistic market data
  const cryptoCoins = [
    { rank: 1, name: 'Bitcoin', symbol: 'BTC', price: 1045678.50, change24h: 2.34, marketCap: 20500000000000, volume: 850000000000, icon: '₿' },
    { rank: 2, name: 'Ethereum', symbol: 'ETH', price: 38456.75, change24h: -1.23, marketCap: 4620000000000, volume: 320000000000, icon: 'Ξ' },
    { rank: 3, name: 'Tether', symbol: 'USDT', price: 18.50, change24h: 0.01, marketCap: 2050000000000, volume: 1200000000000, icon: '₮' },
    { rank: 4, name: 'BNB', symbol: 'BNB', price: 5678.90, change24h: 3.45, marketCap: 850000000000, volume: 45000000000, icon: '🔸' },
    { rank: 5, name: 'Solana', symbol: 'SOL', price: 2345.80, change24h: 5.67, marketCap: 980000000000, volume: 78000000000, icon: '◎' },
    { rank: 6, name: 'XRP', symbol: 'XRP', price: 11.25, change24h: 1.89, marketCap: 625000000000, volume: 95000000000, icon: '✕' },
    { rank: 7, name: 'USD Coin', symbol: 'USDC', price: 18.48, change24h: -0.02, marketCap: 550000000000, volume: 180000000000, icon: '💵' },
    { rank: 8, name: 'Cardano', symbol: 'ADA', price: 8.90, change24h: 2.15, marketCap: 315000000000, volume: 42000000000, icon: '₳' },
    { rank: 9, name: 'Avalanche', symbol: 'AVAX', price: 678.50, change24h: 4.32, marketCap: 285000000000, volume: 35000000000, icon: '🔺' },
    { rank: 10, name: 'Dogecoin', symbol: 'DOGE', price: 1.85, change24h: -2.45, marketCap: 265000000000, volume: 58000000000, icon: 'Ð' },
    { rank: 11, name: 'Polkadot', symbol: 'DOT', price: 123.45, change24h: 3.21, marketCap: 185000000000, volume: 28000000000, icon: '●' },
    { rank: 12, name: 'Polygon', symbol: 'MATIC', price: 16.75, change24h: 1.95, marketCap: 155000000000, volume: 32000000000, icon: '⬡' },
    { rank: 13, name: 'TRON', symbol: 'TRX', price: 2.15, change24h: 0.89, marketCap: 195000000000, volume: 45000000000, icon: 'Ⓣ' },
    { rank: 14, name: 'Chainlink', symbol: 'LINK', price: 298.60, change24h: 2.67, marketCap: 168000000000, volume: 25000000000, icon: '⬢' },
    { rank: 15, name: 'Litecoin', symbol: 'LTC', price: 1678.90, change24h: -0.78, marketCap: 125000000000, volume: 18000000000, icon: 'Ł' },
    { rank: 16, name: 'Uniswap', symbol: 'UNI', price: 145.30, change24h: 4.12, marketCap: 110000000000, volume: 22000000000, icon: '🦄' },
    { rank: 17, name: 'Bitcoin Cash', symbol: 'BCH', price: 4567.80, change24h: 1.45, marketCap: 89000000000, volume: 15000000000, icon: 'Ƀ' },
    { rank: 18, name: 'Stellar', symbol: 'XLM', price: 2.45, change24h: 3.89, marketCap: 71000000000, volume: 12000000000, icon: '*' },
    { rank: 19, name: 'Cosmos', symbol: 'ATOM', price: 189.50, change24h: 2.34, marketCap: 75000000000, volume: 16000000000, icon: '⚛' },
    { rank: 20, name: 'Monero', symbol: 'XMR', price: 3245.60, change24h: -1.56, marketCap: 59000000000, volume: 9000000000, icon: 'ɱ' }
  ];

  const formatCurrency = (amount) => {
    if (amount >= 1000000000000) {
      return `R ${(amount / 1000000000000).toFixed(2)}T`;
    } else if (amount >= 1000000000) {
      return `R ${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `R ${(amount / 1000000).toFixed(2)}M`;
    }
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalMarketCap = cryptoCoins.reduce((sum, coin) => sum + coin.marketCap, 0);
  const total24hVolume = cryptoCoins.reduce((sum, coin) => sum + coin.volume, 0);

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
            <button className="nav-item active">
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
            <button className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          <div className="crypto-header">
            <div>
              <h1 className="page-title">Cryptocurrency Market</h1>
              <p className="page-subtitle">Top 20 Cryptocurrencies by Market Cap</p>
            </div>
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞ Grid
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰ List
              </button>
            </div>
          </div>

          {/* Market Stats */}
          <section className="market-stats">
            <div className="stat-box">
              <div className="stat-label">Total Market Cap</div>
              <div className="stat-value">{formatCurrency(totalMarketCap)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">24h Volume</div>
              <div className="stat-value">{formatCurrency(total24hVolume)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Bitcoin Dominance</div>
              <div className="stat-value">
                {((cryptoCoins[0].marketCap / totalMarketCap) * 100).toFixed(2)}%
              </div>
            </div>
          </section>

          {/* Crypto List */}
          {viewMode === 'list' ? (
            <section className="crypto-table-section">
              <table className="crypto-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Coin</th>
                    <th>Price</th>
                    <th>24h %</th>
                    <th>Market Cap</th>
                    <th>Volume (24h)</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoCoins.map((coin) => (
                    <tr key={coin.rank} className="crypto-row">
                      <td className="rank">{coin.rank}</td>
                      <td className="coin-info">
                        <span className="coin-icon">{coin.icon}</span>
                        <div>
                          <div className="coin-name">{coin.name}</div>
                          <div className="coin-symbol">{coin.symbol}</div>
                        </div>
                      </td>
                      <td className="price">{formatCurrency(coin.price)}</td>
                      <td className={`change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                      </td>
                      <td className="market-cap">{formatCurrency(coin.marketCap)}</td>
                      <td className="volume">{formatCurrency(coin.volume)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : (
            <section className="crypto-grid">
              {cryptoCoins.map((coin) => (
                <div key={coin.rank} className="crypto-card">
                  <div className="crypto-card-header">
                    <div className="coin-rank">#{coin.rank}</div>
                    <div className="coin-icon-large">{coin.icon}</div>
                  </div>
                  <div className="crypto-card-content">
                    <div className="coin-name">{coin.name}</div>
                    <div className="coin-symbol">{coin.symbol}</div>
                    <div className="coin-price">{formatCurrency(coin.price)}</div>
                    <div className={`coin-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                      {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h)}%
                    </div>
                  </div>
                  <div className="crypto-card-footer">
                    <div className="footer-item">
                      <div className="footer-label">Market Cap</div>
                      <div className="footer-value">{formatCurrency(coin.marketCap)}</div>
                    </div>
                    <div className="footer-item">
                      <div className="footer-label">Volume</div>
                      <div className="footer-value">{formatCurrency(coin.volume)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="insights-panel">
          <div className="insights-card">
            <h3 className="insights-title">Top Gainers (24h)</h3>
            {cryptoCoins
              .filter(coin => coin.change24h > 0)
              .sort((a, b) => b.change24h - a.change24h)
              .slice(0, 5)
              .map((coin) => (
                <div key={coin.symbol} className="gainer-item">
                  <div className="gainer-info">
                    <span className="gainer-icon">{coin.icon}</span>
                    <div>
                      <div className="gainer-name">{coin.name}</div>
                      <div className="gainer-symbol">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="gainer-change positive">
                    +{coin.change24h}%
                  </div>
                </div>
              ))}
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Market Insights</h3>
            <div className="insight-item">
              <div className="insight-icon">📊</div>
              <div className="insight-text">Crypto market cap up 3.2% today</div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">🔥</div>
              <div className="insight-text">Solana showing strong momentum</div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">💎</div>
              <div className="insight-text">DeFi tokens gaining traction</div>
            </div>
          </div>

          <div className="insights-card">
            <h3 className="insights-title">Quick Actions</h3>
            <button className="quick-action-item">
              <span className="quick-action-icon">💵</span>
              <span className="quick-action-label">Buy Crypto</span>
            </button>
            <button className="quick-action-item">
              <span className="quick-action-icon">💸</span>
              <span className="quick-action-label">Sell Crypto</span>
            </button>
            <button className="quick-action-item">
              <span className="quick-action-icon">🔄</span>
              <span className="quick-action-label">Convert</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Crypto;
