// src/components/WeatherFetcher.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CropPredictor from './CropPredictor';

const WeatherFetcher = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  // Replace with your actual API key
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    // Automatically get user's location using the browser's Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);

        // Call OpenWeather API for 1-day forecast
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            const forecast = response.data.list[0]; // Get closest forecast
            const temperature = forecast.main.temp;
            const humidity = forecast.main.humidity;

            // Estimate soil moisture based on humidity heuristically (can be improved)
            const moisture = humidity >= 70 ? 45 : humidity >= 50 ? 35 : 25;
            
            console.log(`Temperature: ${temperature}, Humidity: ${humidity}, Moisture: ${moisture}`);

            setWeatherData({
              temperature,
              humidity,
              moisture,
            });
          })
          .catch((err) => {
            setError('Failed to fetch weather data');
            console.error(err);
          });
      },
      (err) => {
        setError('Geolocation permission denied');
        console.error(err);
      }
    );
  }, []);

  if (error) return <div>{error}</div>;

  if (!weatherData) return <div>Fetching weather data...</div>;

  return (
    <CropPredictor
      temperature={weatherData.temperature}
      humidity={weatherData.humidity}
      moisture={weatherData.moisture}
    />
  );
};

export default WeatherFetcher;
