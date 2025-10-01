from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.recipe import Recipe, RecipeCreate
from app.crud import crud_recipe
from app.db.session import get_session
from neo4j import AsyncSession

router = APIRouter()

@router.post("/", response_model=Recipe)
async def create_recipe(recipe: RecipeCreate, session: AsyncSession = Depends(get_session)):
    return await crud_recipe.create(session=session, recipe=recipe)

@router.get("/{recipe_id}", response_model=Recipe)
async def read_recipe(recipe_id: str, session: AsyncSession = Depends(get_session)):
    db_recipe = await crud_recipe.get(session=session, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@router.get("/", response_model=List[Recipe])
async def read_recipes(skip: int = 0, limit: int = 10, session: AsyncSession = Depends(get_session)):
    recipes = await crud_recipe.get_multi(session=session, skip=skip, limit=limit)
    return recipes
