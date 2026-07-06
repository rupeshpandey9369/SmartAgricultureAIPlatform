from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.fertilizer.recommendation import get_recommendation

router = APIRouter(prefix="/fertilizer", tags=["fertilizer"])


class FertilizerRequest(BaseModel):
    crop: str = Field(..., examples=["wheat"])
    soil_type: str = Field(..., examples=["alluvial"])
    area_acres: float = Field(..., gt=0, examples=[5.5])


@router.post("/recommend")
def recommend_fertilizer(payload: FertilizerRequest):
    return get_recommendation(
        crop=payload.crop,
        soil_type=payload.soil_type,
        area_acres=payload.area_acres,
    )
