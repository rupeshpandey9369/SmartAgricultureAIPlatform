from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_user
from app.auth.models import User
from app.farms.models import Farm
from app.farms.schemas import FarmCreate, FarmUpdate, FarmOut

router = APIRouter(prefix="/farms", tags=["farms"])


def _get_owned_farm(farm_id: UUID, user: User, db: Session) -> Farm:
    farm = db.query(Farm).filter(Farm.id == farm_id, Farm.user_id == user.id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")
    return farm


@router.post("", response_model=FarmOut, status_code=status.HTTP_201_CREATED)
def create_farm(payload: FarmCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    farm = Farm(user_id=user.id, **payload.model_dump())
    db.add(farm)
    db.commit()
    db.refresh(farm)
    return farm


@router.get("", response_model=List[FarmOut])
def list_farms(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Farm).filter(Farm.user_id == user.id).order_by(Farm.created_at.desc()).all()


@router.get("/{farm_id}", response_model=FarmOut)
def get_farm(farm_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _get_owned_farm(farm_id, user, db)


@router.patch("/{farm_id}", response_model=FarmOut)
def update_farm(farm_id: UUID, payload: FarmUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    farm = _get_owned_farm(farm_id, user, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(farm, field, value)
    db.commit()
    db.refresh(farm)
    return farm


@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_farm(farm_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    farm = _get_owned_farm(farm_id, user, db)
    db.delete(farm)
    db.commit()
    return None
