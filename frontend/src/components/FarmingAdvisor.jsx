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

Suggest 5 helpful farming tips in bullet points for a farmer, including recommended fertilizers, crop care techniques, or soil management practices to enhance crop yield.
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
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h3>Farming Recommendations</h3>
      {loading ? <p>Fetching advice...</p> : <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>') }} />}
    </div>
  );
};

export default FarmingAdvisor;
