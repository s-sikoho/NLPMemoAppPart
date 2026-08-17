from fastapi import FastAPI
from routers import memo, category,classifier,trainingmemos
from fastapi.middleware.cors import CORSMiddleware
from database.init_db import init_database

init_database()
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
app.include_router(trainingmemos.router)

@app.get("/")
def root():
    return {
        "message": "Memo App API"
    }