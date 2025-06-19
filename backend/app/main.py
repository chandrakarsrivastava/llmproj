
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.api.translation import translation

app = FastAPI()

# Your backend APIs first
@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI"}

# Include translation router
app.include_router(translation.router, prefix="/api/translation")

# Then mount static files after API
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/build"))
app.mount("/static", StaticFiles(directory=os.path.join(frontend_path, "static")), name="static")

# app.mount("/", StaticFiles(directory="app/static", html=True), name="static")


# Catch-all route to serve index.html (for React frontend)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse(os.path.join(frontend_path, "index.html"))
