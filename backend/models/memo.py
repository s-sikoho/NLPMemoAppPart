from sqlalchemy import Column, Integer, String
from database.database import Base


class Memo(Base):

    __tablename__ = "memos"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    text = Column(
        String
    )

    category = Column(
        String
    )