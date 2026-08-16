import pickle
from pathlib import Path
from collections import Counter

from sklearn.linear_model import LogisticRegression

from models.memo import Memo

from classifier.predict import (
    embedding_model,
    reload_classifier
)


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "classifier.pkl"


def train_classifier(db):

    memos = db.query(Memo).all()

    if len(memos) == 0:
        raise ValueError(
            "No training data"
        )


    texts = []
    labels = []

    for memo in memos:

        text = (
            f"{memo.title} {memo.content}"
        )

        texts.append(text)
        labels.append(memo.category)


    # カテゴリ数確認
    category_counts = Counter(labels)

    if len(category_counts) < 2:
        raise ValueError(
            "At least two categories are required"
        )


    X = embedding_model.encode(
        texts,
        normalize_embeddings=True
    )


    classifier = LogisticRegression(
        max_iter=1000,
        class_weight="balanced"
    )

    classifier.fit(
        X,
        labels
    )


    with open(MODEL_PATH, "wb") as f:
        pickle.dump(
            classifier,
            f
        )


    # FastAPI上のclassifierも更新
    reload_classifier()


    return {
        "message": "Training completed",
        "training_samples": len(memos),
        "categories": dict(category_counts)
    }