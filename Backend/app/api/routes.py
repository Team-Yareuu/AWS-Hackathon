from fastapi import APIRouter
from app.api.v1.endpoints import users, recipes, ai

router = APIRouter()
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
router.include_router(ai.router, prefix="/ai", tags=["ai"])
