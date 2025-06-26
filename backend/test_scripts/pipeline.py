import tensorflow as tf
import numpy as np
import pandas as pd
import joblib
import pickle
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# ====== Load All Models ======
# Paths to models
SOIL_MODEL_PATH = 'models/soil_classifier_model.keras'
NPK_MODEL_PATH = 'models/npk_predictor_model.pkl'
PREPROCESSOR_PATH = 'models/preprocessor.pkl'
CROP_MODEL_PATH = 'models/crop_recommendation_model.pkl'

# Load models
soil_model = tf.keras.models.load_model(SOIL_MODEL_PATH)
npk_model = joblib.load(NPK_MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)
with open(CROP_MODEL_PATH, 'rb') as f:
    crop_model_data = pickle.load(f)

crop_model = crop_model_data['model']
crop_scaler = crop_model_data['scaler']

# Define soil class labels
SOIL_CLASSES = ['Alluvial', 'Black', 'Clay', 'Laterite', 'Red', 'Sandy']


# ====== Soil Classification ======
def classify_soil(image_path):
    img_size = (224, 224)
    image = load_img(image_path, target_size=img_size)
    img_array = img_to_array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    pred = soil_model.predict(img_array)
    class_index = np.argmax(pred)
    return SOIL_CLASSES[class_index]


# ====== NPK Prediction ======
def predict_npk(temperature, humidity, moisture, soil_type):
    input_df = pd.DataFrame([{
        'Temparature': temperature,
        'Humidity': humidity,
        'Moisture': moisture,
        'Soil Type': soil_type
    }])
    transformed = preprocessor.transform(input_df)
    prediction = npk_model.predict(transformed)[0]
    return {
        'Nitrogen': round(prediction[0]),
        'Phosphorous': round(prediction[1]),
        'Potassium': round(prediction[2])
    }


# ====== Crop Recommendation ======
def recommend_crop(N, P, K, temperature, humidity, ph, rainfall):
    input_df = pd.DataFrame([{
        'N': N,
        'P': P,
        'K': K,
        'temperature': temperature,
        'humidity': humidity,
        'ph': ph,
        'rainfall': rainfall
    }])
    input_scaled = crop_scaler.transform(input_df)
    crop = crop_model.predict(input_scaled)[0]
    confidence = crop_model.predict_proba(input_scaled)[0].max()
    return crop, confidence



# ====== Full Pipeline Execution ======
def run_pipeline(image_path, temperature, humidity, moisture, ph, rainfall):
    print("Step 1: Classifying Soil...")
    soil_type = classify_soil(image_path)
    print(f"✅ Predicted Soil Type: {soil_type}")

    print("\nStep 2: Predicting NPK Values...")
    npk = predict_npk(temperature, humidity, moisture, soil_type)
    print(f"✅ Predicted NPK: {npk}")

    print("\nStep 3: Recommending Crop...")
    crop, confidence = recommend_crop(
        N=npk['Nitrogen'],
        P=npk['Phosphorous'],
        K=npk['Potassium'],
        temperature=temperature,
        humidity=humidity,
        ph=ph,
        rainfall=rainfall
    )
    print(f"✅ Recommended Crop: {crop} (Confidence: {confidence:.4f})")

    return {
        'Soil Type': soil_type,
        'NPK': npk,
        'Recommended Crop': crop,
        'Confidence': confidence
    }


# ====== Example Test Run ======
if __name__ == "__main__":
    # Sample Inputs
    IMAGE_PATH = 'images/Black1.jpg'  # Change this to the actual test image
    TEMP = 26
    HUMIDITY = 66
    MOISTURE = 35
    PH = 6.2
    RAINFALL = 300.0

    result = run_pipeline(IMAGE_PATH, TEMP, HUMIDITY, MOISTURE, PH, RAINFALL)
