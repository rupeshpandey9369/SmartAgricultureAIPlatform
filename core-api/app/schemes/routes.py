from fastapi import APIRouter, Query
from typing import Optional
from app.schemes.service import get_schemes

router = APIRouter(prefix="/schemes", tags=["schemes"])


@router.get("/")
def list_schemes(
    area_acres: Optional[float] = Query(None, description="Farm area in acres"),
    crop: Optional[str] = Query(None, description="Primary crop"),
):
    """Get government schemes matching farmer profile."""
    return get_schemes(area_acres=area_acres, crop=crop)
