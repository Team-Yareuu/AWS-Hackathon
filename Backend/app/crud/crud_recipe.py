from typing import List, Optional
from neo4j import AsyncSession

from app.schemas.recipe import Recipe, RecipeCreate


async def create(recipe: RecipeCreate, session: AsyncSession) -> Recipe:
    """Create a new recipe in Neo4j database"""
    # Check if recipe with this ID already exists
    result = await session.run(
        "MATCH (r:Recipe {id: $id}) RETURN r",
        id=recipe.id
    )
    if await result.single():
        raise ValueError("Recipe with this ID already exists")
    
    # Create the recipe
    recipe_dict = recipe.dict()
    await session.run(
        """
        CREATE (r:Recipe {
            id: $id,
            name: $name,
            shortDescription: $shortDescription,
            description: $description,
            image: $image,
            difficulty: $difficulty,
            cookingTimeMinutes: $cookingTimeMinutes,
            servings: $servings,
            estimatedCost: $estimatedCost,
            region: $region,
            isTraditional: $isTraditional,
            isNew: $isNew
        })
        """,
        **recipe_dict
    )
    
    return Recipe(**recipe_dict)


async def get(recipe_id: str, session: AsyncSession) -> Optional[Recipe]:
    """Get a recipe by ID from Neo4j database with all related data"""
    # Fetch recipe with all related data
    result = await session.run(
        """
        MATCH (r:Recipe {id: $id})
        OPTIONAL MATCH (r)-[:HAS_INGREDIENT]->(i:Ingredient)
        OPTIONAL MATCH (r)-[:HAS_STEP]->(cs:CookingStep)
        OPTIONAL MATCH (r)-[:HAS_VARIATION]->(rv:RegionalVariation)
        OPTIONAL MATCH (r)-[:AVAILABLE_AT]->(s:Store)
        OPTIONAL MATCH (s)-[:SELLS]->(si:Ingredient)
        RETURN r,
               collect(DISTINCT i) as ingredients,
               collect(DISTINCT cs) as cookingSteps,
               collect(DISTINCT rv) as regionalVariations,
               collect(DISTINCT s) as stores
        """,
        id=recipe_id
    )
    record = await result.single()
    if record is None:
        return None
    
    recipe_data = dict(record["r"])
    
    # Build ingredients list with their relationships
    ingredients_result = await session.run(
        """
        MATCH (r:Recipe {id: $id})-[rel:HAS_INGREDIENT]->(i:Ingredient)
        OPTIONAL MATCH (i)-[:HAS_SUBSTITUTE]->(sub:IngredientSubstitute)
        RETURN i.name as name, 
               i.category as category,
               rel.quantityValue as quantityValue,
               rel.quantityUnit as quantityUnit,
               rel.notes as notes,
               collect(DISTINCT sub.name) as substitutes
        """,
        id=recipe_id
    )
    
    # Group ingredients by category
    ingredients_by_category = {}
    async for ing_record in ingredients_result:
        category = ing_record["category"] or "lainnya"
        if category not in ingredients_by_category:
            ingredients_by_category[category] = []
        
        ingredient_item = {
            "name": ing_record["name"],
            "quantity": {
                "value": ing_record["quantityValue"],
                "unit": ing_record["quantityUnit"]
            },
            "notes": ing_record["notes"],
            "substitutes": [s for s in ing_record["substitutes"] if s]
        }
        ingredients_by_category[category].append(ingredient_item)
    
    # Convert to expected format (list of dicts with category keys)
    recipe_data['ingredients'] = [ingredients_by_category] if ingredients_by_category else []
    
    # Build cooking steps list
    cooking_steps = []
    for cs in record["cookingSteps"]:
        if cs:
            cooking_steps.append({
                "step": cs.get("step"),
                "title": cs.get("title"),
                "description": cs.get("description"),
                "duration": cs.get("duration"),
                "difficulty": cs.get("difficulty"),
                "image": cs.get("image"),
                "tips": cs.get("tips", [])
            })
    recipe_data['cookingSteps'] = sorted(cooking_steps, key=lambda x: x.get('step', 0))
    
    # Build cultural story
    if recipe_data.get('fullStory') or recipe_data.get('shortStory'):
        regional_variations = []
        for rv in record["regionalVariations"]:
            if rv:
                regional_variations.append({
                    "region": rv.get("region"),
                    "province": rv.get("province"),
                    "difference": rv.get("difference")
                })
        
        recipe_data['culturalStory'] = {
            "shortStory": recipe_data.get('shortStory'),
            "fullStory": recipe_data.get('fullStory'),
            "regionalVariations": regional_variations
        }
    else:
        recipe_data['culturalStory'] = None
    
    # Build budget data with stores
    stores_result = await session.run(
        """
        MATCH (r:Recipe {id: $id})-[:AVAILABLE_AT]->(s:Store)
        OPTIONAL MATCH (s)-[sells:SELLS]->(ing:Ingredient)
        RETURN s.name as storeName,
               s.address as address,
               s.openingHours as openingHours,
               s.estimatedDistance as estimatedDistance,
               s.latitude as lat,
               s.longitude as lng,
               collect(DISTINCT {
                   name: ing.name,
                   quantity: {
                       value: sells.quantityValue,
                       unit: sells.quantityUnit
                   },
                   estimatedPrice: sells.estimatedPrice,
                   note: sells.note
               }) as rincianBahan
        """,
        id=recipe_id
    )
    
    offline_stores = []
    async for store_record in stores_result:
        if store_record["storeName"]:
            store_data = {
                "name": store_record["storeName"],
                "address": store_record["address"],
                "openingHours": store_record["openingHours"],
                "estimatedDistance": store_record["estimatedDistance"],
                "location": {
                    "lat": store_record["lat"],
                    "lng": store_record["lng"]
                },
                "rincianBahan": [item for item in store_record["rincianBahan"] if item.get("name")]
            }
            offline_stores.append(store_data)
    
    recipe_data['budgetData'] = {"offlineStores": offline_stores} if offline_stores else None
    
    # Set description fallback
    recipe_data.setdefault('description', recipe_data.get('shortDescription', ''))
    
    return Recipe(**recipe_data)


async def get_multi(session: AsyncSession, skip: int = 0, limit: int = 10) -> List[Recipe]:
    """Get multiple recipes from Neo4j database with basic data"""
    result = await session.run(
        """
        MATCH (r:Recipe)
        RETURN r
        ORDER BY r.id
        SKIP $skip
        LIMIT $limit
        """,
        skip=skip,
        limit=limit
    )
    
    recipes = []
    async for record in result:
        recipe_data = dict(record["r"])
        
        # Set defaults for complex fields (list view doesn't need full details)
        recipe_data.setdefault('culturalStory', None)
        recipe_data.setdefault('budgetData', None)
        recipe_data.setdefault('ingredients', [])
        recipe_data.setdefault('cookingSteps', [])
        recipe_data.setdefault('description', recipe_data.get('shortDescription', ''))
        
        recipes.append(Recipe(**recipe_data))
    
    return recipes
