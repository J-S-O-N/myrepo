const express = require('express');
const router = express.Router();

/**
 * GET /api/stocks/jse
 * Fetch JSE stock data from Yahoo Finance API
 * Acts as a proxy to avoid CORS and rate limiting issues
 */
router.get('/jse', async (req, res) => {
  try {
    // JSE stocks use .JO suffix (Johannesburg Stock Exchange)
    const stockSymbols = ['SBK.JO', 'FSR.JO', 'NED.JO', 'CPI.JO', 'ABG.JO'];
    const stockNames = {
      'SBK.JO': 'Standard Bank Group Ltd',
      'FSR.JO': 'FirstRand Ltd',
      'NED.JO': 'Nedbank Group Ltd',
      'CPI.JO': 'Capitec Bank Holdings Ltd',
      'ABG.JO': 'Absa Group Ltd'
    };

    // Fetch data for all stocks in parallel
    const promises = stockSymbols.map(async (symbol) => {
      try {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          console.error(`Failed to fetch ${symbol}: ${response.status}`);
          return null;
        }

        const data = await response.json();
        const quote = data.chart.result[0];
        const meta = quote.meta;
        const indicators = quote.indicators.quote[0];

        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose || meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        // JSE stocks are already in cents (ZAc currency), no need to multiply
        return {
          symbol: symbol.replace('.JO', ''),
          name: stockNames[symbol],
          exchange: 'JSE',
          price: Math.round(currentPrice),
          change: Math.round(change),
          changePercent: changePercent,
          open: Math.round(indicators.open[0] || currentPrice),
          high: Math.round(indicators.high[0] || currentPrice),
          low: Math.round(indicators.low[0] || currentPrice),
          volume: indicators.volume[0] || 0,
          marketCap: meta.marketCap || 0,
          pe: meta.trailingPE || 0,
          dividendYield: (meta.dividendYield || 0) * 100,
          icon: '🏦'
        };
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validStocks = results.filter(stock => stock !== null);

    if (validStocks.length === 0) {
      // Return fallback data if all API calls fail
      return res.json({
        success: true,
        fallback: true,
        data: [
          { symbol: 'SBK', name: 'Standard Bank Group Ltd', exchange: 'JSE', price: 29500, change: -84, changePercent: -0.28, open: 29584, high: 29658, low: 29312, volume: 155824, marketCap: 285000000000, pe: 8.45, dividendYield: 5.2, icon: '🏦' },
          { symbol: 'FSR', name: 'FirstRand Ltd', exchange: 'JSE', price: 7850, change: 45, changePercent: 0.58, open: 7805, high: 7890, low: 7780, volume: 3890456, marketCap: 368000000000, pe: 7.89, dividendYield: 5.8, icon: '🏦' },
          { symbol: 'NED', name: 'Nedbank Group Ltd', exchange: 'JSE', price: 22100, change: 120, changePercent: 0.55, open: 21980, high: 22150, low: 21900, volume: 1234567, marketCap: 83000000000, pe: 6.23, dividendYield: 6.5, icon: '🏦' },
          { symbol: 'CPI', name: 'Capitec Bank Holdings Ltd', exchange: 'JSE', price: 178900, change: 1250, changePercent: 0.70, open: 177650, high: 179500, low: 177200, volume: 456789, marketCap: 378000000000, pe: 18.45, dividendYield: 2.1, icon: '🏦' },
          { symbol: 'ABG', name: 'Absa Group Ltd', exchange: 'JSE', price: 18900, change: 78, changePercent: 0.41, open: 18822, high: 18950, low: 18750, volume: 2789456, marketCap: 125000000000, pe: 7.65, dividendYield: 5.9, icon: '🏦' }
        ]
      });
    }

    res.json({
      success: true,
      fallback: false,
      data: validStocks
    });

  } catch (error) {
    console.error('Error in stocks API:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock data',
      message: error.message
    });
  }
});

module.exports = router;
