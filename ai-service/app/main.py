from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.disease.routes import router as disease_router

app = FastAPI(title="Smart Agriculture AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(disease_router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}
