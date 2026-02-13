'use client';

import { useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  timestamp: string;
  mock?: boolean;
  cached?: boolean;
  source?: string;
}

export default function Dashboard() {
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stock');
        if (!response.ok) throw new Error('Failed to fetch stock price');
        const data = await response.json();
        setStock(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Set fallback data
        setStock({
          symbol: 'GOOGL',
          price: '155.30',
          change: '+2.50',
          changePercent: '+1.64%',
          timestamp: new Date().toISOString(),
          mock: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
    // Refresh every 60 seconds
    const interval = setInterval(fetchStock, 60000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = stock?.change?.startsWith('+');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-12">
          <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 mb-4">
            SHARK TANK DEMO
          </h2>
          <div className="h-1 w-48 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
        </div>

        {/* Stock Card */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-shadow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stock Header */}
              <div className="border-b border-slate-600 pb-6">
                <p className="text-slate-400 text-lg mb-2">Stock Symbol</p>
                <h3 className="text-5xl font-bold text-white">{stock?.symbol}</h3>
              </div>

              {/* Price Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Current Price */}
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-700/30 rounded-lg p-6">
                  <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-2">
                    Current Price
                  </p>
                  <p className="text-4xl font-bold text-white">${stock?.price}</p>
                </div>

                {/* Change */}
                <div
                  className={`bg-gradient-to-br border rounded-lg p-6 ${
                    isPositive
                      ? 'from-green-900/30 to-green-800/10 border-green-700/30'
                      : 'from-red-900/30 to-red-800/10 border-red-700/30'
                  }`}
                >
                  <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                    Change
                  </p>
                  <div className="flex items-end gap-4">
                    <p className={`text-4xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock?.change}
                    </p>
                    <p className={`text-2xl font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock?.changePercent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="pt-4 border-t border-slate-600">
                <p className="text-slate-400 text-sm">
                  Last updated:{' '}
                  <span className="text-cyan-400 font-mono">
                    {stock?.timestamp ? new Date(stock.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </p>
                <div className="flex gap-3 mt-2 text-xs">
                  {stock?.source && (
                    <span className="text-slate-500">
                      Source: <span className="text-slate-400">{stock.source}</span>
                    </span>
                  )}
                  {stock?.cached && (
                    <span className="text-blue-400">✓ Cached (60s TTL)</span>
                  )}
                </div>
                {stock?.mock && (
                  <p className="text-amber-400 text-sm mt-2">
                    ℹ️ Using demonstration data
                  </p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold mb-2">API Status</p>
            <p className="text-green-400 font-mono">● Live</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold mb-2">Ticker</p>
            <p className="text-cyan-400 font-mono">GOOGL (Google/Alphabet Inc.)</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <p className="text-slate-400 text-sm font-semibold mb-2">Update Interval</p>
            <p className="text-blue-400 font-mono">Every 60 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
