import pickle
import numpy as np

# Load the saved model and scaler
with open('../models/crop_recommendation_model.pkl', 'rb') as f:
    model_data = pickle.load(f)

model = model_data['model']
scaler = model_data['scaler']
features = model_data['features']

def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    """
    Predict crop recommendation based on input parameters
    """
    # Prepare input data
    input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    input_scaled = scaler.transform(input_data)
    
    # Make prediction
    prediction = model.predict(input_scaled)[0]
    probability = model.predict_proba(input_scaled)[0].max()
    
    return prediction, probability

# Example test case
if __name__ == "__main__":
    # Input parameters for testing
    N = 90
    P = 42
    K = 43
    temperature = 20.88
    humidity = 82.00
    ph = 6.50
    rainfall = 202.94

    # Predict crop
    predicted_crop, confidence = predict_crop(N, P, K, temperature, humidity, ph, rainfall)
    
    print("\nTest Crop Predictor")
    print("="*50)
    print(f"Input Parameters: N={N}, P={P}, K={K}, Temperature={temperature}, Humidity={humidity}, pH={ph}, Rainfall={rainfall}")
    print(f"Predicted Crop: {predicted_crop}")
    print(f"Confidence: {confidence:.4f}")