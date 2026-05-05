import { WeatherData } from '@/types/weather';

interface WeatherDisplayProps {
  weather: WeatherData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function WeatherDisplay({ weather, isLoading, error }: WeatherDisplayProps) {
  if (isLoading) {
    return (
      <div className="weather-container" aria-live="polite" aria-busy="true">
        <div className="skeleton-loader">
          <div className="skeleton-header"></div>
          <div className="skeleton-temp"></div>
          <div className="skeleton-stats"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-container error-container" role="alert">
        <h2 className="error-title">Weather Data Unavailable</h2>
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
          aria-label="Retry loading weather data"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-container empty-state">
        <h2 className="empty-title">No Weather Data</h2>
        <p className="empty-message">Search for a city to see weather information</p>
      </div>
    );
  }

  const { location, current } = weather;
  const date = new Date();
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="weather-container" aria-live="polite">
      <header>
        <h2 className="location">
          {location.name}, {location.country}
        </h2>
        <p className="weather-description">
          {current.condition.text}
        </p>
      </header>
      
      <main>
        <div className="temperature-section">
          <h3 className="temperature">
            {current.temp_c}°C
          </h3>
          <span className="temperature-fahrenheit">
            ({current.temp_f}°F)
          </span>
        </div>

        <section className="weather-stats" aria-label="Weather statistics">
          <div className="stat-item humidity">
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{current.humidity}%</span>
          </div>
          <div className="stat-item wind-speed">
            <span className="stat-label">Wind Speed</span>
            <span className="stat-value">{current.wind_kph} km/h</span>
          </div>
          <div className="stat-item pressure">
            <span className="stat-label">Pressure</span>
            <span className="stat-value">{current.pressure_mb} hPa</span>
          </div>
          <div className="stat-item visibility">
            <span className="stat-label">Visibility</span>
            <span className="stat-value">{current.vis_km} km</span>
          </div>
          <div className="stat-item uv-index">
            <span className="stat-label">UV Index</span>
            <span className="stat-value">{current.uv}</span>
          </div>
          <div className="stat-item time">
            <span className="stat-label">Local Time</span>
            <span className="stat-value">{time}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
