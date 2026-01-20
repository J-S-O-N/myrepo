import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accounts from './Accounts';

describe('Accounts Component', () => {
  const mockProps = {
    userEmail: 'test@example.com',
    onLogout: vi.fn(),
    onNavigate: vi.fn(),
  };

  beforeEach(() => {
    mockProps.onLogout.mockClear();
    mockProps.onNavigate.mockClear();
  });

  it('renders all account cards', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText('Current Account')).toBeInTheDocument();
    expect(screen.getByText('Savings Account')).toBeInTheDocument();
    expect(screen.getByText('Investment Account')).toBeInTheDocument();
    expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    expect(screen.getByText('Travel Fund')).toBeInTheDocument();
  });

  it('displays correct total balance', () => {
    render(<Accounts {...mockProps} />);

    // Total: 45678.90 + 125450.50 + 287900.75 + 58200.00 + 34567.25 = 551,797.40
    expect(screen.getByText(/R 551,797\.40/)).toBeInTheDocument();
  });

  it('displays account count', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText(/5 active accounts/i)).toBeInTheDocument();
  });

  it('shows account balances in ZAR format', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText(/R 45,678\.90/)).toBeInTheDocument();
    expect(screen.getByText(/R 125,450\.50/)).toBeInTheDocument();
    expect(screen.getByText(/R 287,900\.75/)).toBeInTheDocument();
  });

  it('displays recent activity transactions', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText('Woolworths')).toBeInTheDocument();
    expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
    expect(screen.getByText('Transfer from Current')).toBeInTheDocument();
    expect(screen.getByText('Pick n Pay')).toBeInTheDocument();
  });

  it('shows transaction amounts with correct sign', () => {
    render(<Accounts {...mockProps} />);

    // Credit transactions should have +
    expect(screen.getByText(/\+R 35,000\.00/)).toBeInTheDocument();
    expect(screen.getByText(/\+R 5,000\.00/)).toBeInTheDocument();

    // Debit transactions should show negative amounts
    expect(screen.getByText(/R 1,250\.50/)).toBeInTheDocument();
  });

  it('allows selecting an account', async () => {
    const user = userEvent.setup();
    render(<Accounts {...mockProps} />);

    const savingsAccount = screen.getByText('Savings Account').closest('.account-item');
    await user.click(savingsAccount);

    expect(savingsAccount).toHaveClass('selected');
  });

  it('displays account summary sidebar', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText(/checking accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/savings accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/investment accounts/i)).toBeInTheDocument();
  });

  it('shows correct account type counts', () => {
    render(<Accounts {...mockProps} />);

    const summaryItems = screen.getAllByText(/\d+/).filter(el =>
      el.closest('.summary-count')
    );

    // 1 Checking, 3 Savings, 1 Investment
    expect(summaryItems[0]).toHaveTextContent('1');
    expect(summaryItems[1]).toHaveTextContent('3');
    expect(summaryItems[2]).toHaveTextContent('1');
  });

  it('masks account numbers correctly', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText(/\*\*\*\*1234/)).toBeInTheDocument();
    expect(screen.getByText(/\*\*\*\*4567/)).toBeInTheDocument();
  });

  it('displays currency information', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText('ZAR')).toBeInTheDocument();
    expect(screen.getByText('South African Rand')).toBeInTheDocument();
  });

  it('navigates to different pages when nav buttons clicked', async () => {
    const user = userEvent.setup();
    render(<Accounts {...mockProps} />);

    const dashboardButton = screen.getAllByText(/dashboard/i)[0].closest('button');
    await user.click(dashboardButton);

    expect(mockProps.onNavigate).toHaveBeenCalledWith('dashboard');
  });

  it('calls logout when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<Accounts {...mockProps} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  it('displays user email in header', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('shows account status badges', () => {
    render(<Accounts {...mockProps} />);

    const statusBadges = screen.getAllByText('Active');
    expect(statusBadges).toHaveLength(5); // All 5 accounts are active
  });

  it('formats transaction dates correctly', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText('2026-01-20')).toBeInTheDocument();
    expect(screen.getByText('2026-01-19')).toBeInTheDocument();
  });

  it('renders quick action buttons', () => {
    render(<Accounts {...mockProps} />);

    expect(screen.getByText(/transfer money/i)).toBeInTheDocument();
    expect(screen.getByText(/download statement/i)).toBeInTheDocument();
    expect(screen.getByText(/account settings/i)).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    render(<Accounts {...mockProps} />);

    const accountsNavButton = screen.getAllByText(/accounts/i)
      .find(el => el.closest('.nav-item.active'));

    expect(accountsNavButton).toBeInTheDocument();
  });
});
