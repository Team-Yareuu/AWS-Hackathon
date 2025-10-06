from neo4j import AsyncGraphDatabase
from app.config.settings import settings

driver = None

def get_driver():
    """
    Returns the Neo4j driver instance, initializing it if necessary.
    """
    global driver
    if driver is None:
        driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
            max_connection_lifetime=300,  # 5 minutes (shorter to avoid stale connections)
            max_connection_pool_size=50,
            connection_acquisition_timeout=60,
            connection_timeout=30,  # Add connection timeout
            keep_alive=True,
            max_transaction_retry_time=30  # Add retry time for failed transactions
        )
    return driver

async def get_session():
    """
    Provides a Neo4j session for dependency injection.
    """
    driver = get_driver()
    async with driver.session() as session:
        yield session

async def close_driver():
    """
    Closes the Neo4j driver connection.
    """
    global driver
    if driver is not None:
        await driver.close()
        driver = None
