from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.auth.routes import router as auth_router
from app.farms.routes import router as farms_router
from app.fertilizer.routes import router as fertilizer_router
from app.weather.routes import router as weather_router
from app.yield_prediction.routes import router as yield_router
from app.market_price.routes import router as market_router
from app.chatbot.routes import router as chatbot_router
from app.schemes.routes import router as schemes_router


app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(farms_router)
app.include_router(chatbot_router)
app.include_router(fertilizer_router)
app.include_router(weather_router)
app.include_router(yield_router)
app.include_router(market_router)
app.include_router(schemes_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.APP_NAME}