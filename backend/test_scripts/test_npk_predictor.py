import joblib
import pandas as pd

# Load models
model = joblib.load('/mnt/e/VAPT projects/2505/soil-npk-crop-predictor/models/npk_predictor_model.pkl')
preprocessor = joblib.load('/mnt/e/VAPT projects/2505/soil-npk-crop-predictor/models/preprocessor.pkl')

# Sample input
input_data = pd.DataFrame([{
    'Temparature': 30,
    'Humidity': 45,
    'Moisture': 42,
    'Soil Type': 'Red'
}])

# Preprocess
transformed = preprocessor.transform(input_data)

# Predict
npk = model.predict(transformed)[0]
print(f"NPK prediction:\n  Nitrogen: {round(npk[0])}\n  Phosphorous: {round(npk[1])}\n  Potassium: {round(npk[2])}")
