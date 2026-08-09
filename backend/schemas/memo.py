from pydantic import BaseModel


# 分類予測用
class MemoCreate(BaseModel):
    title: str
    content: str


# 保存用
class MemoSave(BaseModel):
    title: str
    content: str
    category: str


# 更新用
class MemoUpdate(BaseModel):
    title: str
    content: str
    category: str