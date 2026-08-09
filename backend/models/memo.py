from sqlalchemy import Column, Integer, String
from database.database import Base


class Memo(Base):
    __tablename__ = "memos"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    content = Column(
        String,
        nullable=False
    )

    category = Column(
        String,
        nullable=False
    )