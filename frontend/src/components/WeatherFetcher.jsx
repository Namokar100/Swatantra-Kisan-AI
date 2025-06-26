// src/components/WeatherFetcher.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CropPredictor from './CropPredictor';

const WeatherFetcher = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            const forecast = response.data.list[0];
            const temperature = forecast.main.temp;
            const humidity = forecast.main.humidity;
            const moisture = humidity >= 70 ? 45 : humidity >= 50 ? 35 : 25;

            setWeatherData({ temperature, humidity, moisture });
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 text-red-600 text-lg font-semibold px-4">
        {error}
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 text-green-900">
        <div className="text-2xl font-bold mb-4 animate-pulse">Fetching weather data...</div>
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <CropPredictor
      temperature={weatherData.temperature}
      humidity={weatherData.humidity}
      moisture={weatherData.moisture}
    />
  );
};

export default WeatherFetcher;
