from fastapi import FastAPI
from routers import memo, category,classifier
from database.database import Base, engine,SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from models.category import Category

Base.metadata.create_all(
    bind=engine
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "*"
    ],

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)

app.include_router(memo.router)
app.include_router(category.router)
app.include_router(classifier.router)

def initialize_categories():

    default_categories = [
        "programming",
        "life",
        "university"
    ]

    db = SessionLocal()

    try:
        for name in default_categories:

            existing = (
                db.query(Category)
                .filter(Category.name == name)
                .first()
            )

            if existing is None:

                category = Category(
                    name=name
                )

                db.add(category)

        db.commit()

    finally:
        db.close()


initialize_categories()

@app.get("/")
def root():
    return {
        "message": "Memo App API"
    }