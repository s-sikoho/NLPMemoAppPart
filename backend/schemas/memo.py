from pydantic import BaseModel


class MemoCreate(BaseModel):
    title: str
    content: str


class MemoUpdate(BaseModel):
    title: str
    content: str
    category: str