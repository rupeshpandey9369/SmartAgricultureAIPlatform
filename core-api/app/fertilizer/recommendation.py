"""
Rule-based fertilizer recommendation engine.

Given crop type, soil type, and farm area, returns NPK fertilizer
recommendations with quantity and application guidance.

This is rule-based (not ML) — fast, explainable, and doesn't need training data.
Real-world agronomy advisories work this way too: standard nutrient
requirement tables per crop, adjusted for soil type and area.
"""

# Base NPK requirement in kg per acre, by crop (standard agronomy reference values)
CROP_NPK_BASE = {
    "wheat":   {"N": 50, "P": 25, "K": 25},
    "rice":    {"N": 60, "P": 30, "K": 30},
    "maize":   {"N": 55, "P": 25, "K": 20},
    "corn":    {"N": 55, "P": 25, "K": 20},
    "potato":  {"N": 70, "P": 40, "K": 60},
    "tomato":  {"N": 45, "P": 35, "K": 45},
    "pepper":  {"N": 40, "P": 30, "K": 35},
    "cotton":  {"N": 50, "P": 20, "K": 20},
    "sugarcane": {"N": 80, "P": 30, "K": 30},
    "soybean": {"N": 20, "P": 30, "K": 20},
    "groundnut": {"N": 15, "P": 30, "K": 20},
    "default": {"N": 45, "P": 25, "K": 25},
}

# Soil type adjustment multipliers (sandy soils leach nutrients faster,
# clay retains more, alluvial is generally fertile/balanced)
SOIL_ADJUSTMENT = {
    "sandy":    {"N": 1.20, "P": 1.10, "K": 1.15},
    "clay":     {"N": 0.90, "P": 0.95, "K": 0.90},
    "loamy":    {"N": 1.00, "P": 1.00, "K": 1.00},
    "alluvial": {"N": 0.95, "P": 1.00, "K": 1.00},
    "black":    {"N": 0.90, "P": 1.05, "K": 0.95},
    "red":      {"N": 1.10, "P": 1.10, "K": 1.05},
    "laterite": {"N": 1.15, "P": 1.15, "K": 1.10},
    "default":  {"N": 1.00, "P": 1.00, "K": 1.00},
}

# Common fertilizer sources and their nutrient content (% by weight)
FERTILIZER_SOURCES = {
    "N": {"name": "Urea", "nutrient_pct": 0.46},
    "P": {"name": "DAP (Di-Ammonium Phosphate)", "nutrient_pct": 0.46},
    "K": {"name": "MOP (Muriate of Potash)", "nutrient_pct": 0.60},
}


def get_recommendation(crop: str, soil_type: str, area_acres: float) -> dict:
    crop_key = crop.strip().lower()
    soil_key = soil_type.strip().lower()

    base = CROP_NPK_BASE.get(crop_key, CROP_NPK_BASE["default"])
    adjustment = SOIL_ADJUSTMENT.get(soil_key, SOIL_ADJUSTMENT["default"])

    # Total nutrient requirement (kg) = base per acre * adjustment * area
    n_total = round(base["N"] * adjustment["N"] * area_acres, 2)
    p_total = round(base["P"] * adjustment["P"] * area_acres, 2)
    k_total = round(base["K"] * adjustment["K"] * area_acres, 2)

    # Convert nutrient requirement to actual fertilizer product quantity
    urea_kg = round(n_total / FERTILIZER_SOURCES["N"]["nutrient_pct"], 2)
    dap_kg = round(p_total / FERTILIZER_SOURCES["P"]["nutrient_pct"], 2)
    mop_kg = round(k_total / FERTILIZER_SOURCES["K"]["nutrient_pct"], 2)

    return {
        "crop": crop,
        "soil_type": soil_type,
        "area_acres": area_acres,
        "nutrient_requirement_kg": {
            "nitrogen_N": n_total,
            "phosphorus_P": p_total,
            "potassium_K": k_total,
        },
        "fertilizer_plan": [
            {
                "fertilizer": "Urea",
                "quantity_kg": urea_kg,
                "supplies": "Nitrogen (N)",
                "application": "Apply in 2-3 split doses: at sowing, and during vegetative growth stage."
            },
            {
                "fertilizer": "DAP (Di-Ammonium Phosphate)",
                "quantity_kg": dap_kg,
                "supplies": "Phosphorus (P)",
                "application": "Apply fully as basal dose at the time of sowing/transplanting."
            },
            {
                "fertilizer": "MOP (Muriate of Potash)",
                "quantity_kg": mop_kg,
                "supplies": "Potassium (K)",
                "application": "Apply half at sowing, remaining half during flowering/fruiting stage."
            },
        ],
        "notes": (
            f"Recommendation based on standard nutrient tables for {crop}, "
            f"adjusted for {soil_type} soil conditions. Conduct a soil test "
            "for more precise, field-specific recommendations."
        )
    }
