import { useState, useEffect } from 'react';
import './Dashboard.css';
import './BuyHub.css';

function BuyHub({ userEmail, onLogout, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [petFormData, setPetFormData] = useState({
    petName: '',
    petType: 'dog',
    breed: '',
    age: '',
    existingConditions: '',
    plan: 'basic',
    addOns: []
  });

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
        { id: 5, name: 'Pet Insurance', price: 'From R 99/month', description: 'Comprehensive vet care coverage for your furry friends' },
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

  const petInsurancePlans = [
    {
      id: 'basic',
      name: 'Basic Cover',
      price: 'R 99',
      features: ['Accident cover', 'Emergency vet visits', 'R 10,000 annual limit', '24/7 vet helpline']
    },
    {
      id: 'standard',
      name: 'Standard Cover',
      price: 'R 199',
      features: ['Accident & illness cover', 'Routine check-ups', 'R 25,000 annual limit', 'Medication cover', '24/7 vet helpline']
    },
    {
      id: 'premium',
      name: 'Premium Cover',
      price: 'R 349',
      features: ['Comprehensive cover', 'Specialist treatments', 'R 50,000 annual limit', 'Dental care', 'Alternative therapies', '24/7 vet helpline']
    }
  ];

  const petInsuranceAddOns = [
    { id: 'dental', name: 'Dental Care', price: 'R 49' },
    { id: 'wellness', name: 'Wellness Package', price: 'R 79' },
    { id: 'boarding', name: 'Boarding Cover', price: 'R 39' },
    { id: 'travel', name: 'Travel Protection', price: 'R 59' }
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const getSelectedCategoryData = () => {
    return categories.find(cat => cat.id === selectedCategory);
  };

  const handleOfferingClick = (offering) => {
    console.log('Offering clicked:', offering.name);
    if (offering.name === 'Pet Insurance') {
      console.log('Setting selectedOffering to Pet Insurance');
      setSelectedOffering(offering);
    } else {
      console.log('Not Pet Insurance - no modal will show');
    }
  };

  useEffect(() => {
    console.log('selectedOffering changed to:', selectedOffering);
    console.log('Should show modal?', selectedOffering?.name === 'Pet Insurance');
  }, [selectedOffering]);

  const handlePetFormChange = (field, value) => {
    setPetFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddOnToggle = (addOnId) => {
    setPetFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  const calculateTotalPrice = () => {
    const planPrices = {
      basic: 99,
      standard: 199,
      premium: 349
    };
    const addOnPrices = {
      dental: 49,
      wellness: 79,
      boarding: 39,
      travel: 59
    };

    let total = planPrices[petFormData.plan] || 0;
    petFormData.addOns.forEach(addOn => {
      total += addOnPrices[addOn] || 0;
    });
    return total;
  };

  const handlePetInsuranceSubmit = (e) => {
    e.preventDefault();
    console.log('Pet Insurance Application:', petFormData);
    alert(`Application submitted! Total: R ${calculateTotalPrice()}/month`);
    setSelectedOffering(null);
    setPetFormData({
      petName: '',
      petType: 'dog',
      breed: '',
      age: '',
      existingConditions: '',
      plan: 'basic',
      addOns: []
    });
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
            {/* Side-by-Side Layout */}
            <div className="buy-hub-layout">
              {/* Categories Sidebar */}
              <div className="categories-sidebar">
                <h3 className="sidebar-title">Categories</h3>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <span className="category-button-icon">{category.icon}</span>
                    <div className="category-button-content">
                      <span className="category-button-name">{category.name}</span>
                      <span className="category-button-count">{category.offerings.length} options</span>
                    </div>
                    <span className="category-button-arrow">›</span>
                  </button>
                ))}
              </div>

              {/* Offerings Panel */}
              <div className="offerings-panel">
                {selectedCategory ? (
                  <>
                    <div className="offerings-panel-header">
                      <h3 className="offerings-panel-title">
                        <span className="offerings-panel-icon">{getSelectedCategoryData()?.icon}</span>
                        {getSelectedCategoryData()?.name}
                      </h3>
                      <p className="offerings-panel-subtitle">{getSelectedCategoryData()?.description}</p>
                    </div>

                    <div className="offerings-list">
                      {getSelectedCategoryData()?.offerings?.map((offering) => (
                        <div key={offering.id} className="offering-item">
                          <div className="offering-item-content">
                            <h4 className="offering-item-name">{offering.name}</h4>
                            <p className="offering-item-description">{offering.description}</p>
                          </div>
                          <div className="offering-item-actions">
                            <span className="offering-item-price">{offering.price}</span>
                            <button
                              className="offering-item-btn"
                              onClick={() => handleOfferingClick(offering)}
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="offerings-panel-empty">
                    <span className="empty-icon">🛒</span>
                    <h3>Select a category</h3>
                    <p>Choose a category from the left to view available products and services</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Pet Insurance Modal */}
      {selectedOffering?.name === 'Pet Insurance' && (
        <div className="pet-insurance-modal">
          <div className="pet-modal-overlay" onClick={() => setSelectedOffering(null)} />
          <div className="pet-modal-content">
            <div className="pet-modal-header">
              <div className="pet-modal-title-section">
                <span className="pet-modal-icon">🐾</span>
                <h2 className="pet-modal-title">Pet Insurance Application</h2>
              </div>
              <button className="pet-modal-close" onClick={() => setSelectedOffering(null)}>✕</button>
            </div>

            <form onSubmit={handlePetInsuranceSubmit} className="pet-insurance-form">
              {/* Pet Details Section */}
              <div className="pet-form-section">
                <h3 className="pet-form-section-title">Pet Details</h3>

                <div className="pet-form-row">
                  <div className="pet-form-field">
                    <label className="pet-form-label">Pet Name</label>
                    <input
                      type="text"
                      className="pet-form-input"
                      value={petFormData.petName}
                      onChange={(e) => handlePetFormChange('petName', e.target.value)}
                      placeholder="Enter your pet's name"
                      required
                    />
                  </div>

                  <div className="pet-form-field">
                    <label className="pet-form-label">Pet Type</label>
                    <select
                      className="pet-form-select"
                      value={petFormData.petType}
                      onChange={(e) => handlePetFormChange('petType', e.target.value)}
                      required
                    >
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pet-form-row">
                  <div className="pet-form-field">
                    <label className="pet-form-label">Breed</label>
                    <input
                      type="text"
                      className="pet-form-input"
                      value={petFormData.breed}
                      onChange={(e) => handlePetFormChange('breed', e.target.value)}
                      placeholder="Enter breed"
                      required
                    />
                  </div>

                  <div className="pet-form-field">
                    <label className="pet-form-label">Age (years)</label>
                    <input
                      type="number"
                      className="pet-form-input"
                      value={petFormData.age}
                      onChange={(e) => handlePetFormChange('age', e.target.value)}
                      placeholder="Enter age"
                      min="0"
                      max="30"
                      required
                    />
                  </div>
                </div>

                <div className="pet-form-field">
                  <label className="pet-form-label">Existing Medical Conditions</label>
                  <textarea
                    className="pet-form-textarea"
                    value={petFormData.existingConditions}
                    onChange={(e) => handlePetFormChange('existingConditions', e.target.value)}
                    placeholder="List any existing medical conditions or leave blank if none"
                    rows="3"
                  />
                </div>
              </div>

              {/* Coverage Plans Section */}
              <div className="pet-form-section">
                <h3 className="pet-form-section-title">Choose Your Plan</h3>

                <div className="pet-plans-grid">
                  {petInsurancePlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`pet-plan-card ${petFormData.plan === plan.id ? 'selected' : ''}`}
                      onClick={() => handlePetFormChange('plan', plan.id)}
                    >
                      <div className="pet-plan-header">
                        <h4 className="pet-plan-name">{plan.name}</h4>
                        <div className="pet-plan-price">{plan.price}/mo</div>
                      </div>
                      <ul className="pet-plan-features">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="pet-plan-feature">
                            <span className="pet-feature-icon">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="pet-plan-radio">
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id}
                          checked={petFormData.plan === plan.id}
                          onChange={() => handlePetFormChange('plan', plan.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-Ons Section */}
              <div className="pet-form-section">
                <h3 className="pet-form-section-title">Optional Add-Ons</h3>

                <div className="pet-addons-grid">
                  {petInsuranceAddOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      className={`pet-addon-card ${petFormData.addOns.includes(addOn.id) ? 'selected' : ''}`}
                      onClick={() => handleAddOnToggle(addOn.id)}
                    >
                      <div className="pet-addon-checkbox">
                        <input
                          type="checkbox"
                          checked={petFormData.addOns.includes(addOn.id)}
                          onChange={() => handleAddOnToggle(addOn.id)}
                        />
                      </div>
                      <div className="pet-addon-info">
                        <span className="pet-addon-name">{addOn.name}</span>
                        <span className="pet-addon-price">+{addOn.price}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary and Submit */}
              <div className="pet-form-footer">
                <div className="pet-price-summary">
                  <span className="pet-summary-label">Monthly Total:</span>
                  <span className="pet-summary-price">R {calculateTotalPrice()}</span>
                </div>
                <div className="pet-form-actions">
                  <button
                    type="button"
                    className="pet-btn-cancel"
                    onClick={() => setSelectedOffering(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="pet-btn-submit">
                    Submit Application
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyHub;
