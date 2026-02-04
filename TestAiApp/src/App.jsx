import { useState, useEffect } from 'react';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Health from './components/Health';
import Accounts from './components/Accounts';
import Investments from './components/Investments';
import Crypto from './components/Crypto';
import BuyHub from './components/BuyHub';
import Goals from './components/Goals';
import StockPerformance from './components/StockPerformance';
import Settings from './components/Settings';
import { API_URL } from './config';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [token, setToken] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (email, authToken) => {
    setUserEmail(email);
    setToken(authToken);
    setIsAuthenticated(true);
    checkOnboardingStatus(authToken);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setOnboardingCompleted(false);
    setUserEmail('');
    setToken('');
    setCurrentPage('dashboard');
    sessionStorage.removeItem('token');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const checkOnboardingStatus = async (authToken) => {
    setCheckingOnboarding(true);
    try {
      const response = await fetch(`${API_URL}/api/onboarding/status`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOnboardingCompleted(data.onboarding_completed || false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // If check fails, assume onboarding not completed to be safe
      setOnboardingCompleted(false);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true);
  };

  // Check onboarding status on mount if token exists in sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken && isAuthenticated) {
      checkOnboardingStatus(storedToken);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show loading while checking onboarding status
  if (checkingOnboarding) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        color: 'white',
        fontSize: '1.25rem'
      }}>
        Loading...
      </div>
    );
  }

  // Show onboarding if not completed
  if (!onboardingCompleted) {
    return (
      <Onboarding
        userEmail={userEmail}
        token={token}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (currentPage === 'settings') {
    return <Settings userEmail={userEmail} token={token} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'health') {
    return <Health userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'accounts') {
    return <Accounts userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'investments') {
    return <Investments userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'goals') {
    return <Goals userEmail={userEmail} token={token} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'buyhub') {
    return <BuyHub userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'crypto') {
    return <Crypto userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'stocks') {
    return <StockPerformance userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  return <Dashboard userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
}

export default App;
