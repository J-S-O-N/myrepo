# Testing Documentation

## Overview

This project uses **Vitest** and **React Testing Library** for unit and regression testing.

## Test Coverage

### Unit Tests

- **App.test.jsx** - Main application component and routing
- **Login.test.jsx** - Authentication and form validation
- **Crypto.test.jsx** - Cryptocurrency API integration and display
- **Accounts.test.jsx** - Banking accounts display and formatting
- **Investments.test.jsx** - Investment portfolios and charts
- **Health.test.jsx** - Health metrics and fitness tracking

### Regression Tests

- **regression.test.jsx** - Critical user flows and bug prevention
  - Authentication flows (REG-001 to REG-003)
  - Navigation flows (REG-004 to REG-005)
  - Data display (REG-006 to REG-007)
  - Form validation (REG-008 to REG-010)
  - UI state management (REG-011 to REG-012)
  - Performance (REG-013)
  - Accessibility (REG-014 to REG-015)

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests once (CI mode)
```bash
npm run test:run
```

### Run regression tests only
```bash
npm run test:regression
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run tests with UI interface
```bash
npm run test:ui
```

## Test Structure

```
TestAiApp/
├── src/
│   ├── App.test.jsx
│   ├── components/
│   │   ├── Login.test.jsx
│   │   ├── Crypto.test.jsx
│   │   ├── Accounts.test.jsx
│   │   ├── Investments.test.jsx
│   │   └── Health.test.jsx
│   └── test/
│       ├── setup.js              # Test configuration
│       └── regression.test.jsx   # Regression test suite
└── vitest.config.js              # Vitest configuration
```

## Writing New Tests

### Unit Test Template

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  const mockProps = {
    prop1: 'value1',
    onAction: vi.fn(),
  };

  it('renders correctly', () => {
    render(<YourComponent {...mockProps} />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<YourComponent {...mockProps} />);

    await user.click(screen.getByRole('button'));
    expect(mockProps.onAction).toHaveBeenCalled();
  });
});
```

### Regression Test Template

```javascript
it('REG-XXX: Description of what should not break', async () => {
  const user = userEvent.setup();
  render(<App />);

  // Simulate user flow
  await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');

  // Assert expected behavior
  expect(screen.getByText(/expected result/i)).toBeInTheDocument();
});
```

## Test Best Practices

### DO:
- ✅ Test user behavior, not implementation details
- ✅ Use accessible queries (getByRole, getByLabelText)
- ✅ Write descriptive test names
- ✅ Mock external dependencies (API calls, etc.)
- ✅ Clean up after each test
- ✅ Test edge cases and error states

### DON'T:
- ❌ Test internal component state directly
- ❌ Use querySelector or className selectors
- ❌ Write tests that depend on each other
- ❌ Mock everything (test real behavior when possible)
- ❌ Ignore accessibility

## Coverage Goals

- **Lines:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Statements:** 80%+

## Common Testing Patterns

### Testing Async Operations

```javascript
await waitFor(() => {
  expect(screen.getByText(/loaded data/i)).toBeInTheDocument();
});
```

### Testing Form Submissions

```javascript
const user = userEvent.setup();
await user.type(screen.getByLabelText(/email/i), 'test@example.com');
await user.click(screen.getByRole('button', { name: /submit/i }));
```

### Mocking API Calls

```javascript
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({ data: 'mock data' }),
  })
);
```

### Testing Navigation

```javascript
const mockNavigate = vi.fn();
render(<Component onNavigate={mockNavigate} />);
await user.click(screen.getByRole('button', { name: /next/i }));
expect(mockNavigate).toHaveBeenCalledWith('next-page');
```

## Debugging Tests

### View test output in browser
```bash
npm run test:ui
```

### Enable debug mode
```javascript
import { screen } from '@testing-library/react';

// Print the DOM tree
screen.debug();

// Print a specific element
screen.debug(screen.getByText(/some text/i));
```

### Check what queries are available
```javascript
screen.logTestingPlaygroundURL();
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Tests
  run: npm run test:run

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

### Tests failing with "not wrapped in act(...)"
Use `waitFor` or `findBy` queries for async operations.

### Can't find element
Use `screen.debug()` to see the rendered output.

### Mock not working
Ensure mocks are cleared between tests with `beforeEach(() => mockFn.mockClear())`.

### Timeout errors
Increase timeout in `waitFor`:
```javascript
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 5000 });
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Playground](https://testing-playground.com/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
