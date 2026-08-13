import pickle
from pathlib import Path
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "classifier.pkl"


embedding_model = SentenceTransformer(
    "intfloat/multilingual-e5-small"
)


def load_classifier():

    with open(MODEL_PATH, "rb") as f:
        return pickle.load(f)


classifier = load_classifier()


def reload_classifier():

    global classifier

    classifier = load_classifier()


def predict_category(text):

    X = embedding_model.encode(
        [text],
        normalize_embeddings=True
    )

    probabilities = classifier.predict_proba(X)[0]

    max_index = probabilities.argmax()

    category = classifier.classes_[max_index]

    confidence = probabilities[max_index]


    return {
        "category": category,
        "confidence": float(confidence)
    }