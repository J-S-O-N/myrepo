# UI/UX Design Patterns

This document outlines the design patterns, component structures, and user experience guidelines used throughout BankApp.

---

## Table of Contents

1. [Layout Patterns](#layout-patterns)
2. [Component Patterns](#component-patterns)
3. [State Management Patterns](#state-management-patterns)
4. [Loading States](#loading-states)
5. [Error Handling](#error-handling)
6. [Form Patterns](#form-patterns)
7. [Color System](#color-system)
8. [Typography](#typography)
9. [Accessibility](#accessibility)

---

## Layout Patterns

### 3-Column Dashboard Layout

**Pattern**: Consistent grid layout across all authenticated pages

**Structure:**
```css
.dashboard-content {
  display: grid;
  grid-template-columns: 240px 1fr 320px;
  gap: 2rem;
  padding: 2rem;
  background: #f7fafc;
  min-height: calc(100vh - 80px);
}
```

**Columns:**
1. **Left Sidebar (240px)**: Fixed-width navigation menu
2. **Main Panel (1fr)**: Flexible content area
3. **Right Insights Panel (320px)**: Fixed-width contextual information

**Components Using This Pattern:**
- Dashboard.jsx
- Settings.jsx
- Accounts.jsx
- Investments.jsx
- Health.jsx
- Crypto.jsx

**Responsive Behavior:**
- Desktop (> 1024px): 3-column layout
- Tablet (768px - 1024px): Collapse insights panel, 2-column layout
- Mobile (< 768px): Single column, stack all content

**Example:**
```jsx
<div className="dashboard">
  <header className="dashboard-header">...</header>
  <div className="dashboard-content">
    <aside className="sidebar">...</aside>
    <main className="main-panel">...</main>
    <aside className="insights-panel">...</aside>
  </div>
</div>
```

---

### Card-Based Content

**Pattern**: White cards with consistent spacing and shadows

**CSS:**
```css
.settings-card,
.insights-card,
.account-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.settings-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

**Structure:**
```jsx
<div className="settings-card">
  <h3 className="card-title">Card Title</h3>
  <p className="card-description">Optional description</p>

  {/* Card content */}

  <div className="card-actions">
    <button className="btn-save">Save</button>
  </div>
</div>
```

**Usage Guidelines:**
- Use for distinct sections of related content
- Maximum width: 800px (for readability)
- Minimum padding: 2rem (32px)
- Border radius: 12px (consistent roundness)

---

## Component Patterns

### Navigation Menu

**Pattern**: Icon + label vertical navigation

**Structure:**
```jsx
<nav className="nav-menu">
  <button className="nav-item active">
    <span className="nav-icon">🏠</span>
    <span>Dashboard</span>
  </button>
  <button className="nav-item" onClick={() => onNavigate('accounts')}>
    <span className="nav-icon">💰</span>
    <span>Accounts</span>
  </button>
  {/* More nav items */}
</nav>
```

**States:**
- `.nav-item` - Default state (gray background on hover)
- `.nav-item.active` - Active page (blue gradient background)

**CSS:**
```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

---

### Insights Cards

**Pattern**: Summary information with label-value pairs

**Structure:**
```jsx
<div className="insights-card">
  <h3 className="insights-title">Monthly Summary</h3>

  <div className="insight-item">
    <span className="insight-label">Income</span>
    <span className="insight-value positive">+R 63,800.00</span>
  </div>

  <div className="insight-item">
    <span className="insight-label">Expenses</span>
    <span className="insight-value negative">-R 10,714.99</span>
  </div>
</div>
```

**Value Modifiers:**
- `.insight-value.positive` - Green text (income, gains)
- `.insight-value.negative` - Red text (expenses, losses)
- `.insight-value` - Default gray text (neutral values)

**CSS:**
```css
.insight-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.insight-value.positive {
  color: #10b981;
  font-weight: 600;
}

.insight-value.negative {
  color: #ef4444;
  font-weight: 600;
}
```

---

## State Management Patterns

### Section-Specific State Management

**Problem**: Global form state with single save button created poor UX - users couldn't identify which section failed.

**Solution**: Isolated state per section with dedicated save handlers.

**Pattern:**
```javascript
function Settings({ token }) {
  // Section 1: Address
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');

  // Section 2: Transaction Limits
  const [limitsSaving, setLimitsSaving] = useState(false);
  const [limitsError, setLimitsError] = useState('');
  const [limitsSuccess, setLimitsSuccess] = useState('');

  // Individual save handlers
  const handleSaveAddress = async () => {
    try {
      setAddressSaving(true);
      setAddressError('');
      setAddressSuccess('');

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          street_address: formData.street_address,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      setAddressSuccess('Address saved successfully!');
    } catch (err) {
      setAddressError(err.message);
    } finally {
      setAddressSaving(false);
    }
  };

  return (
    <div className="settings-card">
      {addressError && (
        <div className="alert-banner error">
          <span>⚠️</span> {addressError}
        </div>
      )}
      {addressSuccess && (
        <div className="alert-banner success">
          <span>✅</span> {addressSuccess}
        </div>
      )}

      {/* Form fields */}

      <button onClick={handleSaveAddress} disabled={addressSaving}>
        {addressSaving ? 'Saving...' : 'Save Address'}
      </button>
    </div>
  );
}
```

**Benefits:**
- Clear error messaging per section
- Reduced API payload (partial updates)
- Better loading states (only affected section shows spinner)
- Improved accessibility (errors near inputs)

**Tradeoffs:**
- More boilerplate code (12 state variables vs 3)
- Cannot batch multiple section updates in single API call

---

### Data Fetching Pattern

**Pattern**: useEffect with async function, loading/error states

**Standard Implementation:**
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  fetchData();
}, [dependency]);

const fetchData = async () => {
  try {
    setLoading(true);
    setError('');

    const token = sessionStorage.getItem('token');
    const response = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    setData(result);
  } catch (err) {
    console.error('Error fetching data:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Best Practices:**
- Always set loading to true before fetch
- Clear previous errors before new fetch
- Handle both network and HTTP errors
- Use finally block to ensure loading is set to false
- Log errors to console for debugging

---

## Loading States

### Full Layout Loading

**Use Case**: Initial page load with unknown content structure

**Implementation:**
```jsx
if (loading) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        {/* Full header with logo and user info */}
      </header>
      <div className="dashboard-content">
        <aside className="sidebar">
          {/* Full navigation menu */}
        </aside>
        <main className="main-panel">
          <div className="settings-loading">Loading settings...</div>
        </main>
      </div>
    </div>
  );
}
```

**CSS:**
```css
.settings-loading {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
  font-size: 1.125rem;
  font-weight: 500;
}
```

**Benefits:**
- No layout shift when content loads
- Familiar navigation remains visible
- Better perceived performance

**Used In:**
- Dashboard.jsx
- Settings.jsx
- Accounts.jsx

---

### Inline Loading (Button States)

**Use Case**: Section-specific save operations

**Implementation:**
```jsx
<button
  className="btn-save"
  onClick={handleSave}
  disabled={saving}
>
  {saving ? 'Saving...' : 'Save Changes'}
</button>
```

**CSS:**
```css
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

**Best Practices:**
- Always disable button during operation
- Change text to indicate progress ("Saving...", "Loading...", "Processing...")
- Optional: Add spinner icon for longer operations

---

### Skeleton Loading

**Use Case**: Known content structure with placeholders

**Implementation:**
```jsx
<div className="transaction-skeleton">
  <div className="skeleton-line" style={{ width: '60%' }}></div>
  <div className="skeleton-line" style={{ width: '40%' }}></div>
  <div className="skeleton-line" style={{ width: '80%' }}></div>
</div>
```

**CSS:**
```css
.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

**Use For:**
- Transaction lists
- Account cards
- Activity feeds

---

## Error Handling

### Alert Banners

**Pattern**: Contextual error/success messages within sections

**Types:**
1. **Error Alert** - Red background, warning icon
2. **Success Alert** - Green background, checkmark icon
3. **Info Alert** - Blue background, info icon

**Implementation:**
```jsx
{error && (
  <div className="alert-banner error">
    <span>⚠️</span> {error}
  </div>
)}

{success && (
  <div className="alert-banner success">
    <span>✅</span> {success}
  </div>
)}
```

**CSS:**
```css
.alert-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.alert-banner.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.alert-banner.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.alert-banner.info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}
```

**Best Practices:**
- Always include an icon for quick visual scanning
- Use concise, actionable messages
- Co-locate with affected section (not at top of page)
- Auto-clear on next user action or after 5 seconds

---

### Error States for Forms

**Pattern**: Inline validation errors

**Implementation:**
```jsx
<div className="form-field">
  <label>Email Address</label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className={errors.email ? 'input-error' : ''}
  />
  {errors.email && (
    <span className="field-error">{errors.email}</span>
  )}
</div>
```

**CSS:**
```css
.input-error {
  border-color: #ef4444 !important;
  background: #fef2f2;
}

.field-error {
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
```

---

## Form Patterns

### Text Input Fields

**Standard Structure:**
```jsx
<div className="form-field">
  <label>Field Label</label>
  <input
    type="text"
    name="field_name"
    value={formData.field_name}
    onChange={handleInputChange}
    placeholder="Enter value"
    className="input-field"
  />
  <small className="field-hint">Optional hint text</small>
</div>
```

**CSS:**
```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.input-field {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.field-hint {
  font-size: 0.75rem;
  color: #6b7280;
}
```

---

### Toggle Switches

**Pattern**: Boolean preference controls

**Implementation:**
```jsx
<div className="toggle-row">
  <div className="toggle-info">
    <div className="toggle-label">Feature Name</div>
    <div className="toggle-description">Description of what this toggle controls</div>
  </div>
  <label className="toggle-switch">
    <input
      type="checkbox"
      name="feature_enabled"
      checked={formData.feature_enabled}
      onChange={handleInputChange}
    />
    <span className="toggle-slider"></span>
  </label>
</div>
```

**CSS:**
```css
.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #667eea;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}
```

---

### Form Grid Layout

**Pattern**: Responsive multi-column form layout

**Implementation:**
```jsx
<div className="settings-form-grid">
  <div className="form-field">
    <label>First Name</label>
    <input type="text" name="first_name" />
  </div>
  <div className="form-field">
    <label>Last Name</label>
    <input type="text" name="last_name" />
  </div>
  <div className="form-field">
    <label>Email</label>
    <input type="email" name="email" />
  </div>
  <div className="form-field">
    <label>Phone</label>
    <input type="tel" name="phone" />
  </div>
</div>
```

**CSS:**
```css
.settings-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .settings-form-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Color System

### Primary Colors

```css
/* Brand Purple */
--primary-purple: #667eea;
--primary-purple-dark: #764ba2;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Semantic Colors

```css
/* Success */
--success-bg: #d1fae5;
--success-text: #065f46;
--success-border: #6ee7b7;

/* Error */
--error-bg: #fee2e2;
--error-text: #991b1b;
--error-border: #fca5a5;

/* Warning */
--warning-bg: #fef3c7;
--warning-text: #92400e;
--warning-border: #fcd34d;

/* Info */
--info-bg: #dbeafe;
--info-text: #1e40af;
--info-border: #93c5fd;
```

### Neutral Colors

```css
/* Grays */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Financial Colors

```css
/* Positive (Income, Gains) */
--positive: #10b981;
--positive-light: #d1fae5;

/* Negative (Expenses, Losses) */
--negative: #ef4444;
--negative-light: #fee2e2;
```

---

## Typography

### Font Stack

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
               'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
               'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Font Sizes

```css
/* Headings */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-2xl: 1.5rem;    /* 24px - Section titles */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-lg: 1.125rem;   /* 18px - Subheadings */

/* Body */
--text-base: 1rem;     /* 16px - Default body text */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-xs: 0.75rem;    /* 12px - Hints, labels */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Example Usage

```css
.panel-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--gray-900);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--gray-800);
}

.field-hint {
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  color: var(--gray-500);
}
```

---

## Accessibility

### ARIA Labels

**Navigation:**
```jsx
<nav className="nav-menu" aria-label="Main navigation">
  <button className="nav-item" aria-current="page">
    <span className="nav-icon" aria-hidden="true">🏠</span>
    <span>Dashboard</span>
  </button>
</nav>
```

**Form Controls:**
```jsx
<label htmlFor="daily-limit">Daily Limit (R)</label>
<input
  id="daily-limit"
  type="number"
  name="daily_limit"
  aria-describedby="daily-limit-hint"
/>
<small id="daily-limit-hint">Maximum daily transaction amount</small>
```

**Error Messages:**
```jsx
<input
  type="email"
  aria-invalid={errors.email ? "true" : "false"}
  aria-errormessage="email-error"
/>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email}
  </span>
)}
```

---

### Keyboard Navigation

**Focus Styles:**
```css
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

**Skip Links:**
```jsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

**Tab Order:**
- Ensure logical tab order through DOM structure
- Use `tabindex="0"` for custom interactive elements
- Use `tabindex="-1"` to remove from tab order (decorative elements)

---

### Color Contrast

**WCAG AA Compliance:**
- Text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

**Examples:**
- ✅ Dark gray text (#374151) on white (#ffffff) - 11.7:1
- ✅ White text (#ffffff) on primary purple (#667eea) - 4.7:1
- ✅ Success text (#065f46) on success bg (#d1fae5) - 6.2:1

---

## Animation & Transitions

### Standard Transitions

```css
.btn-primary,
.input-field,
.nav-item {
  transition: all 0.2s ease-in-out;
}
```

### Hover Effects

```css
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.account-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### Loading Animations

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

**Best Practices:**
- Keep animations under 300ms for snappy feel
- Use `ease-in-out` for natural motion
- Reduce motion for users with `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Mobile Responsiveness

### Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    left: -240px;
    transition: left 0.3s;
  }

  .sidebar.open {
    left: 0;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .dashboard-content {
    grid-template-columns: 240px 1fr;
  }

  .insights-panel {
    display: none;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 240px 1fr 320px;
  }
}
```

### Touch Targets

**Minimum size: 44×44px for tap targets**

```css
.nav-item,
.btn-primary,
.toggle-switch {
  min-height: 44px;
  min-width: 44px;
}
```

---

*Last Updated: January 30, 2026*
