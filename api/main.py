from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import UnidentifiedImageError

from .model import load_model
from .preprocessing import preprocess_image

from fastapi.middleware.cors import CORSMiddleware

import torch


app = FastAPI(
    title="Digit Vision API",
    description="API for handwritten digit classification using a PyTorch CNN.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model()


@app.get("/")
def root():
    return {
        "message": "Digit Vision API is running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    try:
        input_tensor = preprocess_image(image_bytes)
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image.",
        )

    with torch.no_grad():
        outputs = model(input_tensor)

    prediction = outputs.argmax(dim=1).item()

    probabilities = torch.softmax(outputs, dim=1)
    confidence = probabilities[0, prediction].item()

    return {
        "prediction": prediction,
        "confidence": confidence,
    }