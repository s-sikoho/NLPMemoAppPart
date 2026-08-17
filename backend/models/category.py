from sqlalchemy import Column, Integer, String, Boolean
from database.database import Base


class Category(Base):

    __tablename__ = "categories"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        unique=True,
        nullable=False
    )

    is_system = Column(
        Boolean,
        default=False
    )