from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class FarmCreate(BaseModel):
    name: str
    area_acres: float = Field(..., gt=0)
    soil_type: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_crop: Optional[str] = None


class FarmUpdate(BaseModel):
    name: Optional[str] = None
    area_acres: Optional[float] = Field(None, gt=0)
    soil_type: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_crop: Optional[str] = None


class FarmOut(BaseModel):
    id: UUID
    name: str
    area_acres: float
    soil_type: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    current_crop: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
