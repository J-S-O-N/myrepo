import { useState } from 'react';
import './App.css';
import Login from './components/Login';

function App() {
  const [count, setCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setCount(0);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="user-info">
          <span>Logged in as: {userEmail}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1>Welcome to TestAiApp</h1>
        <p>Your AI-powered application</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
