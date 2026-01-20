import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Crypto from './Crypto';

// Mock fetch
global.fetch = vi.fn();

describe('Crypto Component', () => {
  const mockProps = {
    userEmail: 'test@example.com',
    onLogout: vi.fn(),
    onNavigate: vi.fn(),
  };

  const mockCryptoData = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      current_price: 50000,
      price_change_percentage_24h: 2.5,
      market_cap: 1000000000000,
      total_volume: 50000000000,
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'eth',
      current_price: 3000,
      price_change_percentage_24h: -1.2,
      market_cap: 400000000000,
      total_volume: 20000000000,
    },
  ];

  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<Crypto {...mockProps} />);

    expect(screen.getByText(/loading cryptocurrency data/i)).toBeInTheDocument();
  });

  it('fetches and displays cryptocurrency data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCryptoData,
    });

    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.coingecko.com')
    );
  });

  it('displays market statistics', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCryptoData,
    });

    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/total market cap/i)).toBeInTheDocument();
      expect(screen.getByText(/24h volume/i)).toBeInTheDocument();
      expect(screen.getByText(/bitcoin dominance/i)).toBeInTheDocument();
    });
  });

  it('handles API errors and shows fallback data', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch live data/i)).toBeInTheDocument();
      expect(screen.getByText(/showing fallback data instead/i)).toBeInTheDocument();
    });

    // Should still show cryptocurrency data (fallback)
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });

  it('converts USD to ZAR correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          current_price: 1000, // $1000 USD
          price_change_percentage_24h: 2.5,
          market_cap: 1000000000,
          total_volume: 50000000,
        },
      ],
    });

    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      // Should show ZAR price (1000 * 18.50 = 18,500)
      expect(screen.getByText(/R 18,500/)).toBeInTheDocument();
    });
  });

  it('toggles between grid and list views', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCryptoData,
    });

    const user = userEvent.setup();
    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    // Default is grid view
    expect(screen.getByText(/⊞ grid/i).closest('button')).toHaveClass('active');

    // Switch to list view
    const listButton = screen.getByText(/☰ list/i);
    await user.click(listButton);

    expect(screen.getByText(/☰ list/i).closest('button')).toHaveClass('active');
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('refreshes data when refresh button is clicked', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockCryptoData,
    });

    const user = userEvent.setup();
    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    // Click refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('displays last updated timestamp', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCryptoData,
    });

    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/last updated:/i)).toBeInTheDocument();
    });
  });

  it('shows refresh button as disabled during loading', async () => {
    fetch.mockImplementation(() => new Promise((resolve) => {
      setTimeout(() => resolve({
        ok: true,
        json: async () => mockCryptoData,
      }), 100);
    }));

    render(<Crypto {...mockProps} />);

    const refreshButton = screen.getByRole('button', { name: /refreshing/i });
    expect(refreshButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^refresh$/i })).not.toBeDisabled();
    });
  });

  it('displays positive and negative price changes correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCryptoData,
    });

    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      // Bitcoin has +2.5% change
      expect(screen.getByText(/\+2.5%/)).toBeInTheDocument();
      // Ethereum has -1.2% change
      expect(screen.getByText(/-1.2%/)).toBeInTheDocument();
    });
  });

  it('navigates to other pages', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCryptoData,
    });

    const user = userEvent.setup();
    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    const dashboardButton = screen.getAllByText(/dashboard/i)[0].closest('button');
    await user.click(dashboardButton);

    expect(mockProps.onNavigate).toHaveBeenCalledWith('dashboard');
  });

  it('calls logout function when logout button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCryptoData,
    });

    const user = userEvent.setup();
    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  it('displays top gainers in sidebar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCryptoData,
    });

    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/top gainers \(24h\)/i)).toBeInTheDocument();
    });
  });

  it('formats large numbers correctly (trillions, billions, millions)', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          current_price: 50000,
          price_change_percentage_24h: 2.5,
          market_cap: 1000000000000 / 18.5, // Will be converted to ZAR trillions
          total_volume: 50000000000 / 18.5, // Will be converted to ZAR billions
        },
      ],
    });

    render(<Crypto {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/R.*T/)).toBeInTheDocument(); // Trillions
      expect(screen.getByText(/R.*B/)).toBeInTheDocument(); // Billions
    });
  });
});
