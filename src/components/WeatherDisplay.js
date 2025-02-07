export default function WeatherDisplay({ weather }) {
  if (!weather) return null;

  const { name, sys, main, weather: weatherData, wind, visibility } = weather;
  const { temp, humidity, pressure } = main;
  const { speed: windSpeed } = wind;
  const { country } = sys;
  const { description, icon } = weatherData[0];

  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

  return (
    <div className="weather-container">
      <h2 className="location">{name}, {country}</h2>
      <p className="weather-description">{description}</p>
      <h3 className="temperature">{temp}°C</h3>

      <div className="weather-stats">
        <p className="humidity">
          Humidity <span>{humidity}%</span>
        </p>
        <p className="wind-speed">
          Wind Speed <span>{windSpeed} m/s</span>
        </p>
        <p className="pressure">
          Pressure <span>{pressure} hPa</span>
        </p>
        <p className="visibility">
          Visibility <span>{(visibility / 1000).toFixed(2)} km</span>
        </p>
        <p className="time">
          Time <span>{time}</span>
        </p>
        <p className="sunrise">
          Sunrise <span>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</span>
        </p>
        <p className="sunset">
          Sunset <span>{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
}
