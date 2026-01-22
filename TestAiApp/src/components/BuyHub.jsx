import { useState } from 'react';
import './Dashboard.css';
import './BuyHub.css';

function BuyHub({ userEmail, onLogout, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'Insurance',
      icon: '🛡️',
      color: 'blue',
      description: 'Protect what matters most',
      offerings: [
        { id: 1, name: 'Life Insurance', price: 'From R 150/month', description: 'Comprehensive life cover for you and your family' },
        { id: 2, name: 'Car Insurance', price: 'From R 450/month', description: 'Full comprehensive vehicle insurance' },
        { id: 3, name: 'Home Insurance', price: 'From R 300/month', description: 'Protect your home and belongings' },
        { id: 4, name: 'Travel Insurance', price: 'From R 50/trip', description: 'Travel with peace of mind' },
      ]
    },
    {
      id: 2,
      name: 'Loans & Credit',
      icon: '💰',
      color: 'green',
      description: 'Flexible financing solutions',
      offerings: [
        { id: 1, name: 'Personal Loan', price: 'Up to R 300,000', description: 'Competitive rates from 10.5% p.a.' },
        { id: 2, name: 'Home Loan', price: 'Up to R 5,000,000', description: 'Finance your dream home' },
        { id: 3, name: 'Vehicle Finance', price: 'Up to R 2,000,000', description: 'Drive away in your new car' },
        { id: 4, name: 'Credit Card', price: 'Up to R 150,000', description: 'Low interest rates and rewards' },
      ]
    },
    {
      id: 3,
      name: 'Rewards & Lifestyle',
      icon: '🎁',
      color: 'purple',
      description: 'Exclusive benefits and perks',
      offerings: [
        { id: 1, name: 'Premium Banking', price: 'R 199/month', description: 'Airport lounge access, concierge service, and more' },
        { id: 2, name: 'Rewards Programme', price: 'Free', description: 'Earn points on every transaction' },
        { id: 3, name: 'Cashback Card', price: 'R 49/month', description: 'Get 2% cashback on all purchases' },
        { id: 4, name: 'Travel Benefits', price: 'R 99/month', description: 'Exclusive travel discounts and deals' },
      ]
    },
    {
      id: 4,
      name: 'Investments',
      icon: '📈',
      color: 'teal',
      description: 'Grow your wealth',
      offerings: [
        { id: 1, name: 'Tax-Free Savings', price: 'From R 500/month', description: 'Save up to R 36,000 per year tax-free' },
        { id: 2, name: 'Unit Trusts', price: 'From R 500/month', description: 'Diversified investment portfolios' },
        { id: 3, name: 'Retirement Annuity', price: 'From R 500/month', description: 'Secure your retirement future' },
        { id: 4, name: 'Fixed Deposit', price: 'From R 10,000', description: 'Guaranteed returns up to 8.5% p.a.' },
      ]
    },
    {
      id: 5,
      name: 'Business Banking',
      icon: '🏢',
      color: 'orange',
      description: 'Solutions for your business',
      offerings: [
        { id: 1, name: 'Business Account', price: 'R 150/month', description: 'Full-featured business banking' },
        { id: 2, name: 'Merchant Services', price: 'From 2.5%', description: 'Accept card payments in-store and online' },
        { id: 3, name: 'Business Loan', price: 'Up to R 5,000,000', description: 'Fuel your business growth' },
        { id: 4, name: 'Fleet Management', price: 'Custom pricing', description: 'Manage your company vehicles' },
      ]
    },
    {
      id: 6,
      name: 'Digital Services',
      icon: '📱',
      color: 'indigo',
      description: 'Modern banking tools',
      offerings: [
        { id: 1, name: 'Virtual Card', price: 'Free', description: 'Instant virtual card for online shopping' },
        { id: 2, name: 'Budget Tracker', price: 'Free', description: 'AI-powered spending insights' },
        { id: 3, name: 'Bill Payments', price: 'Free', description: 'Automated bill payment service' },
        { id: 4, name: 'FX Services', price: 'From 0.5%', description: 'Foreign exchange and international transfers' },
      ]
    },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const getSelectedCategoryData = () => {
    return categories.find(cat => cat.id === selectedCategory);
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
            <button className="nav-item active">
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
          <div className="panel-header">
            <h2 className="panel-title">Buy Hub</h2>
            <p className="panel-subtitle">Explore our range of banking products and services</p>
          </div>

          <div className="buy-hub-container">
            {/* Categories Grid */}
            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-card ${category.color} ${selectedCategory === category.id ? 'selected' : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="category-count">{category.offerings.length} options</div>
                </div>
              ))}
            </div>

            {/* Offerings List */}
            {selectedCategory && (
              <div className="offerings-section">
                <div className="offerings-header">
                  <h3 className="offerings-title">
                    <span className="offerings-icon">{getSelectedCategoryData()?.icon}</span>
                    {getSelectedCategoryData()?.name}
                  </h3>
                  <button className="close-offerings-btn" onClick={() => setSelectedCategory(null)}>
                    ✕
                  </button>
                </div>

                <div className="offerings-grid">
                  {getSelectedCategoryData()?.offerings.map((offering) => (
                    <div key={offering.id} className="offering-card">
                      <div className="offering-header">
                        <h4 className="offering-name">{offering.name}</h4>
                        <span className="offering-price">{offering.price}</span>
                      </div>
                      <p className="offering-description">{offering.description}</p>
                      <div className="offering-actions">
                        <button className="btn-learn-more">Learn More</button>
                        <button className="btn-apply">Apply Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedCategory && (
              <div className="no-selection-message">
                <span className="no-selection-icon">👆</span>
                <p>Select a category above to explore our offerings</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default BuyHub;
