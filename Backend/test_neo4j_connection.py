"""
Simple script to test Neo4j connection
"""
import asyncio
from neo4j import AsyncGraphDatabase
from app.config.settings import settings

async def test_connection():
    """Test Neo4j connection"""
    print("Testing Neo4j connection...")
    print(f"URI: {settings.NEO4J_URI}")
    print(f"User: {settings.NEO4J_USER}")
    print(f"Password: {'*' * len(settings.NEO4J_PASSWORD)}")
    
    try:
        driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )
        
        async with driver.session() as session:
            result = await session.run("RETURN 1 as test")
            record = await result.single()
            print(f"\n✅ Connection successful! Test query returned: {record['test']}")
            
            # Check if we have any recipes
            result = await session.run("MATCH (r:Recipe) RETURN count(r) as count")
            record = await result.single()
            recipe_count = record['count']
            print(f"📊 Number of recipes in database: {recipe_count}")
            
            if recipe_count == 0:
                print("\n⚠️  Database is empty! You need to run the migration script:")
                print("   cd Backend && python -m app.migration")
        
        await driver.close()
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed!")
        print(f"Error: {str(e)}")
        print("\n💡 Possible solutions:")
        print("   1. Check if Neo4j credentials in settings.py are correct")
        print("   2. Check if Neo4j database is running and accessible")
        print("   3. Check if firewall is blocking the connection")
        print("   4. Update credentials in app/config/settings.py or create a .env file")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
