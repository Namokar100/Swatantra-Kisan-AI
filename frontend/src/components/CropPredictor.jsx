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
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem' }}>
      <h2>Crop Recommendation</h2>

      <div style={{ marginBottom: '1rem' }}>
        <p><strong>Temperature:</strong> {temperature} °C</p>
        <p><strong>Humidity:</strong> {humidity} %</p>
        <p><strong>Estimated Moisture:</strong> {moisture} %</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          required
        />
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Predicting...' : 'Predict Crop'}
        </button>
      </form>

      {result && (
        <>
            <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
            <h3>Prediction Result</h3>
            <p><strong>Soil Type:</strong> {result.soil_type}</p>
            <p><strong>NPK:</strong> N: {result.npk.Nitrogen}, P: {result.npk.Phosphorous}, K: {result.npk.Potassium}</p>
            <p><strong>Recommended Crop:</strong> {result.recommended_crop}</p>
            <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
            </div>

            <FarmingAdvisor
            temperature={temperature}
            humidity={humidity}
            moisture={moisture}
            recommendedCrop={result.recommended_crop}
            npk={result.npk}
            />
        </>
        )}

    </div>
  );
};

export default CropPredictor;
