import { useState, useEffect } from 'react';
import './Login.css';
import { API_URL } from '../config';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: '💳',
      title: 'Smart Banking',
      description: 'Manage all your accounts in one place with intelligent insights'
    },
    {
      icon: '📊',
      title: 'Investment Tracking',
      description: 'Real-time portfolio monitoring with JSE stock integration'
    },
    {
      icon: '🏃',
      title: 'Health & Fitness',
      description: 'Connect with Strava and track your wellness journey'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Bank-grade security with encrypted data protection'
    }
  ];

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Try login first
      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // If login succeeds, proceed
      if (loginResponse.ok) {
        const data = await loginResponse.json();
        sessionStorage.setItem('token', data.token);
        setIsLoading(false);
        onLogin(formData.email, data.token);
        return;
      }

      // If login fails with 401, try to register (new user)
      if (loginResponse.status === 401) {
        const loginData = await loginResponse.json();

        // Try to register in case this is a new user
        const registerResponse = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        // If registration succeeds, proceed
        if (registerResponse.ok) {
          const data = await registerResponse.json();
          sessionStorage.setItem('token', data.token);
          setIsLoading(false);
          onLogin(formData.email, data.token);
          return;
        }

        // Registration failed - user exists, show login error instead
        if (registerResponse.status === 409) {
          throw new Error(loginData.error || 'Invalid email or password');
        }

        // Other registration error
        const registerData = await registerResponse.json();
        throw new Error(registerData.error || 'Registration failed');
      }

      // Login failed with non-401 error
      const loginData = await loginResponse.json();
      throw new Error(loginData.error || 'Authentication failed');
    } catch (error) {
      setIsLoading(false);
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="login-container">
      {/* Animated background circles */}
      <div className="background-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-content">
        {/* Left side - Features showcase */}
        <div className="features-section">
          <div className="brand-section">
            <div className="brand-logo">💳</div>
            <h1 className="brand-title">BankApp</h1>
            <p className="brand-tagline">Your Financial Life, Simplified</p>
          </div>

          <div className="features-carousel">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${index === currentFeature ? 'active' : ''}`}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="carousel-indicators">
            {features.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentFeature ? 'active' : ''}`}
                onClick={() => setCurrentFeature(index)}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>

          <div className="trust-badges">
            <div className="badge">
              <span className="badge-icon">🔒</span>
              <span className="badge-text">256-bit Encryption</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🛡️</span>
              <span className="badge-text">GDPR Compliant</span>
            </div>
            <div className="badge">
              <span className="badge-icon">✓</span>
              <span className="badge-text">Trusted by 10K+ Users</span>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="login-section">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {errors.general && (
                <div className="error-message general-error">
                  <span className="error-icon">⚠️</span>
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔑</span>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <span className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="button-icon">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <div className="divider">
                <span>New to BankApp?</span>
              </div>
              <p className="demo-note">
                <span className="note-icon">💡</span>
                Enter any email and password (8+ characters) to get started. New users are automatically registered!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

