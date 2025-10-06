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

@router.get("/spotlight", response_model=List[Recipe])
async def get_spotlight_recipes(limit: int = 3, session: AsyncSession = Depends(get_session)):
    """Get featured/spotlight recipes for the homepage hero section"""
    recipes = await crud_recipe.get_spotlight(session=session, limit=limit)
    return recipes

@router.get("/budget/{max_cost}", response_model=List[Recipe])
async def get_recipes_by_budget(max_cost: int, limit: int = 6, session: AsyncSession = Depends(get_session)):
    """Get recipes within a specific budget range"""
    recipes = await crud_recipe.get_by_budget(session=session, max_cost=max_cost, limit=limit)
    return recipes

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
