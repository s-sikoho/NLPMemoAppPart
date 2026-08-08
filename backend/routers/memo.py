from fastapi import APIRouter
from schemas.memo import MemoCreate


router = APIRouter(
    prefix="/memo",
    tags=["memo"]
)


# メモ保存場所（仮）
memos = []


@router.get("/")
def get_memos():
    return {
        "memos": memos
    }


@router.post("/")
def create_memo(memo: MemoCreate):

    memos.append(memo.text)

    return {
        "message": "saved",
        "text": memo.text
    }