import { setupServer } from 'msw/node';
import { http } from 'msw';
import { weatherApiMocks } from '../mocks/weather-api';
import { env } from '@/lib/env';

// Setup MSW server for API testing
const server = setupServer(...weatherApiMocks());

beforeAll(() => {
  // Start the server before all tests
  server.listen({
    onUnhandledRequest: 'warn',
  });
});

afterAll(() => {
  // Clean up after all tests
  server.close();
});

describe('Weather API Integration Tests', () => {
  beforeEach(() => {
    // Reset any request handlers if needed
  server.resetHandlers();
  });

  test('should return weather data for valid city query', async () => {
    const response = await fetch('http://localhost:3000/api/weather?q=London');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('location');
    expect(data.location.name).toBe('London');
    expect(data).toHaveProperty('current');
    expect(data.current.temp_c).toBeGreaterThan(-50);
    expect(data.current.temp_c).toBeLessThan(60);
  });

  test('should handle coordinates query', async () => {
    const response = await fetch('http://localhost:3000/api/weather?lat=51.5074&lon=-0.1278');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.location.lat).toBeCloseTo(51.5074, 2);
    expect(data.location.lon).toBeCloseTo(-0.1278, 2);
  });

  test('should validate input parameters', async () => {
    // Test empty query
    const emptyResponse = await fetch('http://localhost:3000/api/weather?q=');
    expect(emptyResponse.status).toBe(400);

    // Test query too long
    const longResponse = await fetch('http://localhost:3000/api/weather?q=' + 'a'.repeat(101));
    expect(longResponse.status).toBe(400);
  });

  test('should handle rate limiting', async () => {
    // Make 11 requests to trigger rate limit (10 allowed + 1 buffer)
    const promises = Array.from({ length: 11 }, (_, i) =>
      fetch(`http://localhost:3000/api/weather?q=test${i}`)
    );

    const results = await Promise.allSettled(promises);
    const successCount = results.filter((r: any) => r.status === 'fulfilled' && r.value.status === 200).length;
    const rateLimitedCount = results.filter((r: any) => r.status === 'fulfilled' && r.value.status === 429).length;

    expect(successCount).toBeLessThanOrEqual(10);
    expect(rateLimitedCount).toBeGreaterThanOrEqual(1);
  });

  test('should handle missing API key', async () => {
    // Temporarily unset API key for testing
    const originalApiKey = env.WEATHER_API_KEY;
    process.env.WEATHER_API_KEY = '';
    
    const response = await fetch('http://localhost:3000/api/weather?q=London');
    
    expect(response.status).toBe(500);
    
    // Restore API key
    process.env.WEATHER_API_KEY = originalApiKey;
  });

  test('should handle external API errors', async () => {
    // Mock external API failure
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', () => {
        return new Response('Failed to connect', { status: 503 });
      })
    );

    const response = await fetch('http://localhost:3000/api/weather?q=London');
    
    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.error).toBe('Weather API error');
  });

  test('should set appropriate cache headers', async () => {
    const response = await fetch('http://localhost:3000/api/weather?q=London');
    
    expect(response.headers.get('cache-control')).toBe('s-maxage=300, stale-while-revalidate=150');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('access-control-allow-methods')).toBe('GET');
  });

  test('should handle non-GET requests', async () => {
    const response = await fetch('http://localhost:3000/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(405);
    const data = await response.json();
    expect(data.error).toBe('Method not allowed');
  });
});
