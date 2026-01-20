import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Health from './Health';

describe('Health Component', () => {
  const mockProps = {
    userEmail: 'test@example.com',
    onLogout: vi.fn(),
    onNavigate: vi.fn(),
  };

  beforeEach(() => {
    mockProps.onLogout.mockClear();
    mockProps.onNavigate.mockClear();
  });

  it('renders health stats cards', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText(/steps today/i)).toBeInTheDocument();
    expect(screen.getByText(/calories burned/i)).toBeInTheDocument();
    expect(screen.getByText(/water intake/i)).toBeInTheDocument();
    expect(screen.getByText(/sleep/i)).toBeInTheDocument();
  });

  it('displays correct health metrics', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText('8,547')).toBeInTheDocument(); // Steps
    expect(screen.getByText('2,345')).toBeInTheDocument(); // Calories
    expect(screen.getByText('6')).toBeInTheDocument(); // Water glasses
    expect(screen.getByText('7.2h')).toBeInTheDocument(); // Sleep hours
  });

  it('shows goals for each metric', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText(/goal: 10,000/i)).toBeInTheDocument(); // Steps goal
    expect(screen.getByText(/goal: 2,500/i)).toBeInTheDocument(); // Calories goal
    expect(screen.getByText(/goal: 8 glasses/i)).toBeInTheDocument(); // Water goal
    expect(screen.getByText(/goal: 8 hours/i)).toBeInTheDocument(); // Sleep goal
  });

  it('calculates progress percentages correctly', () => {
    render(<Health {...mockProps} />);

    // Steps: 8547/10000 = 85%
    // Calories: 2345/2500 = 94%
    // Water: 6/8 = 75%
    // Sleep: 7.2/8 = 90%
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('displays weekly activity chart', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText(/weekly activity/i)).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  it('shows recent workouts', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText(/recent workouts/i)).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Cycling')).toBeInTheDocument();
    expect(screen.getByText('Yoga')).toBeInTheDocument();
    expect(screen.getByText('Swimming')).toBeInTheDocument();
    expect(screen.getByText('Weight Training')).toBeInTheDocument();
  });

  it('displays workout details correctly', () => {
    render(<Health {...mockProps} />);

    // Check for workout durations and calories
    expect(screen.getByText(/35 min/)).toBeInTheDocument();
    expect(screen.getByText(/420 cal/)).toBeInTheDocument();
    expect(screen.getByText(/45 min/)).toBeInTheDocument();
    expect(screen.getByText(/380 cal/)).toBeInTheDocument();
  });

  it('shows workout dates', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText('2026-01-20')).toBeInTheDocument();
    expect(screen.getByText('2026-01-19')).toBeInTheDocument();
    expect(screen.getByText('2026-01-18')).toBeInTheDocument();
  });

  it('displays fitness goals sidebar', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText(/fitness goals/i)).toBeInTheDocument();
    expect(screen.getByText('Lose 5 lbs')).toBeInTheDocument();
    expect(screen.getByText('Run 5K')).toBeInTheDocument();
    expect(screen.getByText('Drink More Water')).toBeInTheDocument();
  });

  it('shows goal progress bars with correct percentages', () => {
    render(<Health {...mockProps} />);

    // Goals are 60%, 75%, 85%
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('displays goal targets and current values', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText(/of 5 lbs/i)).toBeInTheDocument();
    expect(screen.getByText(/of 5K/i)).toBeInTheDocument();
    expect(screen.getByText(/of 8 glasses\/day/i)).toBeInTheDocument();
  });

  it('switches between week, month, and year periods', async () => {
    const user = userEvent.setup();
    render(<Health {...mockProps} />);

    const weekButton = screen.getByRole('button', { name: /week/i });
    const monthButton = screen.getByRole('button', { name: /month/i });
    const yearButton = screen.getByRole('button', { name: /year/i });

    // Week is active by default
    expect(weekButton).toHaveClass('active');

    // Click month
    await user.click(monthButton);
    expect(monthButton).toHaveClass('active');

    // Click year
    await user.click(yearButton);
    expect(yearButton).toHaveClass('active');
  });

  it('shows health tips in sidebar', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText(/health tips/i)).toBeInTheDocument();
    expect(screen.getByText(/stay hydrated during workouts/i)).toBeInTheDocument();
    expect(screen.getByText(/eat protein after exercise/i)).toBeInTheDocument();
    expect(screen.getByText(/get 7-9 hours of sleep/i)).toBeInTheDocument();
  });

  it('navigates to other pages when nav buttons clicked', async () => {
    const user = userEvent.setup();
    render(<Health {...mockProps} />);

    const dashboardButton = screen.getAllByText(/dashboard/i)[0].closest('button');
    await user.click(dashboardButton);

    expect(mockProps.onNavigate).toHaveBeenCalledWith('dashboard');
  });

  it('calls logout when logout button clicked', async () => {
    const user = userEvent.setup();
    render(<Health {...mockProps} />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  it('displays user email in header', () => {
    render(<Health {...mockProps} />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    render(<Health {...mockProps} />);

    const healthNavButton = screen.getAllByText(/health & fitness/i)
      .find(el => el.closest('.nav-item.active'));

    expect(healthNavButton).toBeInTheDocument();
  });

  it('displays workout icons correctly', () => {
    render(<Health {...mockProps} />);

    // Check for emoji icons
    expect(screen.getByText('🏃')).toBeInTheDocument(); // Running
    expect(screen.getByText('🚴')).toBeInTheDocument(); // Cycling
    expect(screen.getByText('🧘')).toBeInTheDocument(); // Yoga
    expect(screen.getByText('🏊')).toBeInTheDocument(); // Swimming
    expect(screen.getByText('🏋️')).toBeInTheDocument(); // Weight Training
  });
});
