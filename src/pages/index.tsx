import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import SearchBar from '@/components/SearchBar';
import WeatherDisplay from '@/components/WeatherDisplay';
import { useDebounce } from '@/hooks/useDebounce';
import { WeatherData, WeatherError, Coordinates } from '@/types/weather';
import toast from 'react-hot-toast';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('/images/default.jpg');
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Get user's location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error: GeolocationPositionError) => {
          console.warn('Geolocation access denied:', error.message);
          toast.error('Location access denied. Please search for a city manually.');
        }
      );
    } else {
      console.warn('Geolocation not supported');
      toast.error('Geolocation not supported. Please search for a city manually.');
    }
  }, []);

  // Fetch weather data based on debounced search query
  const {
    data: weatherData,
    isLoading,
    error,
    refetch
  } = useQuery<WeatherData, WeatherError>({
    queryKey: ['weather', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return null;
      
      const response = await fetch(`/api/weather?q=${encodeURIComponent(debouncedQuery)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }
      
      return response.json();
    },
    enabled: !!debouncedQuery.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error?.message?.includes('Rate limit') || error?.message?.includes('Invalid')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Update background based on weather conditions
  useEffect(() => {
    if (!weatherData) return;

    const temp = weatherData.current.temp_c;
    const condition = weatherData.current.condition.text.toLowerCase();

    let background = '/images/default.jpg';

    // Temperature-based backgrounds
    if (temp <= -5) {
      background = '/images/snowy.jpg';
    } else if (temp <= 10) {
      background = '/images/winter.jpg';
    } else if (temp > 10 && temp < 25) {
      background = '/images/cloudy.jpg';
    } else if (temp >= 25 && temp <= 35) {
      background = '/images/summer.jpg';
    } else if (temp > 35) {
      background = '/images/hot.jpg';
    }

    // Condition-based backgrounds (override temperature)
    if (condition.includes('rain')) {
      background = '/images/rainy.jpg';
    } else if (condition.includes('thunderstorm')) {
      background = '/images/thunderstorm.jpg';
    } else if (condition.includes('fog') || condition.includes('mist')) {
      background = '/images/foggy.jpg';
    }

    setBackgroundImage(background);
  }, [weatherData]);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }
      
      const data = await response.json();
      // Update the query cache with coordinates-based data
      setSearchQuery(`${data.location.name}, ${data.location.country}`);
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      toast.error('Failed to get weather for your location');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRetry = () => {
    if (debouncedQuery) {
      refetch();
    } else {
      // Retry geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
          }
        );
      }
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-image 1s ease-in-out',
        color: 'white',
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <header className="app-header">
        <h1 className="app-title">Weather App</h1>
        <p className="app-subtitle">Get real-time weather information</p>
      </header>

      <main className="app-main">
        <SearchBar 
          onSearch={handleSearch} 
          isLoading={isLoading}
        />
        
        <WeatherDisplay 
          weather={weatherData || null}
          isLoading={isLoading}
          error={error?.message}
        />
      </main>

      <footer className="app-footer">
        <p className="footer-text">
          Powered by OpenWeatherMap API
        </p>
      </footer>
    </div>
  );
}
