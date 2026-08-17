from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.category import Category
from schemas.category import CategoryCreate
from models.memo import Memo
from models.trainingmemo import TrainingMemo


router = APIRouter(
    prefix="/categories",
    tags=["categories"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/")
def get_categories(
    db: Session = Depends(get_db)
):

    return (
        db.query(Category)
        .order_by(
            Category.is_system,
            Category.name
        )
        .all()
    )


@router.post("/")
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):

    existing = (
        db.query(Category)
        .filter(Category.name == category.name)
        .first()
    )

    if existing is not None:
        raise HTTPException(
            status_code=400,
            detail="Category already exists"
        )

    new_category = Category(
        name=category.name
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):

    category = (
        db.query(Category)
        .filter(
            Category.id == category_id
        )
        .first()
    )

    if category is None:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    # システムカテゴリ削除禁止
    if category.is_system:
        raise HTTPException(
            status_code=400,
            detail="System category cannot be deleted"
        )

    # その他取得
    other = (
        db.query(Category)
        .filter(
            Category.name == "その他"
        )
        .first()
    )

    if other is None:
        raise HTTPException(
            status_code=500,
            detail="Other category not found"
        )

    # 該当カテゴリのメモを移動
    db.query(Memo).filter(
        Memo.category == category.name
    ).update(
        {
            "category": other.name
        },
        synchronize_session=False
    )

    db.query(TrainingMemo)\
        .filter(
            TrainingMemo.category == category.name
        )\
        .delete()

    # カテゴリ削除
    db.delete(category)
    db.commit()

    return {
        "message": "Category deleted"
    }