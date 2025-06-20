from fastapi import FastAPI
from pydantic import BaseModel
from chromadb import PersistentClient

# Use persistent store (safe for EC2 or local)
client = PersistentClient(path="./chroma_store")

collection = client.get_or_create_collection("my_collection")

app = FastAPI(title="ChromaDB API")

class Item(BaseModel):
    ids: list[str]
    documents: list[str]
    embeddings: list[list[float]]

class QueryItem(BaseModel):
    query_embedding: list[float]
    n_results: int = 3

@app.get("/collections")
def list_collections():
    return {"collections": [c.name for c in client.list_collections()]}

@app.post("/add")
def add_items(item: Item):
    collection.add(
        ids=item.ids,
        documents=item.documents,
        embeddings=item.embeddings
    )
    return {"status": "added", "count": len(item.ids)}

@app.post("/query")
def query(item: QueryItem):
    results = collection.query(
        query_embeddings=[item.query_embedding],
        n_results=item.n_results
    )
    return results
