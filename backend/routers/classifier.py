from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from database.database import SessionLocal
from classifier.train import train_classifier


router = APIRouter(
    prefix="/classifier",
    tags=["classifier"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/train")
def train(
    db: Session = Depends(get_db)
):

    try:

        result = train_classifier(
            db
        )

        return result

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )