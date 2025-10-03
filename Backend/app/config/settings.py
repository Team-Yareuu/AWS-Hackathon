from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    AWS_REGION : str = "us-east-1"
    NEO4J_URI: str = "neo4j+s://06ad204b.databases.neo4j.io"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "oW_2ABAMPHHR4ErTvY8hJT2HM6kMbLGo8fj1wYTtFxQ"
    SECRET_KEY: str = "a_very_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    API_V1_STR: str = "/api/v1"

    class Config:
        env_file = ".env"

settings = Settings()
