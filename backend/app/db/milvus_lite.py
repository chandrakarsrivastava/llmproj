import os
from dotenv import load_dotenv
from pymilvus import connections

host = os.getenv("MILVUS_HOST", "localhost")
port = os.getenv("MILVUS_PORT", "19530")

# This automatically spins up an in-memory Milvus Lite server
connections.connect(alias="default", host=host, port=port)
print("Milvus Lite (in-memory) started successfully!")

input("Press Enter to stop Milvus Lite...")
