from fastapi import APIRouter, Query
from typing import Optional
from app.market_price.service import get_market_prices

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/prices")
def market_prices(
    crop: Optional[str] = Query(None, description="Crop name e.g. Wheat, Rice, Onion"),
):
    """
    Get current mandi prices for all crops or a specific crop.
    If crop is specified, also returns 30-day price trend and 7-day prediction.
    """
    return get_market_prices(crop=crop)
