# pinecone_openai_simple.py
import os
import json
from typing import List
import pandas as pd
from pinecone import Pinecone, ServerlessSpec
import time
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")        # optional, e.g. "us-west1-gcp"
INDEX_NAME = os.getenv("PINECONE_INDEX", "titanic-index")
NAMESPACE = os.getenv("PINECONE_NAMESPACE", None)  # optional
BATCH_SIZE = 100   # safe and simple default

def row_to_text(row: pd.Series) -> str:
    """Turn a cleaned DataFrame row into a short string to embed."""
    # include the columns that matter for semantic search
    parts = [
        f"Pclass: {row.get('Pclass', '')}",
        f"Sex: {row.get('Sex', '')}",
        f"Age: {row.get('Age', '')}",
        f"Fare: {row.get('Fare', '')}",
        f"Embarked: {row.get('Embarked', '')}"
    ]
    return "; ".join([p for p in parts if p is not None])

def chunks(lst: List, n: int):
    """Yield successive n-sized chunks from list."""
    for i in range(0, len(lst), n):
        yield lst[i:i+n]

def get_local_embeddings(texts):
    model = SentenceTransformer("all-MiniLM-L6-v2")   # free local model
    embs = model.encode(texts, convert_to_numpy=True)
    return embs

def embed_and_upsert_openai_pinecone(df: pd.DataFrame):

    pc = Pinecone(api_key=PINECONE_API_KEY)

    ids = []
    texts = []
    metas = []
    for idx, row in df.iterrows():
        pid = row.get("PassengerId", idx)
        ids.append(f"passenger_{int(pid)}")
        texts.append(row_to_text(row))
        metas.append({
            "passenger_id": int(pid),
            "raw": json.dumps(row.fillna("").to_dict())
        })

    all_embeddings = get_local_embeddings(texts)

    if len(all_embeddings) != len(ids):
        raise RuntimeError("Embeddings count doesn't match IDs count.")

    existing_names = pc.list_indexes().names()
    if INDEX_NAME not in existing_names:
        dim = len(all_embeddings[0])
        print(f"Creating index '{INDEX_NAME}' with dimension {dim} ...")
        
        index_config = pc.create_index(
            name=INDEX_NAME,
            dimension=dim,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        host = index_config.host
    else:
        info = pc.describe_index(name=INDEX_NAME)
        host = info["host"]

    index = pc.Index(host=host)

    total = len(ids)
    for i in range(0, total, BATCH_SIZE):
        i_end = min(i + BATCH_SIZE, total)
        batch_ids = ids[i:i_end]
        batch_embs = all_embeddings[i:i_end]
        batch_meta = metas[i:i_end]
        vectors = [(batch_ids[j], batch_embs[j], batch_meta[j]) for j in range(len(batch_ids))]
        index.upsert(vectors=vectors, namespace=NAMESPACE)
        print(f"Upserted {i_end}/{total} vectors to Pinecone")

    print("All done. Vectors stored in Pinecone index:", INDEX_NAME)

