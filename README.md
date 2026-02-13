# Shark Tank Demo - Next.js Stock Dashboard

A modern Next.js dashboard displaying Google (GOOGL) stock price with real-time updates.

## Features

- **Real-time Stock Data**: Displays current Google stock price with change metrics
- **API Integration**: Custom Next.js API route for fetching stock data
- **Auto-refresh**: Updates stock price every 60 seconds
- **Modern UI**: Beautiful gradient design with dark theme using Tailwind CSS
- **Responsive**: Works seamlessly on desktop and mobile devices

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables (Optional)

For live stock data, get a free API key from [Alpha Vantage](https://www.alphavantage.co/):

Create a `.env.local` file:
```
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

Without an API key, the app uses demonstration data.

## Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
app/
├── api/
│   └── stock/
│       └── route.ts          # API endpoint for stock data
├── components/
│   └── Dashboard.tsx         # Main dashboard component
├── page.tsx                  # Home page
├── layout.tsx                # Root layout
└── globals.css               # Global styles
```

## API Endpoint

### GET /api/stock

Returns current Google stock price data:

```json
{
  "symbol": "GOOGL",
  "price": "155.30",
  "change": "+2.50",
  "changePercent": "+1.64%",
  "timestamp": "2026-02-13T10:00:00Z",
  "mock": false
}
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Alpha Vantage API** - Stock data provider

## Deployment

Deploy to Vercel:

```bash
npm run build
npm run start
```
