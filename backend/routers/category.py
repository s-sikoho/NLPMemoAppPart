from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import SessionLocal
from models.category import Category
from schemas.category import CategoryCreate


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

    return db.query(Category).all()


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