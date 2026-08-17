import csv
from database.database import (
    engine,
    SessionLocal
)
from database.database import Base
from models.category import Category
from models.trainingmemo import TrainingMemo
from pathlib import Path

CSV_PATH = (
    Path(__file__).resolve().parent
    / "default_data.csv"
)

def init_database():
    # テーブル作成
    Base.metadata.create_all(
        bind=engine
    )
    db = SessionLocal()
    try:
        initialize_training_data(db)
    finally:
        db.close()

def initialize_training_data(db):
    # すでに登録済みなら終了
    if db.query(TrainingMemo).count() > 0:
        return
    with open(
        CSV_PATH,
        encoding="utf-8"
    ) as f:
        reader = csv.DictReader(f)
        for row in reader:
            category_name = row["category"]
            # カテゴリ確認
            category = (
                db.query(Category)
                .filter(
                    Category.name == category_name
                )
                .first()
            )
            # なければ作成
            if category is None:
                category = Category(
                    name=category_name,
                    is_system=False
                )
                db.add(category)
                db.flush()
            # 教師データ追加
            training_data = TrainingMemo(
                title=row["title"],
                content=row["content"],
                category=category_name,
            )
            db.add(training_data)
    # その他カテゴリは必ず作成
    other = (
        db.query(Category)
        .filter(
            Category.name == "その他"
        )
        .first()
    )
    if other is None:
        db.add(
            Category(
                name="その他",
                is_system=True
            )
        )
    db.commit()