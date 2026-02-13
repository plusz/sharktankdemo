// Simple in-memory cache for stock data
// Works in both development and production (Vercel)

interface CachedData {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const cache = new Map<string, CachedData>();

export function getFromCache(key: string): any | null {
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  const now = Date.now();
  const isExpired = now - cached.timestamp > cached.ttl;

  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

export function setInCache(key: string, data: any, ttlSeconds: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlSeconds * 1000,
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
