"""
Test script to verify Neo4j database contents
"""
import asyncio
from neo4j import AsyncGraphDatabase
from app.config.settings import settings


async def test_database():
    """Check Neo4j database contents"""
    driver = AsyncGraphDatabase.driver(
        settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )
    
    print("=" * 80)
    print("NEO4J DATABASE TEST")
    print("=" * 80)
    print(f"URI: {settings.NEO4J_URI}")
    print(f"User: {settings.NEO4J_USER}")
    print("=" * 80)
    
    try:
        async with driver.session() as session:
            # Test 1: Count all nodes
            print("\n1. COUNTING ALL NODES:")
            print("-" * 80)
            result = await session.run("MATCH (n) RETURN count(n) as total")
            record = await result.single()
            total_nodes = record["total"] if record else 0
            print(f"   Total nodes in database: {total_nodes}")
            
            # Test 2: Count nodes by label
            print("\n2. NODES BY LABEL:")
            print("-" * 80)
            result = await session.run("""
                MATCH (n)
                RETURN labels(n)[0] as label, count(n) as count
                ORDER BY count DESC
            """)
            async for record in result:
                print(f"   {record['label']}: {record['count']} nodes")
            
            # Test 3: List all recipes
            print("\n3. ALL RECIPES:")
            print("-" * 80)
            result = await session.run("""
                MATCH (r:Recipe)
                RETURN r.id, r.name, r.region, r.estimatedCost
            """)
            recipe_count = 0
            async for record in result:
                recipe_count += 1
                print(f"   Recipe {record['r.id']}: {record['r.name']}")
                print(f"      Region: {record['r.region']}")
                print(f"      Cost: Rp {record['r.estimatedCost']:,}")
                print()
            
            if recipe_count == 0:
                print("   ⚠️  NO RECIPES FOUND IN DATABASE!")
            else:
                print(f"   ✅ Total recipes: {recipe_count}")
            
            # Test 4: Check ingredients
            print("\n4. INGREDIENTS:")
            print("-" * 80)
            result = await session.run("MATCH (i:Ingredient) RETURN count(i) as total")
            record = await result.single()
            ingredient_count = record["total"] if record else 0
            print(f"   Total ingredients: {ingredient_count}")
            
            if ingredient_count > 0:
                result = await session.run("""
                    MATCH (i:Ingredient)
                    RETURN i.name, i.category
                    LIMIT 10
                """)
                print("   Sample ingredients:")
                async for record in result:
                    print(f"      - {record['i.name']} ({record.get('i.category', 'N/A')})")
            
            # Test 5: Check stores
            print("\n5. STORES:")
            print("-" * 80)
            result = await session.run("MATCH (s:Store) RETURN count(s) as total")
            record = await result.single()
            store_count = record["total"] if record else 0
            print(f"   Total stores: {store_count}")
            
            if store_count > 0:
                result = await session.run("""
                    MATCH (s:Store)
                    RETURN s.name, s.address
                """)
                async for record in result:
                    print(f"      - {record['s.name']}")
                    print(f"        {record['s.address']}")
            
            # Test 6: Check relationships
            print("\n6. RELATIONSHIPS:")
            print("-" * 80)
            result = await session.run("""
                MATCH ()-[r]->()
                RETURN type(r) as rel_type, count(r) as count
                ORDER BY count DESC
            """)
            total_rels = 0
            async for record in result:
                print(f"   {record['rel_type']}: {record['count']} relationships")
                total_rels += record['count']
            print(f"   Total relationships: {total_rels}")
            
            # Test 7: Check cooking steps
            print("\n7. COOKING STEPS:")
            print("-" * 80)
            result = await session.run("MATCH (cs:CookingStep) RETURN count(cs) as total")
            record = await result.single()
            steps_count = record["total"] if record else 0
            print(f"   Total cooking steps: {steps_count}")
            
            # Test 8: Full recipe data sample
            print("\n8. SAMPLE RECIPE WITH FULL DATA:")
            print("-" * 80)
            result = await session.run("""
                MATCH (r:Recipe {id: '1'})
                OPTIONAL MATCH (r)-[:HAS_INGREDIENT]->(i:Ingredient)
                OPTIONAL MATCH (r)-[:HAS_STEP]->(cs:CookingStep)
                OPTIONAL MATCH (r)-[:AVAILABLE_AT]->(s:Store)
                RETURN r, 
                       collect(DISTINCT i.name) as ingredients,
                       collect(DISTINCT cs.step) as steps,
                       collect(DISTINCT s.name) as stores
            """)
            record = await result.single()
            
            if record:
                recipe = record['r']
                print(f"   Recipe: {recipe['name']}")
                print(f"   ID: {recipe['id']}")
                print(f"   Description: {recipe.get('shortDescription', 'N/A')}")
                print(f"   Region: {recipe.get('region', 'N/A')}")
                print(f"   Difficulty: {recipe.get('difficulty', 'N/A')}")
                print(f"   Time: {recipe.get('cookingTimeMinutes', 'N/A')} minutes")
                print(f"   Servings: {recipe.get('servings', 'N/A')}")
                print(f"   Cost: Rp {recipe.get('estimatedCost', 0):,}")
                
                ingredients = record['ingredients']
                if ingredients and ingredients != [None]:
                    print(f"\n   Ingredients ({len(ingredients)}):")
                    for ing in ingredients[:5]:
                        if ing:
                            print(f"      - {ing}")
                    if len(ingredients) > 5:
                        print(f"      ... and {len(ingredients) - 5} more")
                else:
                    print("\n   ⚠️  No ingredients linked!")
                
                steps = record['steps']
                if steps and steps != [None]:
                    print(f"\n   Cooking Steps: {len(steps)} steps")
                else:
                    print("\n   ⚠️  No cooking steps linked!")
                
                stores = record['stores']
                if stores and stores != [None]:
                    print(f"\n   Available at {len(stores)} stores:")
                    for store in stores:
                        if store:
                            print(f"      - {store}")
                else:
                    print("\n   ⚠️  No stores linked!")
            else:
                print("   ⚠️  Recipe with ID '1' not found!")
            
            # Summary
            print("\n" + "=" * 80)
            print("SUMMARY:")
            print("=" * 80)
            if total_nodes == 0:
                print("❌ DATABASE IS EMPTY! Migration might have failed.")
                print("   Please run: python -m app.migration")
            elif recipe_count == 0:
                print("⚠️  Database has nodes but NO RECIPES!")
                print("   Check migration script.")
            else:
                print(f"✅ Database contains data:")
                print(f"   - {recipe_count} recipe(s)")
                print(f"   - {ingredient_count} ingredient(s)")
                print(f"   - {store_count} store(s)")
                print(f"   - {steps_count} cooking step(s)")
                print(f"   - {total_rels} total relationships")
            print("=" * 80)
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await driver.close()


if __name__ == "__main__":
    print("\nStarting Neo4j database test...\n")
    asyncio.run(test_database())
    print("\nTest completed!")

