from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.trainingmemo import TrainingMemo
router = APIRouter(
    prefix="/trainingmemos",
    tags=["trainingmemos"]
)

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# -------------------------
# Read
# メモ一覧取得
# -------------------------
@router.get("/")
def get_memos(
    db: Session = Depends(get_db)
):
    query = db.query(TrainingMemo)
    return query.all()