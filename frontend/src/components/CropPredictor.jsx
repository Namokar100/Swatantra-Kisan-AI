// src/components/CropPredictor.jsx
import { useState } from 'react';
import axios from 'axios';
import FarmingAdvisor from './FarmingAdvisor';

const CropPredictor = ({ temperature, humidity, moisture }) => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('temperature', temperature);
    formData.append('humidity', humidity);
    formData.append('moisture', moisture);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/predict-crop/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error('Prediction Error:', error);
      alert('Something went wrong during prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-lime-200 text-gray-800 px-6 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-10 text-green-700 text-center drop-shadow-sm">
          🌿 Crop Recommendation
        </h2>

        <div className="mb-6 text-gray-700 space-y-1">
          <p><strong>🌡 Temperature:</strong> {temperature} °C</p>
          <p><strong>💧 Humidity:</strong> {humidity} %</p>
          <p><strong>🌱 Estimated Moisture:</strong> {moisture} %</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            required
            className="bg-green-50 border border-green-300 text-sm rounded-lg block w-50.5 p-2.5 focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? 'Predicting...' : '🌾 Get Crop Recommendation'}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 shadow-inner space-y-2">
            <h3 className="text-xl font-semibold text-green-800">🧪 Prediction Result</h3>
            <p><strong>Soil Type:</strong> {result.soil_type}</p>
            <p><strong>NPK:</strong> N: {result.npk.Nitrogen}, P: {result.npk.Phosphorous}, K: {result.npk.Potassium}</p>
            <p><strong>Recommended Crop:</strong> {result.recommended_crop}</p>
            {/* <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p> */}
          </div>
        )}

        {result && (
          <div className="mt-6">
            <FarmingAdvisor
              temperature={temperature}
              humidity={humidity}
              moisture={moisture}
              recommendedCrop={result.recommended_crop}
              npk={result.npk}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPredictor;
