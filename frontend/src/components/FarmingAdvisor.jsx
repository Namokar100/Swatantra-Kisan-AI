// src/components/FarmingAdvisor.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const FarmingAdvisor = ({ temperature, humidity, moisture, recommendedCrop, npk }) => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const prompt = `
Based on the following conditions:
- Temperature: ${temperature} °C
- Humidity: ${humidity} %
- Soil Moisture: ${moisture} %
- Recommended Crop: ${recommendedCrop}
- NPK levels: Nitrogen=${npk.Nitrogen}, Phosphorous=${npk.Phosphorous}, Potassium=${npk.Potassium}

Suggest 5 helpful farming tips in bullet points(strictly 2 lines per point) for a farmer, including recommended fertilizers, crop care techniques, or soil management practices to enhance crop yield.
`;

  useEffect(() => {
    if (!recommendedCrop || !npk) return;

    const fetchAdvice = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No advice generated.';
        setAdvice(text);
      } catch (error) {
        console.error('Gemini API Error:', error);
        setAdvice('Failed to fetch recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [temperature, humidity, moisture, recommendedCrop, npk]);

  return (
    <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl shadow-inner">
      <h3 className="text-2xl font-semibold text-green-800 mb-4">🌾 Farming Recommendations</h3>
      {loading ? (
        <p className="text-gray-600">Fetching advice...</p>
      ) : (
        <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed">
          {advice
            .split('\n')
            .filter((tip) => tip.trim() !== '')
            .map((tip, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
        </ul>
      )}
    </div>
  );
  
};

export default FarmingAdvisor;
