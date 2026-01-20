import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  it('renders Login component when not authenticated', () => {
    render(<App />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('navigates to Dashboard after successful login', async () => {
    const user = userEvent.setup();
    render(<App />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/total balance/i)).toBeInTheDocument();
    });
  });

  it('maintains authentication state and displays user email', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText(/email/i), 'user@test.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('user@test.com')).toBeInTheDocument();
    });
  });

  it('logs out and returns to login page', async () => {
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
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });

  it('navigates to Accounts page', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Login
    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/total balance/i)).toBeInTheDocument();
    });

    // Navigate to Accounts
    const accountsButtons = screen.getAllByText(/accounts/i);
    const accountsNavButton = accountsButtons.find(btn => btn.closest('button'));
    await user.click(accountsNavButton);

    await waitFor(() => {
      expect(screen.getByText(/my accounts/i)).toBeInTheDocument();
    });
  });

  it('navigates to Investments page', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      const investmentsButton = screen.getByRole('button', { name: /investments/i });
      return user.click(investmentsButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/investment portfolios/i)).toBeInTheDocument();
    });
  });

  it('navigates to Health & Fitness page', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      const healthButton = screen.getByRole('button', { name: /health & fitness/i });
      return user.click(healthButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/health & fitness/i)).toBeInTheDocument();
    });
  });
});
