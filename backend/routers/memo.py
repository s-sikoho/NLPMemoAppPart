from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from database.database import SessionLocal

from models.memo import Memo

from schemas.memo import MemoCreate


router = APIRouter(
    prefix="/memo",
    tags=["memo"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()



@router.get("/")
def get_memos(
    db: Session = Depends(get_db)
):

    memos = db.query(Memo).all()

    return memos



@router.post("/")
def create_memo(
    memo: MemoCreate,
    db: Session = Depends(get_db)
):

    new_memo = Memo(
        text=memo.text
    )


    db.add(new_memo)

    db.commit()

    db.refresh(new_memo)


    return new_memo