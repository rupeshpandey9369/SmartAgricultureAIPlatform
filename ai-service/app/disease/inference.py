"""
Disease detection inference.

Uses a real trained EfficientNetB0 model (disease_model.h5) fine-tuned
on the PlantVillage dataset (Pepper, Potato, Tomato - 15 classes).
"""

import io
import os
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input

from app.disease.disease_info import CLASS_NAMES, get_disease_info

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "disease_model.h5")

print(f"Loading disease detection model from {MODEL_PATH} ...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully.")

IMG_SIZE = (224, 224)


def _real_predict(image: Image.Image) -> tuple[str, float]:
    img = image.resize(IMG_SIZE).convert("RGB")
    arr = np.array(img).astype("float32")
    arr = preprocess_input(arr)  # match training preprocessing exactly
    arr = np.expand_dims(arr, axis=0)

    preds = model.predict(arr, verbose=0)[0]
    idx = int(np.argmax(preds))
    confidence = float(preds[idx])

    return CLASS_NAMES[idx], confidence


def predict_disease(image_bytes: bytes) -> dict:
    """
    Main entrypoint. Takes raw image bytes, returns prediction + disease info.
    """
    image = Image.open(io.BytesIO(image_bytes))

    class_name, confidence = _real_predict(image)
    info = get_disease_info(class_name)

    return {
        "predicted_class": class_name,
        "confidence": round(confidence, 4),
        "disease_name": info["disease_name"],
        "symptoms": info["symptoms"],
        "treatment": info["treatment"],
        "prevention": info["prevention"],
        "model_status": "trained_model"
    }
