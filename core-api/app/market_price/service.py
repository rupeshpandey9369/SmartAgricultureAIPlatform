"""
Market price service with realistic Indian mandi price data.

Uses carefully researched realistic price ranges for major Indian crops
across real mandi locations. Data structure matches data.gov.in API format
so swapping to real API later requires only changing the data source function.
"""

import random
from datetime import datetime, timedelta

MANDIS = [
    "Azadpur, Delhi", "Vashi, Mumbai", "Ghazipur, UP",
    "Bangalore, Karnataka", "Ahmedabad, Gujarat", "Kolkata, WB",
    "Hyderabad, Telangana", "Chennai, Tamil Nadu", "Lucknow, UP",
    "Patna, Bihar", "Jaipur, Rajasthan", "Bhopal, MP",
    "Nagpur, Maharashtra", "Surat, Gujarat", "Ludhiana, Punjab"
]

CROP_PRICES = {
    "Wheat":     {"min": 2100, "max": 2400, "unit": "quintal", "emoji": "🌾"},
    "Rice":      {"min": 2800, "max": 3500, "unit": "quintal", "emoji": "🍚"},
    "Maize":     {"min": 1800, "max": 2200, "unit": "quintal", "emoji": "🌽"},
    "Soybean":   {"min": 4200, "max": 5000, "unit": "quintal", "emoji": "🫘"},
    "Cotton":    {"min": 6500, "max": 7500, "unit": "quintal", "emoji": "🌿"},
    "Sugarcane": {"min": 350,  "max": 400,  "unit": "quintal", "emoji": "🎋"},
    "Potato":    {"min": 800,  "max": 1500, "unit": "quintal", "emoji": "🥔"},
    "Onion":     {"min": 1200, "max": 3000, "unit": "quintal", "emoji": "🧅"},
    "Tomato":    {"min": 500,  "max": 4000, "unit": "quintal", "emoji": "🍅"},
    "Mustard":   {"min": 5200, "max": 5800, "unit": "quintal", "emoji": "🌻"},
    "Groundnut": {"min": 5500, "max": 6500, "unit": "quintal", "emoji": "🥜"},
    "Turmeric":  {"min": 12000,"max": 18000,"unit": "quintal", "emoji": "🌿"},
    "Chilli":    {"min": 8000, "max": 15000,"unit": "quintal", "emoji": "🌶️"},
    "Garlic":    {"min": 3000, "max": 8000, "unit": "quintal", "emoji": "🧄"},
}


def _generate_price_trend(base_price: float, days: int = 30) -> list:
    trend = []
    price = base_price * random.uniform(0.85, 0.95)
    today = datetime.now()
    for i in range(days, 0, -1):
        date = today - timedelta(days=i)
        change = random.uniform(-0.03, 0.04)
        price = max(price * (1 + change), base_price * 0.7)
        trend.append({"date": date.strftime("%Y-%m-%d"), "price": round(price, 2)})
    return trend


def _get_mock_prices(crop: str = None) -> list:
    results = []
    crops_to_show = [crop] if crop and crop in CROP_PRICES else list(CROP_PRICES.keys())
    for crop_name in crops_to_show:
        info = CROP_PRICES[crop_name]
        selected_mandis = random.sample(MANDIS, random.randint(4, 7))
        for mandi in selected_mandis:
            modal_price = random.uniform(info["min"], info["max"])
            results.append({
                "crop": crop_name,
                "emoji": info["emoji"],
                "mandi": mandi,
                "state": mandi.split(", ")[-1],
                "min_price": round(modal_price * random.uniform(0.90, 0.97), 2),
                "max_price": round(modal_price * random.uniform(1.03, 1.12), 2),
                "modal_price": round(modal_price, 2),
                "unit": info["unit"],
                "date": datetime.now().strftime("%Y-%m-%d"),
                "currency": "INR",
            })
    return results


def get_market_prices(crop: str = None) -> dict:
    prices = _get_mock_prices(crop=crop)
    trend = []
    prediction = None

    if crop and crop in CROP_PRICES:
        info = CROP_PRICES[crop]
        base = (info["min"] + info["max"]) / 2
        trend = _generate_price_trend(base, days=30)

        last_price = trend[-1]["price"]
        avg_change = sum(
            (trend[i]["price"] - trend[i-1]["price"]) / trend[i-1]["price"]
            for i in range(1, len(trend))
        ) / (len(trend) - 1)

        future_prices = []
        pred_price = last_price
        for i in range(1, 8):
            pred_price = pred_price * (1 + avg_change + random.uniform(-0.01, 0.01))
            future_prices.append({
                "date": (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d"),
                "predicted_price": round(pred_price, 2),
            })

        best_day = max(future_prices, key=lambda x: x["predicted_price"])
        trend_direction = "rising" if avg_change > 0.005 else "falling" if avg_change < -0.005 else "stable"

        prediction = {
            "next_7_days": future_prices,
            "best_selling_date": best_day["date"],
            "best_selling_price": best_day["predicted_price"],
            "trend": trend_direction,
            "advice": (
                f"Prices are {trend_direction}. "
                + ("Consider selling soon to maximize profit." if trend_direction == "falling"
                   else "Hold stock for a few days for better price." if trend_direction == "rising"
                   else "Prices are stable — sell at your convenience.")
            )
        }

    return {
        "data_source": "mock_data",
        "note": "Realistic simulated mandi prices. Connect data.gov.in API for live prices.",
        "prices": prices,
        "price_trend": trend,
        "prediction": prediction,
        "supported_crops": list(CROP_PRICES.keys()),
    }
