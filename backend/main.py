from fastapi import FastAPI

from routers import memo

from database.database import Base, engine


Base.metadata.create_all(
    bind=engine
)


app = FastAPI()


app.include_router(
    memo.router
)


@app.get("/")
def root():
    return {
        "message": "Memo App API"
    }