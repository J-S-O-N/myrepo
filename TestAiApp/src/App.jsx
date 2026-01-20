import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Health from './components/Health';
import Accounts from './components/Accounts';
import Investments from './components/Investments';
import Crypto from './components/Crypto';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
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

  if (currentPage === 'crypto') {
    return <Crypto userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  return <Dashboard userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} />;
}

export default App;
