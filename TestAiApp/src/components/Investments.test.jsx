import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Investments from './Investments';

describe('Investments Component', () => {
  const mockProps = {
    userEmail: 'test@example.com',
    onLogout: vi.fn(),
    onNavigate: vi.fn(),
  };

  beforeEach(() => {
    mockProps.onLogout.mockClear();
    mockProps.onNavigate.mockClear();
  });

  it('renders all portfolio cards', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText('Growth Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Balanced Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Income Portfolio')).toBeInTheDocument();
  });

  it('displays portfolio types correctly', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText('Aggressive')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('Conservative')).toBeInTheDocument();
  });

  it('shows correct total portfolio value', () => {
    render(<Investments {...mockProps} />);

    // Total: 287900.75 + 156750.50 + 98450.25 = 543,101.50
    expect(screen.getByText(/R 543,101\.50/)).toBeInTheDocument();
  });

  it('displays portfolio balances', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText(/R 287,900\.75/)).toBeInTheDocument();
    expect(screen.getByText(/R 156,750\.50/)).toBeInTheDocument();
    expect(screen.getByText(/R 98,450\.25/)).toBeInTheDocument();
  });

  it('shows portfolio return percentages', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText(/\+43\.95%/)).toBeInTheDocument();
    expect(screen.getByText(/\+30\.63%/)).toBeInTheDocument();
    expect(screen.getByText(/\+15\.82%/)).toBeInTheDocument();
  });

  it('calculates and displays total returns', () => {
    render(<Investments {...mockProps} />);

    // Total invested: 200000 + 120000 + 85000 = 405000
    expect(screen.getByText(/R 405,000\.00/)).toBeInTheDocument();

    // Total returns: 543101.50 - 405000 = 138101.50
    expect(screen.getByText(/R 138,101\.50/)).toBeInTheDocument();
  });

  it('selects Growth Portfolio by default', () => {
    render(<Investments {...mockProps} />);

    const growthCard = screen.getByText('Growth Portfolio').closest('.portfolio-card');
    expect(growthCard).toHaveClass('selected');
  });

  it('switches selected portfolio when clicked', async () => {
    const user = userEvent.setup();
    render(<Investments {...mockProps} />);

    const balancedCard = screen.getByText('Balanced Portfolio').closest('.portfolio-card');
    await user.click(balancedCard);

    expect(balancedCard).toHaveClass('selected');
    expect(screen.getByText(/3-Year Performance - Balanced Portfolio/i)).toBeInTheDocument();
  });

  it('displays performance chart for selected portfolio', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText(/3-Year Performance - Growth Portfolio/i)).toBeInTheDocument();

    // Chart should show years
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('shows asset allocation for selected portfolio', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText(/asset allocation - growth portfolio/i)).toBeInTheDocument();
    expect(screen.getByText('Stocks')).toBeInTheDocument();
    expect(screen.getByText('Bonds')).toBeInTheDocument();
    expect(screen.getByText('Cash')).toBeInTheDocument();
  });

  it('displays allocation percentages correctly', () => {
    render(<Investments {...mockProps} />);

    // Growth portfolio: 70% stocks, 20% bonds, 10% cash
    const percentages = screen.getAllByText(/70%|20%|10%/);
    expect(percentages.length).toBeGreaterThan(0);
  });

  it('shows top performing stocks', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Corp.')).toBeInTheDocument();
    expect(screen.getByText('NVIDIA Corp.')).toBeInTheDocument();
  });

  it('displays stock symbols and performance', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('NVDA')).toBeInTheDocument();

    expect(screen.getByText(/\+15\.2%/)).toBeInTheDocument();
    expect(screen.getByText(/\+12\.8%/)).toBeInTheDocument();
    expect(screen.getByText(/\+28\.5%/)).toBeInTheDocument();
  });

  it('renders market insights', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText(/global markets up 2\.3% this week/i)).toBeInTheDocument();
    expect(screen.getByText(/tech sector leading gains/i)).toBeInTheDocument();
    expect(screen.getByText(/emerging markets showing strength/i)).toBeInTheDocument();
  });

  it('displays quick action buttons', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText(/add funds/i)).toBeInTheDocument();
    expect(screen.getByText(/withdraw/i)).toBeInTheDocument();
    expect(screen.getByText(/rebalance/i)).toBeInTheDocument();
  });

  it('navigates to other pages when nav items clicked', async () => {
    const user = userEvent.setup();
    render(<Investments {...mockProps} />);

    const accountsButton = screen.getAllByText(/accounts/i)[0].closest('button');
    await user.click(accountsButton);

    expect(mockProps.onNavigate).toHaveBeenCalledWith('accounts');
  });

  it('calls logout when logout button clicked', async () => {
    const user = userEvent.setup();
    render(<Investments {...mockProps} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  it('displays user email in header', () => {
    render(<Investments {...mockProps} />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('updates chart when different portfolio selected', async () => {
    const user = userEvent.setup();
    render(<Investments {...mockProps} />);

    // Initially showing Growth Portfolio
    expect(screen.getByText(/3-Year Performance - Growth Portfolio/i)).toBeInTheDocument();

    // Click Income Portfolio
    const incomeCard = screen.getByText('Income Portfolio').closest('.portfolio-card');
    await user.click(incomeCard);

    // Chart should update
    expect(screen.getByText(/3-Year Performance - Income Portfolio/i)).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    render(<Investments {...mockProps} />);

    const investmentsNavButton = screen.getAllByText(/investments/i)
      .find(el => el.closest('.nav-item.active'));

    expect(investmentsNavButton).toBeInTheDocument();
  });

  it('formats currency values correctly for large numbers', () => {
    render(<Investments {...mockProps} />);

    // Should use M for millions, B for billions
    const formattedValues = screen.getAllByText(/R \d+\.\d+[MB]/);
    expect(formattedValues.length).toBeGreaterThan(0);
  });
});
