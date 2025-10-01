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
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (c:Cuisine) REQUIRE c.name IS UNIQUE")
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE")
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (dp:DietaryPreference) REQUIRE dp.name IS UNIQUE")
        await session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (ct:CookingTechnique) REQUIRE ct.name IS UNIQUE")

        print(f"Starting to migrate {len(recipes)} recipes...")
        for recipe_data in recipes:
            # 1. Create Recipe Node
            await session.run("""
                CREATE (r:Recipe {
                    id: $id, name: $name, description: $description, image: $image,
                    difficulty: $difficulty, cookingTime: $cookingTime, servings: $servings,
                    estimatedCost: $estimatedCost, region: $region
                })
            """, **recipe_data)

            # 2. Create and Link Cuisine
            await session.run("""
                MERGE (c:Cuisine {name: $cuisine_name})
                WITH c
                MATCH (r:Recipe {id: $recipe_id})
                MERGE (r)-[:BELONGS_TO_CUISINE]->(c)
            """, cuisine_name=recipe_data["cuisine"], recipe_id=recipe_data["id"])

            # 3. Create and Link Ingredients
            for ingredient in recipe_data["ingredients"]:
                await session.run("""
                    MERGE (i:Ingredient {name: $name})
                    WITH i
                    MATCH (r:Recipe {id: $recipe_id})
                    MERGE (r)-[:HAS_INGREDIENT {quantity: $quantity}]->(i)
                """, name=ingredient["name"], recipe_id=recipe_data["id"], quantity=ingredient["quantity"])

            # 4. Create and Link Cooking Techniques
            for technique in recipe_data["techniques"]:
                await session.run("""
                    MERGE (ct:CookingTechnique {name: $technique_name})
                    WITH ct
                    MATCH (r:Recipe {id: $recipe_id})
                    MERGE (r)-[:USES_TECHNIQUE]->(ct)
                """, technique_name=technique, recipe_id=recipe_data["id"])

            # 5. Create and Link Dietary Preferences
            for dietary_pref in recipe_data["dietary"]:
                await session.run("""
                    MERGE (dp:DietaryPreference {name: $dietary_name})
                    WITH dp
                    MATCH (r:Recipe {id: $recipe_id})
                    MERGE (r)-[:SUITABLE_FOR]->(dp)
                """, dietary_name=dietary_pref, recipe_id=recipe_data["id"])

            print(f"  - Migrated recipe: {recipe_data['name']}")

    await driver.close()
    print("Migration completed successfully!")

if __name__ == "__main__":
    # This allows running the migration script directly
    print("Running database migration...")
    asyncio.run(migrate_data())