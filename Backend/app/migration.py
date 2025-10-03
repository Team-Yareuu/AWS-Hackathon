import asyncio
import json
from pathlib import Path
from neo4j import AsyncGraphDatabase
from app.config.settings import settings

async def migrate_data():
    """
    Connects to Neo4j, cleans the database, and populates it with a rich set of
    Indonesian culinary data including recipes, ingredients, cuisines, techniques,
    and dietary preferences from a JSON file.
    """
    driver = AsyncGraphDatabase.driver(settings.NEO4J_URI, auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD))
    
    # Load data from JSON file
    data_path = Path(__file__).parent / "data" / "sample_recipes.json"
    try:
        with open(data_path, 'r', encoding='utf-8') as f:
            recipes = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading data file: {e}")
        return

    async with driver.session() as session:
        print("Cleaning up the database...")
        await session.run("MATCH (n) DETACH DELETE n")

        print("Creating constraints...")
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (r:Recipe) REQUIRE r.id IS UNIQUE")
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (i:Ingredient) REQUIRE i.name IS UNIQUE")
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (s:Store) REQUIRE s.name IS UNIQUE")

        print(f"Starting to migrate {len(recipes)} recipes...")
        for recipe_data in recipes:
            recipe_props = {
                "id": recipe_data.get("id"),
                "name": recipe_data.get("name"),
                "shortDescription": recipe_data.get("shortDescription"),
                "description": recipe_data.get("shortDescription"),
                "image": recipe_data.get("image"),
                "difficulty": recipe_data.get("difficulty"),
                "cookingTimeMinutes": recipe_data.get("cookingTimeMinutes"),
                "servings": recipe_data.get("servings"),
                "estimatedCost": recipe_data.get("estimatedCost"),
                "region": recipe_data.get("region"),
                "isTraditional": recipe_data.get("isTraditional"),
                "isNew": recipe_data.get("isNew")
            }

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
                **recipe_props
            )

            cultural_story = recipe_data.get("culturalStory") or {}
            if cultural_story:
                await session.run(
                    """
                    MATCH (r:Recipe {id: $recipe_id})
                    SET r.fullStory = $fullStory,
                        r.shortStory = $shortStory
                    """,
                    recipe_id=recipe_data.get("id"),
                    fullStory=cultural_story.get("fullStory"),
                    shortStory=cultural_story.get("shortStory")
                )

                for variation in cultural_story.get("regionalVariations", []):
                    await session.run(
                        """
                        MATCH (r:Recipe {id: $recipe_id})
                        MERGE (rv:RegionalVariation {region: $region, province: $province})
                        SET rv.difference = $difference
                        MERGE (r)-[:HAS_VARIATION]->(rv)
                        """,
                        recipe_id=recipe_data.get("id"),
                        region=variation.get("region"),
                        province=variation.get("province"),
                        difference=variation.get("difference")
                    )

            # Ingredients (flatten grouped structure)
            for group in recipe_data.get("ingredients", []):
                for category, items in group.items():
                    for item in items:
                        quantity = item.get("quantity", {})
                        quantity_value = quantity.get("value")
                        unit = quantity.get("unit")

                        await session.run(
                            """
                            MERGE (i:Ingredient {name: $name})
                            SET i.category = $category
                            WITH i
                            MATCH (r:Recipe {id: $recipe_id})
                            MERGE (r)-[rel:HAS_INGREDIENT]->(i)
                            SET rel.quantityValue = $quantity_value,
                                rel.quantityUnit = $quantity_unit,
                                rel.notes = $notes
                            """,
                            name=item.get("name"),
                            category=category,
                            recipe_id=recipe_data.get("id"),
                            quantity_value=quantity_value,
                            quantity_unit=unit,
                            notes=item.get("notes")
                        )

                        for substitute in item.get("substitutes", []):
                            await session.run(
                                """
                                MERGE (s:IngredientSubstitute {name: $substitute})
                                WITH s
                                MATCH (i:Ingredient {name: $ingredient_name})
                                MERGE (i)-[:HAS_SUBSTITUTE]->(s)
                                """,
                                substitute=substitute,
                                ingredient_name=item.get("name")
                            )

            # Budget data
            budget_data = (recipe_data.get("budgetData") or {}).get("offlineStores", [])
            for store in budget_data:
                await session.run(
                    """
                    MERGE (s:Store {name: $name})
                    SET s.address = $address,
                        s.openingHours = $openingHours,
                        s.estimatedDistance = $estimatedDistance,
                        s.latitude = $lat,
                        s.longitude = $lng
                    WITH s
                    MATCH (r:Recipe {id: $recipe_id})
                    MERGE (r)-[:AVAILABLE_AT]->(s)
                    """,
                    name=store.get("name"),
                    address=store.get("address"),
                    openingHours=store.get("openingHours"),
                    estimatedDistance=store.get("estimatedDistance"),
                    lat=((store.get("location") or {}).get("lat")),
                    lng=((store.get("location") or {}).get("lng")),
                    recipe_id=recipe_data.get("id")
                )

                for detail in store.get("rincianBahan", []):
                    quantity = detail.get("quantity", {})
                    await session.run(
                        """
                        MATCH (s:Store {name: $store_name})
                        MERGE (i:Ingredient {name: $ingredient_name})
                        MERGE (s)-[rel:SELLS]->(i)
                        SET rel.estimatedPrice = $estimatedPrice,
                            rel.quantityValue = $quantity_value,
                            rel.quantityUnit = $quantity_unit,
                            rel.note = $note
                        """,
                        store_name=store.get("name"),
                        ingredient_name=detail.get("name"),
                        estimatedPrice=detail.get("estimatedPrice"),
                        quantity_value=quantity.get("value"),
                        quantity_unit=quantity.get("unit"),
                        note=detail.get("note")
                    )

            # Cooking steps
            for step in recipe_data.get("cookingSteps", []):
                await session.run(
                    """
                    MATCH (r:Recipe {id: $recipe_id})
                    MERGE (cs:CookingStep {recipeId: $recipe_id, step: $step})
                    SET cs.title = $title,
                        cs.description = $description,
                        cs.duration = $duration,
                        cs.difficulty = $difficulty,
                        cs.image = $image,
                        cs.tips = $tips
                    MERGE (r)-[:HAS_STEP]->(cs)
                    """,
                    recipe_id=recipe_data.get("id"),
                    step=step.get("step"),
                    title=step.get("title"),
                    description=step.get("description"),
                    duration=step.get("duration"),
                    difficulty=step.get("difficulty"),
                    image=step.get("image"),
                    tips=step.get("tips")
                )

            print(f"  - Migrated recipe: {recipe_data.get('name')}")

    await driver.close()
    print("Migration completed successfully!")

if __name__ == "__main__":
    # This allows running the migration script directly
    print("Running database migration...")
    asyncio.run(migrate_data())