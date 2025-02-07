import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import WeatherDisplay from "../components/WeatherDisplay";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [background, setBackground] = useState("/images/default.jpg");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    if (!weather) return;

    const weatherCondition = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;

    if (temp <= -5) {
      setBackground("/images/snowy.jpg");
    } else if (temp <= 10) {
      setBackground("/images/winter.jpg");
    } else if (temp > 10 && temp < 25) {
      setBackground("/images/cloudy.jpg");
    } else if (temp >= 25 && temp <= 35) {
      setBackground("/images/summer.jpg");
    } else if (temp > 35) {
      setBackground("/images/hot.jpg");
    } else if (weatherCondition.includes("rain")) {
      setBackground("/images/rainy.jpg");
    } else if (weatherCondition.includes("thunderstorm")) {
      setBackground("/images/thunderstorm.jpg");
    } else if (weatherCondition.includes("fog") || weatherCondition.includes("mist")) {
      setBackground("/images/foggy.jpg");
    } else {
      setBackground("/images/default.jpg");
    }
  }, [weather]);

  const fetchWeather = async (query) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (error) {
      alert("Invalid city or country!");
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching location weather:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "background 1s ease-in-out",
        color: "white",
      }}
    >
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "48px", fontWeight: "700", textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)", marginBottom: "20px" }}>
        Weather App
      </h1>
      <SearchBar onSearch={fetchWeather} />
      <WeatherDisplay weather={weather} />
    </div>
  );
}
