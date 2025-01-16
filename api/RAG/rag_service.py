from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv(".env.local")

class RAGService:
    def __init__(self):
        self.qdrant_client = QdrantClient(url=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY"))
        self.embedding_model = SentenceTransformer('nomic-ai/nomic-embed-text-v1', trust_remote_code=True)

    def embed_text(self, text: str):
        return self.embedding_model.encode(text)

    # TODO: add store_embedding method - this is a problematic placeholder for now
    # def store_embedding(self, user_id: str, summary: str):
    #     vector = self.embed_text(summary)
    #     self.qdrant_client.upsert(
    #         collection_name="user_profiles",
    #         points=[{
    #             "id": hash(f"{user_id}_{summary}"),
    #             "vector": vector.tolist(),
    #             "payload": {
    #                 "user_id": user_id,
    #                 "content": summary
    #             }
    #         }]
    #     ) 