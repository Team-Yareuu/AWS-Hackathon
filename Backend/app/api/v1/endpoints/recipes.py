from typing import List

from fastapi import APIRouter, HTTPException, Depends
from neo4j import AsyncSession

from app.crud import crud_recipe
from app.schemas.recipe import Recipe, RecipeCreate
from app.db.session import get_session

router = APIRouter()

@router.post("/", response_model=Recipe, status_code=201)
async def create_recipe(recipe: RecipeCreate, session: AsyncSession = Depends(get_session)):
    try:
        return await crud_recipe.create(recipe=recipe, session=session)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@router.get("/{recipe_id}", response_model=Recipe)
async def read_recipe(recipe_id: str, session: AsyncSession = Depends(get_session)):
    recipe = await crud_recipe.get(recipe_id=recipe_id, session=session)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.get("/", response_model=List[Recipe])
async def read_recipes(skip: int = 0, limit: int = 10, session: AsyncSession = Depends(get_session)):
    recipes = await crud_recipe.get_multi(session=session, skip=skip, limit=limit)
    return recipes
