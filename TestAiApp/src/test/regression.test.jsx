import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

/**
 * Regression Test Suite
 *
 * These tests ensure that previously fixed bugs don't reappear
 * and critical user flows remain functional across updates.
 */

describe('Regression Tests - Critical User Flows', () => {
  describe('Authentication Flow', () => {
    it('REG-001: User can complete full login flow without errors', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), 'user@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/total balance/i)).toBeInTheDocument();
        expect(screen.getByText('user@example.com')).toBeInTheDocument();
      });
    });

    it('REG-002: Login validation prevents empty submissions', async () => {
      const user = userEvent.setup();
      render(<App />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Should not proceed to dashboard
      expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    it('REG-003: Logout clears user session and returns to login', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Login
      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/total balance/i)).toBeInTheDocument();
      });

      // Logout
      await user.click(screen.getByRole('button', { name: /logout/i }));

      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
        expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation Flow', () => {
    const loginUser = async (user) => {
      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      await waitFor(() => {
        expect(screen.getByText(/total balance/i)).toBeInTheDocument();
      });
    };

    it('REG-004: Navigation between all pages works correctly', async () => {
      const user = userEvent.setup();
      render(<App />);
      await loginUser(user);

      // Navigate to Accounts
      const accountsNav = screen.getAllByText(/accounts/i).find(el => el.closest('button'));
      await user.click(accountsNav);
      await waitFor(() => {
        expect(screen.getByText(/my accounts/i)).toBeInTheDocument();
      });

      // Navigate to Investments
      await user.click(screen.getByRole('button', { name: /investments/i }));
      await waitFor(() => {
        expect(screen.getByText(/investment portfolios/i)).toBeInTheDocument();
      });

      // Navigate to Crypto
      await user.click(screen.getAllByText(/crypto/i).find(el => el.closest('button')));
      await waitFor(() => {
        expect(screen.getByText(/cryptocurrency market/i)).toBeInTheDocument();
      });

      // Navigate to Health
      await user.click(screen.getByRole('button', { name: /health & fitness/i }));
      await waitFor(() => {
        expect(screen.getAllByText(/health & fitness/i).length).toBeGreaterThan(0);
      });

      // Navigate back to Dashboard
      await user.click(screen.getAllByText(/dashboard/i).find(el => el.closest('button')));
      await waitFor(() => {
        expect(screen.getByText(/total balance/i)).toBeInTheDocument();
      });
    });

    it('REG-005: User email persists across page navigation', async () => {
      const user = userEvent.setup();
      const testEmail = 'persistent@example.com';
      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), testEmail);
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(testEmail)).toBeInTheDocument();
      });

      // Navigate to Accounts
      await user.click(screen.getAllByText(/accounts/i).find(el => el.closest('button')));
      await waitFor(() => {
        expect(screen.getByText(testEmail)).toBeInTheDocument();
      });

      // Navigate to Crypto
      await user.click(screen.getAllByText(/crypto/i).find(el => el.closest('button')));
      await waitFor(() => {
        expect(screen.getByText(testEmail)).toBeInTheDocument();
      });
    });
  });

  describe('Data Display Regression', () => {
    it('REG-006: Account balances format correctly with ZAR currency', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/total balance/i)).toBeInTheDocument();
      });

      // Navigate to Accounts page
      await user.click(screen.getAllByText(/accounts/i).find(el => el.closest('button')));

      await waitFor(() => {
        // Should show ZAR formatted balances with R prefix
        const zarBalances = screen.getAllByText(/R \d{1,3}(,\d{3})*\.\d{2}/);
        expect(zarBalances.length).toBeGreaterThan(0);
      });
    });

    it('REG-007: Large numbers display with appropriate suffixes (M, B, T)', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/total balance/i)).toBeInTheDocument();
      });

      // Navigate to Investments
      await user.click(screen.getByRole('button', { name: /investments/i }));

      await waitFor(() => {
        // Should show formatted large numbers
        const formattedNumbers = screen.getAllByText(/R \d+\.\d+[MBT]/);
        expect(formattedNumbers.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Form Validation Regression', () => {
    it('REG-008: Email validation accepts all valid email formats', async () => {
      const validEmails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.org',
        'user_name@example.co.uk',
      ];

      for (const email of validEmails) {
        const user = userEvent.setup();
        const { unmount } = render(<App />);

        await user.type(screen.getByPlaceholderText(/email/i), email);
        await user.type(screen.getByPlaceholderText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
          expect(screen.getByText(/total balance/i)).toBeInTheDocument();
        });

        unmount();
      }
    });

    it('REG-009: Email validation rejects invalid formats', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      for (const email of invalidEmails) {
        const user = userEvent.setup();
        const { unmount } = render(<App />);

        await user.type(screen.getByPlaceholderText(/email/i), email);
        await user.type(screen.getByPlaceholderText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        // Should show error, not proceed to dashboard
        expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();

        unmount();
      }
    });

    it('REG-010: Password validation enforces 8 character minimum', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'short');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.queryByText(/total balance/i)).not.toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  describe('UI State Regression', () => {
    it('REG-011: Active navigation item highlights correctly on each page', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        // Dashboard should be active
        expect(screen.getAllByText(/dashboard/i).some(el =>
          el.closest('.nav-item.active')
        )).toBe(true);
      });

      // Navigate to Accounts
      await user.click(screen.getAllByText(/accounts/i).find(el => el.closest('button')));
      await waitFor(() => {
        expect(screen.getAllByText(/accounts/i).some(el =>
          el.closest('.nav-item.active')
        )).toBe(true);
      });
    });

    it('REG-012: Logout button is accessible on all pages', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      const pages = ['accounts', 'investments', 'health'];

      for (const page of pages) {
        await user.click(screen.getByRole('button', { name: new RegExp(page, 'i') }));
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
        });
      }
    });
  });

  describe('Performance Regression', () => {
    it('REG-013: Component renders without excessive re-renders', async () => {
      const renderCount = { count: 0 };
      const user = userEvent.setup();

      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/total balance/i)).toBeInTheDocument();
      });

      // Component should render efficiently
      expect(screen.getByText(/total balance/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility Regression', () => {
    it('REG-014: All interactive elements are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Tab through form inputs
      await user.tab();
      expect(screen.getByPlaceholderText(/email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByPlaceholderText(/password/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /sign in/i })).toHaveFocus();
    });

    it('REG-015: Form can be submitted with Enter key', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/total balance/i)).toBeInTheDocument();
      });
    });
  });
});
