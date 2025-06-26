// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 text-gray-800 px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4 text-green-800 drop-shadow-lg">
          Smart Crop & Fertilizer Advisor 🌱
        </h1>
        <p className="text-lg mb-8 text-gray-700">
          Empower your farming decisions with AI! Get personalized crop and fertilizer recommendations based on real-time weather data and soil conditions.
        </p>
        <Link
          to="/predict"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 shadow-lg"
        >
          🌾 Predict Now
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
