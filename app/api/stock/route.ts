import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Using Alpha Vantage API for stock data
    // You can get a free API key from: https://www.alphavantage.co/
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    const symbol = 'GOOGL';
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const data = await response.json();

    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return NextResponse.json({
        symbol: quote['01. symbol'] || symbol,
        price: quote['05. price'] || 'N/A',
        change: quote['09. change'] || 'N/A',
        changePercent: quote['10. change percent'] || 'N/A',
        timestamp: new Date().toISOString(),
      });
    } else {
      // Fallback mock data if API limit reached
      return NextResponse.json({
        symbol: 'GOOGL',
        price: '155.30',
        change: '+2.50',
        changePercent: '+1.64%',
        timestamp: new Date().toISOString(),
        mock: true,
      });
    }
  } catch (error) {
    console.error('Stock API error:', error);
    
    // Return mock data on error
    return NextResponse.json({
      symbol: 'GOOGL',
      price: '155.30',
      change: '+2.50',
      changePercent: '+1.64%',
      timestamp: new Date().toISOString(),
      mock: true,
      error: 'Using mock data',
    });
  }
}
