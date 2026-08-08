from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from database.database import SessionLocal

from models.memo import Memo

from schemas.memo import MemoCreate

from classifier.predict import predict_category

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

    category = predict_category(
        memo.text
    )

    new_memo = Memo(
        text=memo.text,
        category=category
    )


    db.add(new_memo)

    db.commit()

    db.refresh(new_memo)


    return new_memo