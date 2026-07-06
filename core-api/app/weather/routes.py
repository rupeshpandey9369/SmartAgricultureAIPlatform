from fastapi import APIRouter, HTTPException, Query
from app.weather.service import get_weather

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/current")
async def current_weather(
    lat: float = Query(..., description="Latitude", example=26.8467),
    lon: float = Query(..., description="Longitude", example=80.9462),
):
    """
    Get current weather + 5-day forecast + farming alerts for a location.
    Default coordinates are for Lucknow, UP, India.
    """
    try:
        data = await get_weather(lat=lat, lon=lon)
        return data
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weather service error: {str(e)}")
