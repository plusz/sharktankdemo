import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symbol = 'GOOGL';
    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

    // If no API key, try public endpoints or return helpful message
    if (!FINNHUB_API_KEY) {
      console.warn('FINNHUB_API_KEY not set. Please add it to .env.local');
      return fetchStockWithYahooFinance(symbol);
    }

    // Use Finnhub API (faster and more reliable)
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    );

    if (!response.ok) {
      throw new Error('Finnhub API error');
    }

    const data = await response.json();

    if (data.c !== undefined) {
      const previousClose = data.pc || 0;
      const currentPrice = data.c;
      const change = (currentPrice - previousClose).toFixed(2);
      const changePercent = (
        ((currentPrice - previousClose) / previousClose) * 100
      ).toFixed(2);

      return NextResponse.json({
        symbol: symbol,
        price: currentPrice.toFixed(2),
        change: parseFloat(change) >= 0 ? `+${change}` : change,
        changePercent: parseFloat(changePercent) >= 0 ? `+${changePercent}%` : `${changePercent}%`,
        timestamp: new Date().toISOString(),
        source: 'Finnhub',
      });
    } else {
      throw new Error('Invalid response from Finnhub');
    }
  } catch (error) {
    console.error('Stock API error:', error);
    return fetchStockWithYahooFinance('GOOGL');
  }
}

// Fallback: Try fetching from public JSON API (finnhub alternative)
async function fetchStockWithYahooFinance(symbol: string) {
  try {
    // Using a free public API alternative
    const response = await fetch(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 60 },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const price = data.quoteSummary?.result?.[0]?.price;

      if (price) {
        return NextResponse.json({
          symbol: symbol,
          price: price.regularMarketPrice?.raw?.toFixed(2) || 'N/A',
          change: `${(price.regularMarketChange?.raw || 0).toFixed(2)}`,
          changePercent: `${(price.regularMarketChangePercent?.raw || 0).toFixed(2)}%`,
          timestamp: new Date().toISOString(),
          source: 'Yahoo Finance',
        });
      }
    }
  } catch (e) {
    console.error('Yahoo Finance fallback error:', e);
  }

  // Final fallback: mock data
  return NextResponse.json({
    symbol: 'GOOGL',
    price: '155.30',
    change: '+2.50',
    changePercent: '+1.64%',
    timestamp: new Date().toISOString(),
    source: 'Demo Data',
    mock: true,
  });
}
