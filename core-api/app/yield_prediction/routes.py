from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.yield_prediction.service import predict_yield, SUPPORTED_CROPS

router = APIRouter(prefix="/yield", tags=["yield"])


class YieldRequest(BaseModel):
    crop: str = Field(..., examples=["Wheat"])
    area: str = Field(..., examples=["India"])
    year: int = Field(..., examples=[2026])
    rainfall_mm: float = Field(..., gt=0, examples=[1200.0])
    pesticides_tonnes: float = Field(..., ge=0, examples=[100.0])
    avg_temp: float = Field(..., examples=[25.0])


@router.post("/predict")
def predict(payload: YieldRequest):
    try:
        result = predict_yield(
            crop=payload.crop,
            area=payload.area,
            year=payload.year,
            rainfall_mm=payload.rainfall_mm,
            pesticides_tonnes=payload.pesticides_tonnes,
            avg_temp=payload.avg_temp,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/crops")
def get_supported_crops():
    """List all crops the model can predict yield for."""
    return {"supported_crops": SUPPORTED_CROPS}
