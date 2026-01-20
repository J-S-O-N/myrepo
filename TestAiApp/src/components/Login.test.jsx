import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

describe('Login Component', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders login form correctly', () => {
    render(<Login onLogin={mockOnLogin} />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalidemail');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('validates password length (minimum 8 characters)', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'pass');
    await user.click(submitButton);

    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('successfully logs in with valid credentials', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('user@example.com');
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });
  });

  it('clears error message when user starts typing', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Trigger validation error
    await user.type(emailInput, 'invalidemail');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();

    // Start typing to clear error
    await user.clear(emailInput);
    await user.type(emailInput, 'v');

    expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });

  it('accepts various valid email formats', async () => {
    const user = userEvent.setup();
    const validEmails = [
      'test@example.com',
      'user.name@company.co.uk',
      'first+last@domain.org',
      'email_123@test-domain.com',
    ];

    for (const email of validEmails) {
      const { unmount } = render(<Login onLogin={mockOnLogin} />);

      await user.type(screen.getByPlaceholderText(/email/i), email);
      await user.type(screen.getByPlaceholderText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith(email);
      });

      mockOnLogin.mockClear();
      unmount();
    }
  });
});
