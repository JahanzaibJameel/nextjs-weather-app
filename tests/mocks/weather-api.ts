import { http } from 'msw';

// Mock weather API data
const mockWeatherData = {
  location: {
    name: 'London',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278,
  },
  current: {
    temp_c: 22,
    temp_f: 72,
    condition: {
      text: 'Partly cloudy',
      icon: '02d',
    },
    humidity: 65,
    pressure_mb: 1013,
    wind_kph: 15,
    vis_km: 10,
    uv: 5,
  },
};

export const weatherApiMocks = () => [
  http.get('https://api.openweathermap.org/data/2.5/weather', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    
    if (q === 'london') {
      return Response.json(mockWeatherData, { status: 200 });
    }
    
    if (q === 'error') {
      return Response.json(
        { message: 'City not found' },
        { status: 404 }
      );
    }
    
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }),
  
  http.get('https://api.openweathermap.org/data/2.5/forecast', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    
    if (q === 'london') {
      return Response.json({
        list: Array.from({ length: 40 }, (_, i) => ({
          dt: Date.now() / 1000 + i * 3 * 3600,
          main: { temp: 22, humidity: 65, pressure: 1013 },
          weather: [{ description: 'Partly cloudy', icon: '02d' }],
          wind: { speed: 4.2 },
          visibility: 10000,
          pop: 0.1,
        })),
        city: {
          name: 'London',
          country: 'GB',
          coord: { lat: 51.5074, lon: -0.1278 },
        },
      }, { status: 200 });
    }
    
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }),
];
