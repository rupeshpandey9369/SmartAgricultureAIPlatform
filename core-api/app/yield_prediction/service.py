"""
Yield prediction service using a trained Random Forest model.
Model was trained on FAO crop yield dataset with features:
Area (country), Item (crop), Year, Rainfall, Pesticides, Temperature
"""

import os
import pickle
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "yield_model.pkl")

model_data = None
model = None
le_area = None
le_item = None
SUPPORTED_CROPS = ["Wheat", "Rice", "Maize", "Potato", "Tomato",
                   "Soybean", "Cotton", "Sugarcane", "Groundnut", "Yams"]
SUPPORTED_AREAS = ["India"]


def _load_model():
    global model_data, model, le_area, le_item, SUPPORTED_CROPS, SUPPORTED_AREAS
    if model is not None:
        return True
    if not os.path.exists(MODEL_PATH):
        return False
    print(f"Loading yield prediction model from {MODEL_PATH} ...")
    with open(MODEL_PATH, "rb") as f:
        model_data = pickle.load(f)
    model = model_data["model"]
    le_area = model_data["le_area"]
    le_item = model_data["le_item"]
    SUPPORTED_CROPS = model_data["crops"]
    SUPPORTED_AREAS = model_data["areas"]
    print("Yield model loaded.")
    return True


def predict_yield(crop: str, area: str, year: int,
                  rainfall_mm: float, pesticides_tonnes: float, avg_temp: float) -> dict:
    if not _load_model():
        raise ValueError("Yield prediction model not available on this deployment.")

    matched_crop = next(
        (c for c in SUPPORTED_CROPS if c.lower() == crop.strip().lower()), None
    )
    if not matched_crop:
        raise ValueError(f"Crop '{crop}' not supported. Supported: {SUPPORTED_CROPS}")

    matched_area = next(
        (a for a in SUPPORTED_AREAS if a.lower() == area.strip().lower()), None
    )
    if not matched_area:
        matched_area = "India" if "India" in SUPPORTED_AREAS else SUPPORTED_AREAS[0]

    area_encoded = le_area.transform([matched_area])[0]
    item_encoded = le_item.transform([matched_crop])[0]

    features = np.array([[area_encoded, item_encoded, year,
                          rainfall_mm, pesticides_tonnes, avg_temp]])

    tree_predictions = np.array([
        tree.predict(features)[0] for tree in model.estimators_
    ])

    predicted_hg_ha = float(np.mean(tree_predictions))
    std_dev = float(np.std(tree_predictions))
    predicted_kg_ha = predicted_hg_ha / 100
    predicted_tonnes_acre = predicted_kg_ha * 0.404686 / 1000
    ci_lower_kg_ha = max(0, (predicted_hg_ha - std_dev) / 100)
    ci_upper_kg_ha = (predicted_hg_ha + std_dev) / 100

    if predicted_kg_ha > 50000:
        interpretation = "Excellent yield expected. Conditions are highly favorable."
    elif predicted_kg_ha > 30000:
        interpretation = "Good yield expected. Maintain current farming practices."
    elif predicted_kg_ha > 15000:
        interpretation = "Moderate yield expected. Consider optimizing irrigation and fertilization."
    else:
        interpretation = "Below average yield expected. Review soil health and input management."

    return {
        "crop": matched_crop,
        "region": matched_area,
        "year": year,
        "inputs": {
            "rainfall_mm_per_year": rainfall_mm,
            "pesticides_tonnes": pesticides_tonnes,
            "avg_temp_celsius": avg_temp,
        },
        "prediction": {
            "yield_hg_per_ha": round(predicted_hg_ha, 2),
            "yield_kg_per_ha": round(predicted_kg_ha, 2),
            "yield_tonnes_per_acre": round(predicted_tonnes_acre, 4),
        },
        "confidence_interval": {
            "lower_kg_per_ha": round(ci_lower_kg_ha, 2),
            "upper_kg_per_ha": round(ci_upper_kg_ha, 2),
            "note": "68% confidence interval based on Random Forest tree variance"
        },
        "interpretation": interpretation,
        "supported_crops": SUPPORTED_CROPS,
    }