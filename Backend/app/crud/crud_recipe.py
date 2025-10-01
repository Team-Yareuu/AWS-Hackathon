from neo4j import AsyncSession
from app.schemas.recipe import RecipeCreate

async def create(session: AsyncSession, recipe: RecipeCreate):
    result = await session.run("""
        CREATE (r:Recipe {
            id: $id,
            name: $name,
            description: $description,
            image: $image,
            difficulty: $difficulty,
            cookingTime: $cookingTime,
            servings: $servings,
            estimatedCost: $estimatedCost,
            region: $region
        })
        RETURN r
    """, **recipe.dict())
    return await result.single()

async def get(session: AsyncSession, recipe_id: str):
    result = await session.run("MATCH (r:Recipe {id: $id}) RETURN r", id=recipe_id)
    return await result.single()

async def get_multi(session: AsyncSession, skip: int = 0, limit: int = 10):
    result = await session.run("MATCH (r:Recipe) RETURN r SKIP $skip LIMIT $limit", skip=skip, limit=limit)
    return await result.values()
