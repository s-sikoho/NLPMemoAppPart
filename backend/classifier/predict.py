import pickle
from sentence_transformers import SentenceTransformer

# classifier読み込み
with open("classifier.pkl", "rb") as f:
    classifier = pickle.load(f)

# 学習モデル
embedding_model = SentenceTransformer(
    "intfloat/multilingual-e5-small"
)

def predict_category(text):

    # 文章 → ベクトル
    X = embedding_model.encode(
        [text],
        normalize_embeddings=True
    )

    # ベクトル → 分類
    result = classifier.predict(X)

    return result[0]