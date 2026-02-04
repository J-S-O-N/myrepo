import { useState, useEffect } from 'react';
import './Onboarding.css';
import { API_URL } from '../config';

const Onboarding = ({ token, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    street_address: '',
    city: '',
    postal_code: '',
    country: 'South Africa'
  });

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Username availability check with debounce
  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const response = await fetch(`${API_URL}/api/onboarding/username-available/${formData.username}`);

        const data = await response.json();
        setUsernameAvailable(data.available);
      } catch (err) {
        console.error('Username check failed:', err);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const errors = {};

    if (!formData.username || formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (usernameAvailable === false) {
      errors.username = 'Username is already taken';
    }

    if (!formData.first_name) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name) {
      errors.last_name = 'Last name is required';
    }

    if (!formData.phone_number) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      errors.phone_number = 'Invalid phone number format';
    }

    if (!formData.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required';
    }

    return errors;
  };

  const validateStep2 = () => {
    const errors = {};

    if (!formData.street_address) {
      errors.street_address = 'Street address is required';
    }

    if (!formData.city) {
      errors.city = 'City is required';
    }

    if (!formData.postal_code) {
      errors.postal_code = 'Postal code is required';
    }

    if (!formData.country) {
      errors.country = 'Country is required';
    }

    return errors;
  };

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
      if (currentStep === 1) {
        const errors = validateStep1();
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          setLoading(false);
          return;
        }

        // Save step 1 data to backend
        const response = await fetch(`${API_URL}/api/onboarding/step1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            date_of_birth: formData.date_of_birth
          })
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to save personal information');
          setLoading(false);
          return;
        }

      } else if (currentStep === 2) {
        console.log('Step 2: Starting validation', formData);
        const errors = validateStep2();
        console.log('Step 2: Validation errors:', errors);
        if (Object.keys(errors).length > 0) {
          console.log('Step 2: Validation failed, showing errors');
          setFieldErrors(errors);
          setLoading(false);
          return;
        }

        // Save step 2 data to backend
        console.log('Step 2: Sending POST to /api/onboarding/step2');
        const response = await fetch(`${API_URL}/api/onboarding/step2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            street_address: formData.street_address,
            city: formData.city,
            postal_code: formData.postal_code,
            country: formData.country
          })
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to save address information');
          setLoading(false);
          return;
        }

        // After step 2 is saved, complete the onboarding
        await handleSubmit();
        return;
      }

      setFieldErrors({});
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      console.error('Error in handleNext:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError('');
    setFieldErrors({});
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep(3);
        // Wait a moment before calling onComplete to show the success screen
        setTimeout(() => {
          onComplete();
        }, 4000);
      } else {
        setError(data.message || 'Failed to complete onboarding');
        setCurrentStep(2); // Go back to last step
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    const progress = (currentStep / 3) * 100;

    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <div className="step-label">Personal Info</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <div className="step-label">Address</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Complete</div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Personal Information</h2>
        <p>Let's start with some basic information about you</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            <span className="label-icon">👤</span>
            Username
          </label>
          <div className="input-with-validation">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={fieldErrors.username ? 'error' : usernameAvailable === true ? 'success' : ''}
              placeholder="Choose a unique username"
              autoComplete="username"
            />
            {checkingUsername && (
              <div className="validation-indicator">
                <div className="spinner-small"></div>
              </div>
            )}
            {!checkingUsername && usernameAvailable === true && (
              <div className="validation-indicator success">✓</div>
            )}
            {!checkingUsername && usernameAvailable === false && (
              <div className="validation-indicator error">✗</div>
            )}
          </div>
          {fieldErrors.username && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.username}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">📝</span>
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className={fieldErrors.first_name ? 'error' : ''}
            placeholder="John"
            autoComplete="given-name"
          />
          {fieldErrors.first_name && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.first_name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">📝</span>
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            className={fieldErrors.last_name ? 'error' : ''}
            placeholder="Doe"
            autoComplete="family-name"
          />
          {fieldErrors.last_name && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.last_name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">📱</span>
            Phone Number
          </label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className={fieldErrors.phone_number ? 'error' : ''}
            placeholder="+1 (555) 123-4567"
            autoComplete="tel"
          />
          {fieldErrors.phone_number && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.phone_number}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">🎂</span>
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            className={fieldErrors.date_of_birth ? 'error' : ''}
            autoComplete="bday"
          />
          {fieldErrors.date_of_birth && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.date_of_birth}
            </span>
          )}
        </div>
      </div>

      <div className="step-actions">
        <button
          className="btn-next"
          onClick={handleNext}
          disabled={checkingUsername}
        >
          Next Step
          <span className="button-icon">→</span>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Address Information</h2>
        <p>Where can we reach you?</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            <span className="label-icon">🏠</span>
            Street Address
          </label>
          <input
            type="text"
            name="street_address"
            value={formData.street_address}
            onChange={handleInputChange}
            className={fieldErrors.street_address ? 'error' : ''}
            placeholder="123 Main Street"
            autoComplete="street-address"
          />
          {fieldErrors.street_address && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.street_address}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">🏙️</span>
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={fieldErrors.city ? 'error' : ''}
            placeholder="New York"
            autoComplete="address-level2"
          />
          {fieldErrors.city && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.city}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>
            <span className="label-icon">📮</span>
            Postal Code
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            className={fieldErrors.postal_code ? 'error' : ''}
            placeholder="10001"
            autoComplete="postal-code"
          />
          {fieldErrors.postal_code && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.postal_code}
            </span>
          )}
        </div>

        <div className="form-group full-width">
          <label>
            <span className="label-icon">🌍</span>
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={fieldErrors.country ? 'error' : ''}
            placeholder="United States"
            autoComplete="country-name"
          />
          {fieldErrors.country && (
            <span className="error-message">
              <span className="error-icon">⚠</span>
              {fieldErrors.country}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message general-error">
          <span className="error-icon">⚠</span>
          {error}
        </div>
      )}

      <div className="step-actions">
        <button
          className="btn-back"
          onClick={handleBack}
          disabled={loading}
        >
          <span className="button-icon">←</span>
          Back
        </button>
        <button
          className="btn-submit"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Completing...
            </>
          ) : (
            <>
              Complete Onboarding
              <span className="button-icon">✓</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="onboarding-step completion-step">
      <div className="celebration">
        <div className="celebration-icon">🎉</div>
        <h2>Welcome aboard, {formData.first_name}!</h2>
        <p>Your profile has been created successfully</p>
      </div>

      <div className="summary-card">
        <h3>Your Information</h3>

        <div className="summary-section">
          <div className="summary-label">Username</div>
          <div className="summary-value">@{formData.username}</div>
        </div>

        <div className="summary-section">
          <div className="summary-label">Full Name</div>
          <div className="summary-value">{formData.first_name} {formData.last_name}</div>
        </div>

        <div className="summary-section">
          <div className="summary-label">Contact</div>
          <div className="summary-value">{formData.phone_number}</div>
        </div>

        <div className="summary-section">
          <div className="summary-label">Location</div>
          <div className="summary-value">
            {formData.city}, {formData.country}
          </div>
        </div>
      </div>

      <div className="completion-message">
        <p>Redirecting you to the dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="onboarding-container">
      <div className="background-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="onboarding-content">
        <div className="onboarding-card">
          {renderProgressBar()}

          <div className="onboarding-body">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
