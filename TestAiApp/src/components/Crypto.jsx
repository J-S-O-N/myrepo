import { useState, useEffect } from 'react';
import './Crypto.css';

function Crypto({ userEmail, onLogout, onNavigate }) {
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [cryptoCoins, setCryptoCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('ZAR'); // ZAR, USD, BTC, EUR, GBP

  // Icon mapping for cryptocurrencies
  const iconMap = {
    'BTC': '₿', 'ETH': 'Ξ', 'USDT': '₮', 'BNB': '🔸', 'SOL': '◎',
    'XRP': '✕', 'USDC': '💵', 'ADA': '₳', 'AVAX': '🔺', 'DOGE': 'Ð',
    'DOT': '●', 'MATIC': '⬡', 'TRX': 'Ⓣ', 'LINK': '⬢', 'LTC': 'Ł',
    'UNI': '🦄', 'BCH': 'Ƀ', 'XLM': '*', 'ATOM': '⚛', 'XMR': 'ɱ'
  };

  // Currency conversion rates (USD as base)
  const exchangeRates = {
    USD: 1,
    ZAR: 18.50,
    EUR: 0.92,
    GBP: 0.79,
    BTC: 0.000017 // Approximate, will be updated from API
  };

  // Currency symbols
  const currencySymbols = {
    USD: '$',
    ZAR: 'R',
    EUR: '€',
    GBP: '£',
    BTC: '₿'
  };

  // Available currencies for dropdown
  const availableCurrencies = [
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'BTC', name: 'Bitcoin', symbol: '₿' }
  ];

  // Fetch crypto data from CoinMarketCap
  const fetchCryptoData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Note: CoinMarketCap API requires an API key
      // For demo purposes, we'll use a proxy or fallback to CoinGecko API
      // CoinGecko API is free and doesn't require authentication

      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }

      const data = await response.json();

      // Transform the data to match our format (store in USD)
      const transformedCoins = data.map((coin, index) => ({
        rank: index + 1,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        priceUSD: coin.current_price, // Store USD price
        change24h: coin.price_change_percentage_24h || 0,
        marketCapUSD: coin.market_cap, // Store USD market cap
        volumeUSD: coin.total_volume, // Store USD volume
        icon: iconMap[coin.symbol.toUpperCase()] || '💎'
      }));

      setCryptoCoins(transformedCoins);

      // Update BTC exchange rate if Bitcoin is in the list
      const btcCoin = transformedCoins.find(c => c.symbol === 'BTC');
      if (btcCoin) {
        exchangeRates.BTC = 1 / btcCoin.priceUSD;
      }

      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError(err.message);
      setIsLoading(false);

      // Fallback to mock data if API fails
      loadFallbackData();
    }
  };

  // Fallback data in case API fails (in USD)
  const loadFallbackData = () => {
    const fallbackCoins = [
      { rank: 1, name: 'Bitcoin', symbol: 'BTC', priceUSD: 56550.00, change24h: 2.34, marketCapUSD: 1108108108108, volumeUSD: 45945945946, icon: '₿' },
      { rank: 2, name: 'Ethereum', symbol: 'ETH', priceUSD: 2079.00, change24h: -1.23, marketCapUSD: 249729729730, volumeUSD: 17297297297, icon: 'Ξ' },
      { rank: 3, name: 'Tether', symbol: 'USDT', priceUSD: 1.00, change24h: 0.01, marketCapUSD: 110810810811, volumeUSD: 64864864865, icon: '₮' },
      { rank: 4, name: 'BNB', symbol: 'BNB', priceUSD: 307.00, change24h: 3.45, marketCapUSD: 45945945946, volumeUSD: 2432432432, icon: '🔸' },
      { rank: 5, name: 'Solana', symbol: 'SOL', priceUSD: 127.00, change24h: 5.67, marketCapUSD: 52972972973, volumeUSD: 4216216216, icon: '◎' },
      { rank: 6, name: 'XRP', symbol: 'XRP', priceUSD: 0.61, change24h: 1.89, marketCapUSD: 33783783784, volumeUSD: 5135135135, icon: '✕' },
      { rank: 7, name: 'USD Coin', symbol: 'USDC', priceUSD: 1.00, change24h: -0.02, marketCapUSD: 29729729730, volumeUSD: 9729729730, icon: '💵' },
      { rank: 8, name: 'Cardano', symbol: 'ADA', priceUSD: 0.48, change24h: 2.15, marketCapUSD: 17027027027, volumeUSD: 2270270270, icon: '₳' },
      { rank: 9, name: 'Avalanche', symbol: 'AVAX', priceUSD: 36.70, change24h: 4.32, marketCapUSD: 15405405405, volumeUSD: 1891891892, icon: '🔺' },
      { rank: 10, name: 'Dogecoin', symbol: 'DOGE', priceUSD: 0.10, change24h: -2.45, marketCapUSD: 14324324324, volumeUSD: 3135135135, icon: 'Ð' },
      { rank: 11, name: 'Polkadot', symbol: 'DOT', priceUSD: 6.67, change24h: 3.21, marketCapUSD: 10000000000, volumeUSD: 1513513514, icon: '●' },
      { rank: 12, name: 'Polygon', symbol: 'MATIC', priceUSD: 0.91, change24h: 1.95, marketCapUSD: 8378378378, volumeUSD: 1729729730, icon: '⬡' },
      { rank: 13, name: 'TRON', symbol: 'TRX', priceUSD: 0.12, change24h: 0.89, marketCapUSD: 10540540541, volumeUSD: 2432432432, icon: 'Ⓣ' },
      { rank: 14, name: 'Chainlink', symbol: 'LINK', priceUSD: 16.14, change24h: 2.67, marketCapUSD: 9081081081, volumeUSD: 1351351351, icon: '⬢' },
      { rank: 15, name: 'Litecoin', symbol: 'LTC', priceUSD: 90.75, change24h: -0.78, marketCapUSD: 6756756757, volumeUSD: 972972973, icon: 'Ł' },
      { rank: 16, name: 'Uniswap', symbol: 'UNI', priceUSD: 7.85, change24h: 4.12, marketCapUSD: 5945945946, volumeUSD: 1189189189, icon: '🦄' },
      { rank: 17, name: 'Bitcoin Cash', symbol: 'BCH', priceUSD: 247.00, change24h: 1.45, marketCapUSD: 4810810811, volumeUSD: 810810811, icon: 'Ƀ' },
      { rank: 18, name: 'Stellar', symbol: 'XLM', priceUSD: 0.13, change24h: 3.89, marketCapUSD: 3837837838, volumeUSD: 648648649, icon: '*' },
      { rank: 19, name: 'Cosmos', symbol: 'ATOM', priceUSD: 10.24, change24h: 2.34, marketCapUSD: 4054054054, volumeUSD: 864864865, icon: '⚛' },
      { rank: 20, name: 'Monero', symbol: 'XMR', priceUSD: 175.46, change24h: -1.56, marketCapUSD: 3189189189, volumeUSD: 486486486, icon: 'ɱ' }
    ];

    setCryptoCoins(fallbackCoins);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCryptoData();
  }, []);

  // Convert USD amount to selected currency
  const convertCurrency = (amountUSD) => {
    return amountUSD * exchangeRates[selectedCurrency];
  };

  // Format currency with proper symbol and abbreviation
  const formatCurrency = (amountUSD) => {
    const amount = convertCurrency(amountUSD);
    const symbol = currencySymbols[selectedCurrency];

    // Special formatting for BTC
    if (selectedCurrency === 'BTC') {
      if (amount >= 1000000) {
        return `${symbol} ${(amount / 1000000).toFixed(2)}M`;
      } else if (amount >= 1000) {
        return `${symbol} ${(amount / 1000).toFixed(2)}K`;
      } else if (amount >= 1) {
        return `${symbol} ${amount.toFixed(4)}`;
      }
      return `${symbol} ${amount.toFixed(8)}`;
    }

    // Standard formatting for fiat currencies
    if (amount >= 1000000000000) {
      return `${symbol} ${(amount / 1000000000000).toFixed(2)}T`;
    } else if (amount >= 1000000000) {
      return `${symbol} ${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `${symbol} ${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `${symbol} ${(amount / 1000).toFixed(2)}K`;
    }

    return `${symbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalMarketCap = cryptoCoins.reduce((sum, coin) => sum + (coin.marketCapUSD || 0), 0);
  const total24hVolume = cryptoCoins.reduce((sum, coin) => sum + (coin.volumeUSD || 0), 0);

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
            <button className="nav-item active">
              <span className="nav-icon">₿</span>
              <span>Crypto</span>
            </button>
            <button className="nav-item" onClick={() => onNavigate('stocks')}>
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
          <div className="crypto-header">
            <div>
              <h1 className="page-title">Cryptocurrency Market</h1>
              <p className="page-subtitle">
                Top 20 Cryptocurrencies by Market Cap
                {lastUpdated && (
                  <span style={{ fontSize: '0.8rem', marginLeft: '10px', opacity: 0.7 }}>
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="view-toggle">
              <select
                className="currency-selector"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {availableCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </select>
              <button
                className="toggle-btn"
                onClick={fetchCryptoData}
                disabled={isLoading}
              >
                🔄 {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
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

          {/* Loading State */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem' }}>
              <div style={{ marginBottom: '10px' }}>⏳</div>
              Loading cryptocurrency data...
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#fee',
              borderRadius: '8px',
              margin: '20px 0',
              color: '#c00'
            }}>
              <div style={{ marginBottom: '10px', fontSize: '2rem' }}>⚠️</div>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Failed to fetch live data</div>
              <div>{error}</div>
              <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                Showing fallback data instead
              </div>
            </div>
          )}

          {/* Market Stats */}
          {!isLoading && cryptoCoins.length > 0 && (
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
                  {cryptoCoins[0] && totalMarketCap > 0 ? ((cryptoCoins[0].marketCapUSD / totalMarketCap) * 100).toFixed(2) : '0.00'}%
                </div>
              </div>
            </section>
          )}

          {/* Crypto List */}
          {!isLoading && cryptoCoins.length > 0 && viewMode === 'list' && (
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
                      <td className="price">{formatCurrency(coin.priceUSD)}</td>
                      <td className={`change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </td>
                      <td className="market-cap">{formatCurrency(coin.marketCapUSD)}</td>
                      <td className="volume">{formatCurrency(coin.volumeUSD)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Crypto Grid */}
          {!isLoading && cryptoCoins.length > 0 && viewMode === 'grid' && (
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
                    <div className="coin-price">{formatCurrency(coin.priceUSD)}</div>
                    <div className={`coin-change ${coin.change24h >= 0 ? 'positive' : 'negative'}`}>
                      {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                    </div>
                  </div>
                  <div className="crypto-card-footer">
                    <div className="footer-item">
                      <div className="footer-label">Market Cap</div>
                      <div className="footer-value">{formatCurrency(coin.marketCapUSD)}</div>
                    </div>
                    <div className="footer-item">
                      <div className="footer-label">Volume</div>
                      <div className="footer-value">{formatCurrency(coin.volumeUSD)}</div>
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
                    +{coin.change24h.toFixed(2)}%
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
