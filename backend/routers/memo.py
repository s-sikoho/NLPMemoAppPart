from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.memo import Memo
from schemas.memo import MemoCreate, MemoUpdate, MemoSave
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


# -------------------------
# Read
# メモ一覧取得
# -------------------------
@router.get("/")
def get_memos(
    db: Session = Depends(get_db)
):

    memos = db.query(Memo).all()

    return memos

# -------------------------
# Predict
# カテゴリを予想
# -------------------------
@router.post("/predict")
def predict_memo_category(
    memo: MemoCreate
):

    classification_text = (
        f"{memo.title} {memo.content}"
    )

    category = predict_category(
        classification_text
    )

    return {
        "category": category
    }
# -------------------------
# Create
# メモ作成
# -------------------------
@router.post("/")
def create_memo(
    memo: MemoSave,
    db: Session = Depends(get_db)
):

    new_memo = Memo(
        title=memo.title,
        content=memo.content,
        category=memo.category
    )

    db.add(new_memo)
    db.commit()
    db.refresh(new_memo)

    return new_memo

# -------------------------
# Update
# メモ編集
# -------------------------
@router.put("/{memo_id}")
def update_memo(
    memo_id: int,
    memo: MemoUpdate,
    db: Session = Depends(get_db)
):

    target_memo = (
        db.query(Memo)
        .filter(Memo.id == memo_id)
        .first()
    )

    if target_memo is None:
        raise HTTPException(
            status_code=404,
            detail="Memo not found"
        )

    category = predict_category(
        memo.text
    )

    target_memo.text = memo.text
    target_memo.category = category

    db.commit()
    db.refresh(target_memo)

    return target_memo


# -------------------------
# Delete
# メモ削除
# -------------------------
@router.delete("/{memo_id}")
def delete_memo(
    memo_id: int,
    db: Session = Depends(get_db)
):

    target_memo = (
        db.query(Memo)
        .filter(Memo.id == memo_id)
        .first()
    )

    if target_memo is None:
        raise HTTPException(
            status_code=404,
            detail="Memo not found"
        )

    db.delete(target_memo)
    db.commit()

    return {
        "message": "Memo deleted",
        "id": memo_id
    }