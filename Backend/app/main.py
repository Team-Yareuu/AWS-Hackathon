from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.routes import router as api_router
from app.config.settings import settings
from app.db.session import close_driver

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown
    await close_driver()

app = FastAPI(
    title="Culinary AI Backend",
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
async def read_root():
    return {"status": "ok", "message": "Welcome to the Culinary AI Backend!"}