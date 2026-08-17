from sqlalchemy import Column, String, Integer
from database.database import Base

class TrainingMemo(Base):
    __tablename__ = "trainingmemos"
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