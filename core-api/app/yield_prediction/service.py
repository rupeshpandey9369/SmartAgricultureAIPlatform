"""
Yield prediction service using a trained Random Forest model.
Model was trained on FAO crop yield dataset with features:
Area (country), Item (crop), Year, Rainfall, Pesticides, Temperature
"""

import os
import pickle
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "yield_model.pkl")

# Load model once at startup
print(f"Loading yield prediction model from {MODEL_PATH} ...")
with open(MODEL_PATH, "rb") as f:
    model_data = pickle.load(f)

model = model_data["model"]
le_area = model_data["le_area"]
le_item = model_data["le_item"]
SUPPORTED_CROPS = model_data["crops"]
SUPPORTED_AREAS = model_data["areas"]

print(f"Yield model loaded. Supports {len(SUPPORTED_CROPS)} crops, {len(SUPPORTED_AREAS)} regions.")


def predict_yield(
    crop: str,
    area: str,
    year: int,
    rainfall_mm: float,
    pesticides_tonnes: float,
    avg_temp: float,
) -> dict:
    """
    Predict crop yield in hg/ha and convert to kg/hectare and tonnes/acre.

    Returns prediction + confidence interval + interpretation.
    """
    # Validate crop
    matched_crop = next(
        (c for c in SUPPORTED_CROPS if c.lower() == crop.strip().lower()), None
    )
    if not matched_crop:
        raise ValueError(
            f"Crop '{crop}' not supported. Supported crops: {SUPPORTED_CROPS}"
        )

    # Validate area — find closest match (case-insensitive)
    matched_area = next(
        (a for a in SUPPORTED_AREAS if a.lower() == area.strip().lower()), None
    )
    if not matched_area:
        # Default to India if area not found
        matched_area = "India" if "India" in SUPPORTED_AREAS else SUPPORTED_AREAS[0]

    # Encode inputs
    area_encoded = le_area.transform([matched_area])[0]
    item_encoded = le_item.transform([matched_crop])[0]

    features = np.array([[
        area_encoded,
        item_encoded,
        year,
        rainfall_mm,
        pesticides_tonnes,
        avg_temp,
    ]])

    # Get predictions from all trees for confidence interval
    tree_predictions = np.array([
        tree.predict(features)[0]
        for tree in model.estimators_
    ])

    predicted_hg_ha = float(np.mean(tree_predictions))
    std_dev = float(np.std(tree_predictions))

    # Convert units
    predicted_kg_ha = predicted_hg_ha / 100
    predicted_tonnes_acre = predicted_kg_ha * 0.404686 / 1000

    # Confidence interval (±1 std dev → ~68% confidence)
    ci_lower_kg_ha = max(0, (predicted_hg_ha - std_dev) / 100)
    ci_upper_kg_ha = (predicted_hg_ha + std_dev) / 100

    # Simple interpretation
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
