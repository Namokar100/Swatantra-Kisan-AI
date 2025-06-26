from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
from test_scripts.pipeline import classify_soil, predict_npk, recommend_crop

app = FastAPI()

# Allow CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict-crop/")
async def predict_crop(
    image: UploadFile = File(...),
    temperature: float = Form(...),
    humidity: float = Form(...),
    moisture: float = Form(...)
):
    # Save uploaded image temporarily
    image_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        # Step 1: Soil classification
        soil_type = classify_soil(image_path)

        # Step 2: Predict NPK from user input and soil type
        npk = predict_npk(temperature, humidity, moisture, soil_type)

        # Step 3: Crop recommendation (ph and rainfall defaulted)
        DEFAULT_PH = 6.5
        DEFAULT_RAINFALL = 200.0

        crop, confidence = recommend_crop(
            N=npk["Nitrogen"],
            P=npk["Phosphorous"],
            K=npk["Potassium"],
            temperature=temperature,
            humidity=humidity,
            ph=DEFAULT_PH,
            rainfall=DEFAULT_RAINFALL
        )

        # Return result
        return JSONResponse({
            "soil_type": soil_type,
            "npk": npk,
            "recommended_crop": crop,
            "confidence": round(confidence, 4)
        })

    finally:
        # Clean up image file
        if os.path.exists(image_path):
            os.remove(image_path)
