"""
Weather service — fetches current weather + 5-day forecast from OpenWeatherMap
and generates farming-specific alerts (rain, heatwave, frost, humidity).
"""

import httpx
from app.config import settings

BASE_URL = "https://api.openweathermap.org/data/2.5"


def _farming_alerts(current: dict, forecast_list: list) -> list:
    """Generate farming-relevant alerts from weather data."""
    alerts = []
    temp = current.get("main", {}).get("temp", 0)
    humidity = current.get("main", {}).get("humidity", 0)
    wind_speed = current.get("wind", {}).get("speed", 0)
    weather_id = current.get("weather", [{}])[0].get("id", 800)

    # Heatwave alert
    if temp >= 38:
        alerts.append({
            "type": "heatwave",
            "severity": "high",
            "title": "Heatwave Warning",
            "message": f"Temperature is {temp:.1f}°C. Irrigate crops early morning or evening. Avoid field work during peak hours (11am–4pm)."
        })
    elif temp >= 34:
        alerts.append({
            "type": "heatwave",
            "severity": "medium",
            "title": "High Temperature Alert",
            "message": f"Temperature is {temp:.1f}°C. Increase irrigation frequency and check for heat stress in crops."
        })

    # Frost alert
    if temp <= 2:
        alerts.append({
            "type": "frost",
            "severity": "high",
            "title": "Frost Warning",
            "message": f"Temperature is {temp:.1f}°C. Protect sensitive crops with covers or smoke screens tonight."
        })

    # Rain/storm alert
    if weather_id < 600:  # 2xx thunderstorm, 3xx drizzle, 5xx rain
        alerts.append({
            "type": "rain",
            "severity": "medium",
            "title": "Rain Alert",
            "message": "Rain detected. Delay fertilizer application — nutrients may wash away. Check field drainage."
        })

    # High humidity - disease risk
    if humidity >= 85:
        alerts.append({
            "type": "disease_risk",
            "severity": "medium",
            "title": "High Humidity — Disease Risk",
            "message": f"Humidity is {humidity}%. Conditions favour fungal diseases (blight, mold). Inspect crops and consider preventive fungicide."
        })

    # High wind
    if wind_speed >= 10:
        alerts.append({
            "type": "wind",
            "severity": "low",
            "title": "Strong Wind Advisory",
            "message": f"Wind speed is {wind_speed} m/s. Avoid spraying pesticides/fertilizers. Secure any crop covers or nets."
        })

    # Check upcoming forecast for rain in next 24h
    rain_soon = any(
        item.get("weather", [{}])[0].get("id", 800) < 600
        for item in forecast_list[:8]  # next 24 hours (8 x 3hr intervals)
    )
    if rain_soon and weather_id >= 600:
        alerts.append({
            "type": "rain_forecast",
            "severity": "low",
            "title": "Rain Expected in 24 Hours",
            "message": "Rain is forecast within 24 hours. Plan irrigation accordingly and hold off on fertilizer application."
        })

    return alerts


def _parse_forecast(forecast_list: list) -> list:
    """Group 3-hour forecast into daily summaries (5 days)."""
    daily = {}
    for item in forecast_list:
        date = item["dt_txt"].split(" ")[0]
        if date not in daily:
            daily[date] = {
                "date": date,
                "temp_min": item["main"]["temp_min"],
                "temp_max": item["main"]["temp_max"],
                "humidity": item["main"]["humidity"],
                "description": item["weather"][0]["description"].title(),
                "icon": item["weather"][0]["icon"],
                "rain_chance": item.get("pop", 0) * 100,
            }
        else:
            daily[date]["temp_min"] = min(daily[date]["temp_min"], item["main"]["temp_min"])
            daily[date]["temp_max"] = max(daily[date]["temp_max"], item["main"]["temp_max"])
            daily[date]["rain_chance"] = max(daily[date]["rain_chance"], item.get("pop", 0) * 100)

    return list(daily.values())[:5]


async def get_weather(lat: float, lon: float) -> dict:
    """Fetch current weather + 5-day forecast + farming alerts."""
    api_key = settings.OPENWEATHER_API_KEY

    async with httpx.AsyncClient(timeout=10) as client:
        current_res = await client.get(
            f"{BASE_URL}/weather",
            params={"lat": lat, "lon": lon, "appid": api_key, "units": "metric"}
        )
        current_res.raise_for_status()
        current = current_res.json()

        forecast_res = await client.get(
            f"{BASE_URL}/forecast",
            params={"lat": lat, "lon": lon, "appid": api_key, "units": "metric"}
        )
        forecast_res.raise_for_status()
        forecast_data = forecast_res.json()

    forecast_list = forecast_data.get("list", [])
    alerts = _farming_alerts(current, forecast_list)
    forecast = _parse_forecast(forecast_list)

    return {
        "location": {
            "city": current.get("name", "Unknown"),
            "country": current.get("sys", {}).get("country", ""),
            "lat": lat,
            "lon": lon,
        },
        "current": {
            "temp": round(current["main"]["temp"], 1),
            "feels_like": round(current["main"]["feels_like"], 1),
            "temp_min": round(current["main"]["temp_min"], 1),
            "temp_max": round(current["main"]["temp_max"], 1),
            "humidity": current["main"]["humidity"],
            "pressure": current["main"]["pressure"],
            "wind_speed": current["wind"]["speed"],
            "wind_deg": current["wind"].get("deg", 0),
            "visibility": current.get("visibility", 0),
            "description": current["weather"][0]["description"].title(),
            "icon": current["weather"][0]["icon"],
            "clouds": current.get("clouds", {}).get("all", 0),
        },
        "forecast": forecast,
        "farming_alerts": alerts,
    }
